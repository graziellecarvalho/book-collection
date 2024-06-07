import { useState } from "react"
import { useBookCollectionStore } from "@/store/bookCollectionStore"
import { useAppStore } from "@/store/appStore"
import {
  ColumnDef,
  SortingState,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { BookCollectionProps } from "@/types"
import { Button } from "./ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ChevronsUpDown, Trash, Pencil } from "lucide-react"

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
    header: ({ column }) => <ArrowUpDown title="Rating" column={column} />
  },
  {
    accessorKey: "categories",
    header: "Categories"
  },
  {
    accessorKey: "tags",
    header: "Tags"
  },
  {
    id: "actions",
    header: "Tags",
    cell: ({ row }) => <ContextMenu book={row.original} />,
  },
]

const ContextMenu = ({ book }: { book: BookCollectionProps }) => {
  const { setSelectedBook, removeBook } = useBookCollectionStore()
  const { setDisplayForm } = useAppStore()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          Options
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Options</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="gap-2"
          onClick={() => {
            setDisplayForm(true)
            setSelectedBook(book)
          }}
        >
          <Pencil size="12" />Update
        </DropdownMenuItem>
        <DropdownMenuItem
          className="gap-2"
          onClick={() => removeBook(book.id)}
        >
          <Trash size="12" />Remove
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

/**
 * Sorting functionality for the tables headers
 * @param title - headers title
 * @param column - columns object with type ColumnType
 * @returns Button component
 */
const ArrowUpDown = ({ title, column }: {title: string, column: ColumnType }) => (
  <Button className="flex mx-auto" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} variant="ghost">
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
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
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
  const { books } = useBookCollectionStore()

  return <DataTable columns={columns} data={books} />
}

export default BookCollectionTable