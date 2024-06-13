import { useState } from "react"
import {
  ColumnDef,
  SortingState,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { BookCollectionProps } from "@/types"
import { ChevronsUpDown, Trash, Pencil } from "lucide-react"
import { DotsHorizontalIcon, StarFilledIcon, StarIcon } from "@radix-ui/react-icons"

interface ColumnType {
  toggleSorting: (isSorted: boolean) => void;
  getIsSorted: () => "asc" | "desc" | false;
};

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}

/**
 * Tables columns header
 */
export const columns: ColumnDef<BookCollectionProps>[] = [
  {
    accessorKey: "title",
    header: ({ column }) => <ArrowUpDown title="Title" column={column} />
  },
  {
    accessorKey: "author",
    header: ({ column }) => <ArrowUpDown title="Author" column={column} />
  },
  {
    accessorKey: "genre",
    header: ({ column }) => <ArrowUpDown title="Genre" column={column} />
  },
  {
    accessorKey: "rating",
    header: ({ column }) => <ArrowUpDown title="Rating" column={column} />,
    cell: ({ row }) => (
      <>
        {row.original.rating && (
          <div className="flex">
            {[...Array(Math.min(Math.max(row.original.rating, 1), 5))].map((_, index) => (
              <StarFilledIcon key={index} />
            ))}
            {[...Array(Math.max(5 - row.original.rating, 0))].map((_, index) => (
              <StarIcon key={index} />
            ))}
          </div>
        )}
      </>
    )
  },
  {
    accessorKey: "categories",
    header: "Categories",
    cell: ({ row }) => (
      <div className="flex gap-2">
        {row.original.categories?.map((item) => (
          <Badge variant="secondary" key={item.id}>{item.label}</Badge>
        ))}
      </div>
    )
  },
  {
    accessorKey: "tags",
    header: "Tags",
    cell: ({ row }) => (
      <div className="flex gap-2">
        {row.original.tags?.map((item) => (
          <Badge variant="secondary" key={item.id}>{item.label}</Badge>
        ))}
      </div>
    )
  },
  {
    id: "actions",
    cell: ({ row }) => <ContextMenu book={row.original} />,
  },
]

const ContextMenu = ({ book }: { book: BookCollectionProps }) => {
  const { setSelectedBook, removeBook } = useBookCollectionStore()
  const { setDrawerMode } = useAppStore()

  const [showAlertDialog, setShowAlertDialog] = useState(false)

  const { toast } = useToast()

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <DotsHorizontalIcon />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Options</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="gap-2"
            onClick={() => {
              setDrawerMode('form')
              setSelectedBook(book)
            }}
          >
            <Pencil size="12" />Update
          </DropdownMenuItem>
          <DropdownMenuItem
            className="gap-2"
            onClick={() => setShowAlertDialog(true)}
          >
            <Trash size="12" />Remove
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      {showAlertDialog && (
        <AlertDialog open={showAlertDialog}>
        
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your
                book and remove your data from our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setShowAlertDialog(false)}>Cancel</AlertDialogCancel>
              <AlertDialogAction
              onClick={() => {
                removeBook(book.id)
                setShowAlertDialog(false)
                toast({
                  title: "Book removed",
                  description: "Your book was removed from our records",
                })
              }}
              >
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        )}
    </>
    
  )
}

/**
 * Sorting functionality for the tables headers
 * @param title - headers title
 * @param column - columns object with type ColumnType
 * @returns Button component
 */
const ArrowUpDown = ({ title, column }: {title: string, column: ColumnType }) => (
  <Button className="flex justify-start" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} variant="ghost">
    {title}
    <ChevronsUpDown className="ml-2 h-4 w-4" />
  </Button>
)

// Main DataTable component for rendering tables
function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([])

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
  })

  return (
    <div>
      {/* TABLE */}
      <div className="rounded-md border bg-white">
        <Table>
          <TableHeader className="text-start">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="text-start"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </div>
  )
}

// Component for rendering the BooksTable
function BookCollectionTable() {
  // Store management
  const { books, filteredBooks } = useBookCollectionStore()

  return <DataTable columns={columns} data={filteredBooks.length === 0 ? books : filteredBooks} />
}

export default BookCollectionTable