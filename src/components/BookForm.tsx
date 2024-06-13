import React, { useEffect } from "react"
import { DrawerHeader, DrawerTitle } from "@/components/ui/drawer"
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
import uuid from 'react-uuid';

import { useBookCollectionStore } from "@/store/bookCollectionStore"
import { useAppStore } from "@/store/appStore"
import DrawerComponent from "./DrawerComponent"
import { useToast } from "@/components/ui/use-toast"
import { Info } from "lucide-react"
import { cn } from "@/lib/utils";

function BookForm() {
  const { books, setBooks, selectedBook, categories, tags } = useBookCollectionStore()
  const { drawerMode, setDrawerMode } = useAppStore()

  const { toast } = useToast()

  // Fields Validation
  const formSchema = z.object({
    title: z.string().min(3).max(50).refine(
      (val) => !books.map(({ title }) => title).includes(val), {
        message: "This title already exists"
      }
    ),
    author: z.string().min(3).max(50),
    genre: z.string().min(3).max(50),
    rating: z.coerce.number().min(1).max(5),
    categories: z.array(z.string()).refine((val => val.length > 0), {
      message: 'You have to select at least one category.',
    }),
    tags: z.array(z.string()).refine((value) => value.some((item) => item), {
      message: "You have to select at least one tag.",
    }),
  })

  const defaultFormValues = {
    categories: [],
    tags: [],
    title: "",
    author: "",
    genre: "",
    rating: 5,
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultFormValues
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    const selectedCategories = categories.filter(category => values.categories.includes(category.label))
    const selectedTags = tags.filter(tag => values.tags.includes(tag.label))

    const newBook: BookCollectionProps = {
      ...values,
      id: uuid(),
      categories: selectedCategories,
      tags: selectedTags,
    }
    const updatedBooks = [newBook, ...books]

    toast({
      title: "Hurray!",
      description: "Your book was add to our records",
      className: cn(
        'top-0 right-0 flex fixed md:max-w-[420px] md:top-4 md:right-4 text-start'
      ),
    })

    form.trigger()

    setBooks(updatedBooks)
    form.reset()
    setDrawerMode(null)
  }

  const onUpdateBook = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()

    const formValues = form.getValues()
    const updatedCategories = categories.filter(category => formValues.categories.includes(category.label))
    const updatedTags = tags.filter(tag => formValues.tags.includes(tag.label))

    const updatedBook = {
      id: selectedBook.id,
      title: formValues.title,
      author: formValues.author,
      genre: formValues.genre,
      rating: formValues.rating,
      categories: updatedCategories,
      tags: updatedTags
    }
    const tempBooksArray = books
    const findBooks = tempBooksArray.find(book => book.id === selectedBook.id)

    if (findBooks)
      Object.assign(findBooks, updatedBook)

    toast({
      title: "Book updated!",
      description: "Your book was updated ans can be reviewd on the data table",
      className: cn(
        'top-0 right-0 flex fixed md:max-w-[420px] md:top-4 md:right-4 text-start'
      ),
    })

    setBooks(tempBooksArray)
    setDrawerMode(null)
  }

  const fieldsInput: { name: string; label: string }[] = [
    { name: "title", label: "Title" },
    { name: "author", label: "Author" },
    { name: "genre", label: "Genre" },
    { name: "rating", label: "Rating" },
  ]

  useEffect(() => {
    if (selectedBook.id !== '' && drawerMode === 'form') {
      form.setValue("title", selectedBook.title)
      form.setValue("author", selectedBook.author)
      form.setValue("genre", selectedBook.genre)
      selectedBook.rating !== undefined && form.setValue("rating", selectedBook.rating)
      selectedBook.categories !== undefined && form.setValue("categories", selectedBook.categories.map(item => item.label))
      selectedBook.tags !== undefined && form.setValue("tags", selectedBook.tags.map(item => item.label))
    } else {
      form.reset()
    }
  }, [drawerMode])

  return (
    <DrawerComponent
      item="form"
      triggerButton={(
        <Button
          onClick={() => setDrawerMode('form')}
          variant='secondary'
          className='flex gap-2'
        >
          <BookPlus size={18} />
          Add Book
        </Button>
      )}
    >
      <>
      <DrawerHeader className="px-0">
        <DrawerTitle>{selectedBook.id !== '' ? 'Update Book' : 'Add Book'}</DrawerTitle>
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
              name={name as keyof z.infer<typeof formSchema>}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{label}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={`Inform ${name.toLocaleLowerCase()}`}
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
                  {categories.length !== 0 ? categories.map((item) => (
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
                                checked={field.value?.includes(item.label)}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([...field.value, item.label])
                                    : field.onChange(
                                      field.value?.filter(
                                        (value) => value !== item.label
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
                  )) : (
                    <div className="flex items-center gap-2">
                      <Info size="12" /><span className="text-sm text-slate-500">Go to Settings and add some Categories before proceeding</span>
                    </div>
                  )}
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
                  {tags.length !== 0 ? tags.map((item) => (
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
                                checked={field.value?.includes(item.label)}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([...field.value, item.label])
                                    : field.onChange(
                                      field.value?.filter(
                                        (value) => value !== item.label
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
                  )) : (
                    <div className="flex items-center gap-2">
                      <Info size="12" /><span className="text-sm text-slate-500">Go to Settings and add some Tags before proceeding</span>
                    </div>
                  )}
                </ScrollArea>
                <FormMessage />
              </FormItem>
            )}
          />
          {selectedBook.id !== '' ? (
            <Button onClick={(e) => onUpdateBook(e)}>Update</Button>
          ) : (
            <Button type="submit" disabled={categories.length === 0 || tags.length === 0}>Submit</Button>
          )}
        </form>
      </Form>
      </>
    </DrawerComponent>
  )
}

export default BookForm
