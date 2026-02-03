
"use client"

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  SortingState,
  getSortedRowModel,
  ColumnFiltersState,
  getFilteredRowModel,
  VisibilityState,
  getFacetedRowModel,
  getFacetedUniqueValues,
  FilterFn,
} from "@tanstack/react-table"
import { useState, useMemo } from "react"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { 
    Search,
    SlidersHorizontal,
    ListFilter,
    ArrowUpDown,
    LayoutGrid
} from "lucide-react"

import { DataTableViewOptions } from "./DataTableViewOptions"
import { DataTableRowHeight } from "./DataTableRowHeight"
import { DataTableFilter } from "./DataTableFilter"
import { DataTableSort } from "./DataTableSort"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  searchKey?: string
  onRowClick?: (row: TData) => void
}

const densityConfig: Record<string, string> = {
  compact: "py-1 text-xs",
  standard: "py-2 text-sm",
  comfortable: "py-4 text-sm",
  spacious: "py-6 text-base",
}

// Custom filter function for "advanced" filtering
const advancedFilter: FilterFn<any> = (row, columnId, filterValue: any[]) => {
    // filterValue is FilterCondition[]
    if (!Array.isArray(filterValue) || filterValue.length === 0) return true;

    const cellValue = row.getValue(columnId);
    const strValue = String(cellValue).toLowerCase();

    // AND logic: All conditions for this column must be true
    return filterValue.every((condition) => {
        const condValue = condition.value.toLowerCase();
        
        switch (condition.operator) {
            case "contains":
                return strValue.includes(condValue);
            case "doesNotContain":
                return !strValue.includes(condValue);
            case "is":
                return strValue === condValue;
            case "isNot":
                return strValue !== condValue;
            case "isEmpty":
                return !cellValue || strValue === "";
            case "isNotEmpty":
                return !!cellValue && strValue !== "";
            default:
                return true;
        }
    });
};

export function DataTable<TData, TValue>({
  columns,
  data,
  searchKey = "jobTitle",
  onRowClick,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [density, setDensity] = useState("standard")

  // Inject the advanced filter function into all columns that don't specify one
  const tableColumns = useMemo(() => 
    columns.map((col) => ({
        ...col,
        filterFn: "advancedFilter" // Use our custom filter
    })) as any as ColumnDef<TData, TValue>[], 
  [columns]);

  const table = useReactTable({
    data,
    columns: tableColumns, 
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    columnResizeMode: "onChange",
    enableColumnResizing: true,
    filterFns: {
        advancedFilter, // Register it
    },
    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },
  })

  return (
    <div className="space-y-0 bg-white border border-slate-300 shadow-none overflow-hidden select-none flex flex-col h-full rounded-md">
      {/* Top Toolbar */}
      <div className="px-3 py-2 border-b border-slate-300 flex items-center justify-between bg-white gap-2 overflow-x-auto">
          <div className="flex items-center gap-1">
             <DataTableViewOptions table={table} />
             
             <DataTableFilter table={table} />
             
             <Button variant="ghost" size="sm" className="h-8 flex gap-2 text-slate-600">
                <LayoutGrid className="h-3.5 w-3.5" />
                Group
             </Button>

             <DataTableSort table={table} />

             <DataTableRowHeight density={density} setDensity={setDensity} />
          </div>
          
          <div className="flex items-center gap-2">
             <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <Input 
                   placeholder="Search..."
                   value={(table.getColumn(searchKey)?.getFilterValue() as string) ?? ""}
                   onChange={(event) => table.getColumn(searchKey)?.setFilterValue(event.target.value)}
                   className="h-8 w-40 lg:w-64 pl-8 text-xs bg-slate-50 border-transparent focus:bg-white focus:border-blue-500 transition-all rounded-sm" 
                />
             </div>
          </div>
      </div>

      <div className="overflow-auto flex-1">
        <table className="w-max text-sm border-collapse table-fixed min-w-full">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="bg-slate-100 sticky top-0 z-20 shadow-sm">
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    style={{ width: header.getSize(), position: "relative" }}
                    className="h-9 px-4 text-left align-middle font-semibold text-slate-600 border border-slate-300 whitespace-nowrap overflow-hidden group select-none relative bg-slate-100"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                    {/* Resize Handle */}
                    {header.column.getCanResize() && (
                      <div
                        onMouseDown={header.getResizeHandler()}
                        onTouchStart={header.getResizeHandler()}
                        className={`absolute right-0 top-0 h-full w-1 cursor-col-resize hover:bg-blue-400 touch-none select-none z-10 ${
                            header.column.getIsResizing() ? "bg-blue-600 w-1" : "bg-transparent"
                        }`}
                      />
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className={`bg-white hover:bg-blue-50/50 transition-colors group ${onRowClick ? "cursor-pointer" : ""}`}
                  onClick={() => onRowClick?.(row.original)}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td 
                      key={cell.id} 
                      style={{ width: cell.column.getSize() }}
                      className={`px-4 align-middle text-slate-800 border border-slate-300 truncate whitespace-nowrap ${densityConfig[density]}`}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="h-24 text-center text-slate-400 font-medium border border-slate-300">
                  <div className="flex flex-col items-center justify-center gap-1">
                    <p>No records found.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Simple Footer */}
      <div className="px-3 py-2 border-t border-slate-300 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
         <div>
            {table.getFilteredRowModel().rows.length} records
         </div>
         <div className="flex items-center gap-2">
            <button 
                onClick={() => table.previousPage()} 
                disabled={!table.getCanPreviousPage()}
                className="hover:text-slate-800 disabled:opacity-30"
            >
                Prev
            </button>
            <span>{table.getState().pagination.pageIndex + 1} / {table.getPageCount()}</span>
            <button 
                onClick={() => table.nextPage()} 
                disabled={!table.getCanNextPage()}
                className="hover:text-slate-800 disabled:opacity-30"
            >
                Next
            </button>
         </div>
      </div>
    </div>
  )
}

function ToolbarButton({ icon: Icon, label }: { icon: any, label: string }) {
    return (
        <button className="flex items-center gap-1.5 px-2 py-1 hover:bg-slate-100 rounded text-xs font-medium text-slate-600 transition-colors">
            <Icon className="w-3.5 h-3.5 text-slate-500" />
            {label}
        </button>
    )
}
