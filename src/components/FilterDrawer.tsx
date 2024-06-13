import { Button } from "./ui/button"
import { Filter } from 'lucide-react'
import { useAppStore } from "@/store/appStore"
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
import { BookCollectionProps } from "@/types"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { useBookCollectionStore } from "@/store/bookCollectionStore"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from './ui/input'
import { useToast } from "@/components/ui/use-toast"
import { cn } from "@/lib/utils";
import { useState } from "react"

function FilterDrawer() {
  const { setDrawerMode } = useAppStore()
  const { setFilter, categories, tags, books, removeFilter } = useBookCollectionStore()
  const { toast } = useToast()

  const [selectedTypeState, setSelectedTypeState] = useState('')

  // Fields Validation
  const filterSchema = z.object({
    type: z.string({ required_error: "Please select an item" }),
    value: z.string().min(3, { message: 'At least 3 character(s)' }).max(50).optional(),
    ratingValue: z.coerce.number().optional(),
    categories: z.string({ required_error: "Please select an item" }).optional(),
    tags: z.string({ required_error: "Please select an item" }).optional(),
  })

  const defaultFormValues = (type: string) => {
    let returnedValues = {}
    switch (type) {
      case "title":
      case "author":
      case "genre":
        returnedValues = { type, value: '' }
        break
      case 'rating':
        returnedValues = { type, ratingValue: 0 }
        break;
      case 'categories':
        returnedValues = { type, categories: '' }
        break;
      case 'tags':
        returnedValues = { type, tags: '' }
        break;
    }
    return returnedValues;
  }

  const form = useForm<z.infer<typeof filterSchema>>({
    resolver: zodResolver(filterSchema),
    defaultValues: defaultFormValues(selectedTypeState)
  })

  function onFilter(value: z.infer<typeof filterSchema>) {
    const tempBooks = books
    let filter: BookCollectionProps[] = []

    switch(value.type) {
      case "title":
      case "author":
      case "genre":
        filter = tempBooks.filter(book => (book[value.type as keyof BookCollectionProps] as string).toLowerCase().includes(value?.value?.toLowerCase() as string));
        break
      case 'rating':
        filter = tempBooks.filter(book => book.rating === value.ratingValue);
        break;
      case 'categories':
        filter = tempBooks.filter(book => book.categories?.some(item => item.id === value.categories))
        break;
      case 'tags':
        filter = tempBooks.filter(book => book.tags?.some(item => item.id === value.tags))
        break;
    }

    if (filter.length === 0) {
      toast({
        title: "Oh no!",
        description: `No books where found with that filter`,
        className: cn(
          'top-0 right-0 flex fixed md:max-w-[420px] md:top-4 md:right-4 text-start'
        ),
      })
    }
    setFilter(filter)
  }

  const onRemoveFilter = () => {
    removeFilter()
    form.reset()
  }


  return (
    <Collapsible className="relative">
      <CollapsibleTrigger className="flex items-center text-sm py-2 px-4 gap-2 bg-[#f4f4f5] rounded-md" type="button" onClick={() => setDrawerMode('filter')}>
          <Filter size={16} />
          Filter
        {/* </Button> */}
      </CollapsibleTrigger>
      <CollapsibleContent className="md:relative absoltute md:h-[105px]">
        <div className="flex items-end absolute top-2 md:w-[600px] w-92 md:h-[105px] bg-white right-0 rounded-lg md:shadow-none shadow-2xl md:top-2 top-10" style={{ zIndex: '20' }}>
          {/* FORM */}
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onFilter)}
              className="px-2 flex md:flex-row flex-col items-end m-0 py-4 gap-2"
            >
              {/* SELECT - TYPE */}
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem className="flex flex-col items-start relative form-fields">
                    <FormLabel>Type</FormLabel>
                    <Select
                      onValueChange={(e) => {
                        setSelectedTypeState(e)
                        field.onChange()
                        form.reset(defaultFormValues(e))
                      }}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Filter By" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="title">Title</SelectItem>
                        <SelectItem value="author">Author</SelectItem>
                        <SelectItem value="genre">Genre</SelectItem>
                        <SelectItem value="rating">Rating</SelectItem>
                        <SelectItem value="categories">Categories</SelectItem>
                        <SelectItem value="tags">Tags</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />

              {['title', 'author', 'genre'].includes(selectedTypeState) && (
                <FormField
                  control={form.control}
                  name='value'
                  render={({ field }) => (
                    <FormItem className="flex flex-col items-start relative form-fields">
                      <FormLabel>Value</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          value={field.value || ''}
                          onChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {selectedTypeState === 'rating' && (
                <FormField
                  control={form.control}
                  name='ratingValue'
                  render={({ field }) => (
                    <FormItem className="flex flex-col items-start relative form-fields">
                      <FormLabel>Inform Rating</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          value={field.value !== undefined ? field.value : 0}
                          onChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {selectedTypeState === 'categories' && (
                <FormField
                  control={form.control}
                  name="categories"
                  render={({ field }) => (
                    <FormItem className="flex flex-col items-start relative form-fields">
                      <FormLabel>Categories</FormLabel>
                      <Select onValueChange={field.onChange}>
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map(({ id, label }) => (
                            <SelectItem key={id} value={id}>{label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
              )}

              {selectedTypeState === 'tags' && (
                <FormField
                  control={form.control}
                  name="tags"
                  render={({ field }) => (
                    <FormItem className="flex flex-col items-start relative form-fields">
                      <FormLabel>Tags</FormLabel>
                      <Select onValueChange={field.onChange}>
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {tags.map(({ id, label }) => (
                            <SelectItem key={id} value={id}>{label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
              )}

              <style>
                {`
                  .form-fields p {
                    position: absolute;
                    bottom: -20px;
                    width: 250px;
                    left: 0;
                    text-align: start;
                  }
                `}
              </style>
              <Button type="submit">Filter</Button>
            </form>
            <Button variant="secondary" className="mb-4" onClick={onRemoveFilter}>Remove</Button>
          </Form>
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}

export default FilterDrawer
