import { useState } from "react"
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { Button } from "./ui/button"
import { BookPlus } from 'lucide-react'
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Checkbox } from "./ui/checkbox"
import { ScrollArea } from "./ui/scroll-area"
import { BookCollectionProps } from "@/types"
import mockData from '../mockData/mockData.json'

import { useBookCollectionStore } from "@/store/bookCollectionStore"

type FormSchemaKeys = keyof z.infer<typeof formSchema>;

// Fields Validation
const formSchema = z.object({
  title: z.string().min(3).max(50),
  author: z.string().min(3).max(50),
  genre: z.string().min(3).max(50),
  rating: z.coerce.number().min(1).max(5),
  categories: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: "You have to select at least one category.",
  }),
  tags: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: "You have to select at least one tag.",
  }),
})

function AddBookDrawer() {
  const [open, setOpen] = useState(false)
  const { books, saveBookInfo } = useBookCollectionStore()

  const defaultFormValues = {
    title: "",
    author: "",
    genre: "",
    rating: 0,
    categories: [],
    tags: []
  }
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultFormValues
  })

  function onSubmit(values: Omit<BookCollectionProps, 'id'>) {
    const newBook: BookCollectionProps = {
      ...values,
      id: books.length + 1,
    }
    const updatedBooks = [newBook, ...books]

    form.trigger()

    saveBookInfo(updatedBooks)
    form.reset(defaultFormValues)
    setOpen(false)
  }

  const fieldsInput: { name: FormSchemaKeys; label: string }[] = [
    { name: "title", label: "Title" },
    { name: "author", label: "Author" },
    { name: "genre", label: "Genre" },
    { name: "rating", label: "Rating" },
  ]

  return (
    <Drawer direction='right' open={open} onOpenChange={setOpen} >
      {/* OPEN DRAWER */}
      <DrawerTrigger asChild>
        <Button variant='secondary' className='flex gap-2'>
          <BookPlus size={18} />
          Add book
        </Button>
      </DrawerTrigger>

      {/* DRAWER CONTENT */}
      <DrawerContent className='h-screen top-0 right-0 left-auto mt-0 w-[500px] rounded-none px-4'>
        <ScrollArea>
          <DrawerHeader className="px-0">
            <DrawerTitle>Add new Book</DrawerTitle>
          </DrawerHeader>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4 px-2"
            >
              {fieldsInput.map(({ name, label }, idx) => (
                <FormField
                  key={idx}
                  control={form.control}
                  name={name}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{label}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={`Inform ${name.toLocaleLowerCase()}`}
                          onError={() => 'hello'}
                          onErrorCapture={() => 'hello'}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}

            {/* CATEGORIES */}
            <FormField
              control={form.control}
              name="categories"
              render={() => (
                <FormItem>
                  <FormLabel>Categories</FormLabel>
                  <ScrollArea className="h-52 w-full px-2 gap-2 rounded-md border">
                  {mockData.categories.map((item) => (
                    <FormField
                      key={item.id}
                      control={form.control}
                      name="categories"
                      render={({ field }) => {
                        return (
                          <FormItem
                            key={item.id}
                            className="flex flex-row items-center my-2"
                          >
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(item.id)}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([...field.value, item.id])
                                    : field.onChange(
                                        field.value?.filter(
                                          (value) => value !== item.id
                                        )
                                      )
                                }}
                              />
                            </FormControl>
                            <FormLabel style={{ margin: 0 }} className="text-sm font-normal px-2 ">
                              {item.label}
                            </FormLabel>
                          </FormItem>
                        )
                      }}
                    />
                  ))}
                </ScrollArea>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* TAGS */}
            <FormField
              control={form.control}
              name="tags"
              render={() => (
                <FormItem>
                  <FormLabel>Tags</FormLabel>
                  <ScrollArea className="h-52 w-full px-2 gap-2 rounded-md border">
                  {mockData.tags.map((item) => (
                    <FormField
                      key={item.id}
                      control={form.control}
                      name="tags"
                      render={({ field }) => {
                        return (
                          <FormItem
                            key={item.id}
                            className="flex flex-row items-center my-2"
                          >
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(item.id)}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([...field.value, item.id])
                                    : field.onChange(
                                        field.value?.filter(
                                          (value) => value !== item.id
                                        )
                                      )
                                }}
                              />
                            </FormControl>
                            <FormLabel style={{ margin: 0 }} className="text-sm font-normal px-2 ">
                              {item.label}
                            </FormLabel>
                          </FormItem>
                        )
                      }}
                    />
                  ))}
                </ScrollArea>
                  <FormMessage />
                </FormItem>
              )}
            />
              <Button type="submit">Submit</Button>
            </form>
          </Form>
        </ScrollArea>
      </DrawerContent>
    </Drawer>
  )
}

export default AddBookDrawer
