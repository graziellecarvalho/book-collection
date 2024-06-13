import { Filter } from 'lucide-react'
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { BookCollectionProps } from "@/types"
import { cn } from "@/lib/utils";

function FilterDrawer() {
  const { setDrawerMode } = useAppStore()
  const { setFilter, categories, tags, books, removeFilter } = useBookCollectionStore()
  const { toast } = useToast()

  // Fields Validation
  const filterSchema = z.object({
    type: z.string({ required_error: "Please select an item" }),
    value: z.string().min(3, { message: 'At least 3 character(s)' }).max(50),
    ratingValue: z.coerce.number(),
    categories: z.string({ required_error: "Please select an item" }),
    tags: z.string({ required_error: "Please select an item" }),
  })

  const defaultFormValues = {
    type: "",
    value: '',
    ratingValue: 0,
    categories: '',
    tags: ''
  };

  const form = useForm<z.infer<typeof filterSchema>>({
    resolver: zodResolver(filterSchema),
    defaultValues: defaultFormValues
  })

  function onFilter(value: z.infer<typeof filterSchema>) {
    const tempBooks = books
    let filter: BookCollectionProps[] = []

    switch(value.type) {
      case "title":
      case "author":
      case "genre":
        filter = tempBooks.filter(book => (book[value.type as keyof BookCollectionProps] as string).toLowerCase().includes(value.value.toLowerCase() as string));
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

    console.log(filter)
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

  const selectedType = form.watch("type")

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
                    <Select onValueChange={field.onChange}>
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

              {['title', 'author', 'genre'].includes(selectedType) && (
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

              {selectedType === 'rating' && (
                <FormField
                  control={form.control}
                  name='ratingValue'
                  render={({ field }) => (
                    <FormItem className="flex flex-col items-start relative form-fields">
                      <FormLabel>Inform Rating</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          onChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {selectedType === 'categories' && (
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

              {selectedType === 'tags' && (
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