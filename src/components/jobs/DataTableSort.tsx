"use client"

import * as React from "react"
import { Table } from "@tanstack/react-table"
import { ArrowUpDown, Plus, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/Button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select"
import { Badge } from "@/components/ui/Badge"

interface DataTableSortProps<TData> {
  table: Table<TData>
}

export function DataTableSort<TData>({ table }: DataTableSortProps<TData>) {
  const [open, setOpen] = React.useState(false)
  const sorting = table.getState().sorting
  
  // Get sortable columns
  const sortableColumns = React.useMemo(() => 
    table.getAllColumns().filter(
      (column) => column.getCanSort() && typeof column.accessorFn !== "undefined"
    ),
  [table])

  const addSort = () => {
    if (sortableColumns.length === 0) return
    // Default to first available column not already sorted, or just first column
    const firstCol = sortableColumns[0].id
    table.setSorting([...sorting, { id: firstCol, desc: false }])
  }

  const removeSort = (index: number) => {
    const newSorting = [...sorting]
    newSorting.splice(index, 1)
    table.setSorting(newSorting)
  }

  const updateSortColumn = (index: number, columnId: string) => {
    const newSorting = [...sorting]
    newSorting[index] = { ...newSorting[index], id: columnId }
    table.setSorting(newSorting)
  }

  const updateSortDirection = (index: number, value: string) => {
    const newSorting = [...sorting]
    newSorting[index] = { ...newSorting[index], desc: value === "desc" }
    table.setSorting(newSorting)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className={sorting.length > 0 ? "text-blue-600 bg-blue-50 hover:bg-blue-100" : "text-slate-600 border-dashed"}>
          <ArrowUpDown className="h-3.5 w-3.5 mr-2" />
          Sort
          {sorting.length > 0 && (
            <Badge variant="secondary" className="ml-2 px-1 py-0 h-5 bg-blue-100 text-blue-700 hover:bg-blue-100 rounded-sm">
                {sorting.length}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-[450px] p-0" side="bottom">
        <div className="p-4 space-y-4">
             <div className="text-sm font-medium text-slate-500">Sort by</div>
             
             {sorting.length === 0 ? (
                 <div className="text-sm text-slate-400 italic py-2">No active sorts.</div>
             ) : (
                <div className="space-y-2">
                    {sorting.map((sort, index) => (
                        <div key={index} className="flex items-center gap-2">
                            <div className="w-16 text-right text-sm text-slate-500">
                                {index === 0 ? "Sort by" : "Then by"}
                            </div>
                            
                            <Select 
                                value={sort.id} 
                                onValueChange={(val) => updateSortColumn(index, val)}
                            >
                                <SelectTrigger className="w-[180px] h-8 text-xs">
                                    <SelectValue placeholder="Column" />
                                </SelectTrigger>
                                <SelectContent>
                                    {sortableColumns.map(col => (
                                        <SelectItem key={col.id} value={col.id}>
                                            {col.id}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <Select 
                                value={sort.desc ? "desc" : "asc"} 
                                onValueChange={(val) => updateSortDirection(index, val)}
                            >
                                <SelectTrigger className="w-[100px] h-8 text-xs">
                                    <SelectValue placeholder="Order" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="asc">Ascending</SelectItem>
                                    <SelectItem value="desc">Descending</SelectItem>
                                </SelectContent>
                            </Select>

                           <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-8 w-8 text-slate-400 hover:text-red-500"
                                onClick={() => removeSort(index)}
                            >
                                <Trash2 className="h-4 w-4" />
                           </Button>
                        </div>
                    ))}
                </div>
             )}

             <div className="pt-2">
                 <Button variant="ghost" size="sm" onClick={addSort} className="text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                    <Plus className="h-4 w-4 mr-2" />
                    Add sort
                 </Button>
             </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
