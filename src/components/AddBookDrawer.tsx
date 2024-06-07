import React, { useEffect } from "react"
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

import { useBookCollectionStore, defaultFormValues } from "@/store/bookCollectionStore"
import { useAppStore } from "@/store/appStore"

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
  const { books, setSelectedBook, setBooks, selectedBook } = useBookCollectionStore()
  const { displayForm, setDisplayForm } = useAppStore()
  
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

    setBooks(updatedBooks)
    form.reset(defaultFormValues)
    setDisplayForm(false)
  }

  const onUpdateBook = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()

    const tempBooksArray = books
    const findBooks = tempBooksArray.find(book => book.id === selectedBook.id)

    if(findBooks)
      Object.assign(findBooks, form.getValues())
  
    setBooks(tempBooksArray)
    setDisplayForm(false)
  }

  const fieldsInput: { name: FormSchemaKeys; label: string }[] = [
    { name: "title", label: "Title" },
    { name: "author", label: "Author" },
    { name: "genre", label: "Genre" },
    { name: "rating", label: "Rating" },
  ]

  const closeDrawer = () => {
    setDisplayForm(false)
    setSelectedBook({ ...defaultFormValues, id: -1})
  }

  useEffect(() => {
    if(selectedBook.id !== -1 && displayForm) {
      form.setValue("title", selectedBook.title)
      form.setValue("author", selectedBook.author)
      form.setValue("genre", selectedBook.genre)
      selectedBook.rating !== undefined && form.setValue("rating", selectedBook.rating)
      selectedBook.categories !== undefined && form.setValue("categories", selectedBook.categories)
      selectedBook.tags !== undefined && form.setValue("tags", selectedBook.tags)
    } else {
      form.reset()
    }
  }, [displayForm])

  return (
    <Drawer direction='right' open={displayForm} onClose={closeDrawer} onOpenChange={setDisplayForm} >
      {/* OPEN DRAWER */}
      <DrawerTrigger asChild>
        <Button onClick={() => setDisplayForm(true)} variant='secondary' className='flex gap-2'>
          <BookPlus size={18} />
          Add Book
        </Button>
      </DrawerTrigger>

      {/* DRAWER CONTENT */}
      <DrawerContent className='h-screen top-0 right-0 left-auto mt-0 w-[500px] rounded-none px-4'>
        <ScrollArea>
          <DrawerHeader className="px-0">
            <DrawerTitle>{selectedBook.id !== -1 ? 'Update Book' : 'Add Book'}</DrawerTitle>
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
              {selectedBook.id !== -1 ? (
                <Button onClick={(e) => onUpdateBook(e)}>Update</Button>
              ) : (
                <Button type="submit">Submit</Button>
              )}
            </form>
          </Form>
        </ScrollArea>
      </DrawerContent>
    </Drawer>
  )
}

export default AddBookDrawer
