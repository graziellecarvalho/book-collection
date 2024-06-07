import {
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Settings, X } from "lucide-react";
import { useAppStore } from "@/store/appStore";
import DrawerComponent from "./DrawerComponent";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, UseFormReturn } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useBookCollectionStore } from "@/store/bookCollectionStore";
import { CategoriesTagsProps } from "@/types";
import uuid from 'react-uuid';
import { useToast } from "@/components/ui/use-toast"
import { cn } from "@/lib/utils";

function SettingsDrawer() {
  const { setDrawerMode } = useAppStore();
  const {
    books,
    setCategories,
    setTags,
    tags,
    categories,
    removeCategories,
    removeTags,
    setSelectedCategory,
    setSelectedTag,
    selectedCategory,
    selectedTag,
  } = useBookCollectionStore();

  const { toast } = useToast()

  const categorySchema = z.object({
    category: z
      .string()
      .min(3, { message: "Category should contain at least 3 char" })
      .max(50)
      .refine((val) => !categories.map((cat) => cat.label).includes(val), {
        message: "This category already exists",
      }),
  });
  
  const tagSchema = z.object({
    tag: z
      .string()
      .min(2, { message: "Tag should contain at least 2 char" })
      .max(50)
      .refine((val) => !tags.map((tag) => tag.label).includes(val), {
        message: "This tag already exists",
      }),
  });

  const categoryForm = useForm({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      category: "",
    },
  });

  const removeCat = (id: string) => {4
    if (books.find(book => book?.categories?.some(cat => cat.id === id)) !== undefined) {
      toast({
        title: "Careful!",
        description: `Category "${categories.find(cat => cat.id === id)?.label}" is associated with a book`,
        className: cn(
          'top-0 right-0 flex fixed md:max-w-[420px] md:top-4 md:right-4 text-start'
        ),
        variant: "destructive",
      })
    } else {
      removeCategories(id)
    }
  }

  const removeTag = (id: string) => {4
    if (books.find(book => book?.tags?.some(tag => tag.id === id)) !== undefined) {
      toast({
        title: "Careful!",
        description: `Tag "${tags.find(tag => tag.id === id)?.label}" is associated with a book`,
        className: cn(
          'top-0 right-0 flex fixed md:max-w-[420px] md:top-4 md:right-4 text-start'
        ),
        variant: "destructive",
      })
    } else {
      removeTags(id)
    }
  }

  const tagForm = useForm({
    resolver: zodResolver(tagSchema),
    defaultValues: {
      tag: "",
    },
  });

  const handleFormSubmit = (
    items: CategoriesTagsProps[],
    setItems: (items: CategoriesTagsProps[]) => void,
    selectedItem: CategoriesTagsProps,
    setSelectedItem: (item: CategoriesTagsProps) => void,
    form: UseFormReturn<any>,
    field: string,
    value: any
  ) => {
    const tempItems = items;
    const findItem = tempItems.find((item) => item.id === selectedItem.id);

    if (findItem) {
      const result = { id: selectedItem.id, label: value[field] };
      Object.assign(findItem, result);
      setItems(tempItems);
    } else {
      const result = { id: uuid(), label: value[field] };
      const updatedItems = [result, ...items];
      setItems(updatedItems);
    }

    form.trigger()

    setSelectedItem({ id: '', label: "" });
    form.setValue(field, "");
  };

  const handleEditItem = (
    setSelectedItem: (item: CategoriesTagsProps) => void,
    form: UseFormReturn<any>,
    field: string,
    data: CategoriesTagsProps
  ) => {
    setSelectedItem(data);
    form.setValue(field, data.label);
  };

  return (
    <DrawerComponent
      item="settings"
      triggerButton={
        <Button onClick={() => setDrawerMode("settings")} variant="secondary" className="flex gap-2">
          <Settings size={18} />
          Settings
        </Button>
      }
    >
      <DrawerHeader className="px-0">
        <DrawerTitle>Settings</DrawerTitle>
      </DrawerHeader>

      <div className="flex flex-col gap-6">
        <Section
          title="Categories"
          items={categories}
          form={categoryForm}
          selectedItem={selectedCategory}
          setSelectedItem={setSelectedCategory}
          onSubmit={(value) =>
            handleFormSubmit(categories, setCategories, selectedCategory, setSelectedCategory, categoryForm, "category", value)
          }
          onEdit={(data) => handleEditItem(setSelectedCategory, categoryForm, "category", data)}
          // removeItem={removeCategories}
          removeItem={removeCat}
          formField="category"
        />

        <Section
          title="Tags"
          items={tags}
          form={tagForm}
          selectedItem={selectedTag}
          setSelectedItem={setSelectedTag}
          onSubmit={(value) =>
            handleFormSubmit(tags, setTags, selectedTag, setSelectedTag, tagForm, "tag", value)
          }
          onEdit={(data) => handleEditItem(setSelectedTag, tagForm, "tag", data)}
          removeItem={removeTag}
          formField="tag"
        />
      </div>
    </DrawerComponent>
  );
}

interface SectionProps {
  title: string;
  items: CategoriesTagsProps[];
  form: UseFormReturn<any>;
  selectedItem: CategoriesTagsProps;
  setSelectedItem: (item: CategoriesTagsProps) => void;
  onSubmit: (value: any) => void;
  onEdit: (data: CategoriesTagsProps) => void;
  removeItem: (id: string) => void;
  formField: string;
}

const Section: React.FC<SectionProps> = ({
  title,
  items,
  form,
  selectedItem,
  onSubmit,
  onEdit,
  removeItem,
  formField,
}) => (
  <div>
    <strong className="text-md">{title}</strong>
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="flex items-end gap-2">
          <FormField
            control={form.control}
            name={formField}
            render={({ field }) => (
              <FormItem className="w-4/5">
                <FormControl>
                  <Input {...field} placeholder={`New ${title === 'Categories' ? 'Category' : 'Tag'}`} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button variant="secondary" className="m-0 w-1/5" type="submit">
            {selectedItem.id === '' ? "Submit" : "Update"}
          </Button>
        </div>
      </form>
    </Form>
    <div className="flex gap-1 flex-wrap w-full h-fit my-2">
      {items.map((item) => (
        <Badge variant="secondary" className="flex gap-2 w-fit" key={item.id}>
          <Button className="p-0 m-0 h-fit w-fit" onClick={() => onEdit(item)} variant="ghost">
            {item.label}
          </Button>
          <X size="12" onClick={() => removeItem(item.id)} />
        </Badge>
      ))}
    </div>
    <span className="text-[12px]">Click on the badge to edit, or on X to remove</span>
  </div>
);

export default SettingsDrawer;