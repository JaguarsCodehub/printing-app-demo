"use client"

import * as React from "react"
import { Table } from "@tanstack/react-table"
import { ListFilter, X, Plus, Trash2, GripVertical, Check } from "lucide-react"

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
import { Input } from "@/components/ui/Input"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/Badge"

interface DataTableFilterProps<TData> {
  table: Table<TData>
}

type Operator = "contains" | "doesNotContain" | "is" | "isNot" | "isEmpty" | "isNotEmpty"

interface FilterCondition {
  id: string
  columnId: string
  operator: Operator
  value: string
}

export function DataTableFilter<TData>({ table }: DataTableFilterProps<TData>) {
  const [open, setOpen] = React.useState(false)
  const [conditions, setConditions] = React.useState<FilterCondition[]>([])

  // Get filterable columns
  const filterableColumns = React.useMemo(() => 
    table.getAllColumns().filter(
      (column) => column.getCanFilter() && typeof column.accessorFn !== "undefined"
    ),
  [table])

  const addCondition = () => {
    if (filterableColumns.length === 0) return
    const newCondition: FilterCondition = {
      id: Math.random().toString(36).substr(2, 9),
      columnId: filterableColumns[0].id,
      operator: "contains",
      value: ""
    }
    setConditions([...conditions, newCondition])
  }

  const removeCondition = (id: string) => {
    setConditions(conditions.filter(c => c.id !== id))
  }

  const updateCondition = (id: string, field: keyof FilterCondition, value: string) => {
    setConditions(conditions.map(c => 
      c.id === id ? { ...c, [field]: value } : c
    ))
  }

  // Effect to apply filters to the table
  React.useEffect(() => {
    // Reset all filters first
    table.resetColumnFilters()
    
    // Group conditions by column
    const conditionsByColumn: Record<string, FilterCondition[]> = {}
    conditions.forEach(c => {
        if (!conditionsByColumn[c.columnId]) {
            conditionsByColumn[c.columnId] = []
        }
        conditionsByColumn[c.columnId].push(c)
    })

    // Apply filters
    // Note: TanStack table default filter is usually just one value. 
    // To support this fully, we'd need a custom filter function that handles our condition object/array.
    // For this implementation, we will perform a simpler "AND" mapping where possible, 
    // or just set the filter value to the custom condition object if we set up a custom filterFn.
    
    // For now, let's assume we implement a custom global filter or column filter.
    // Let's rely on setting the column filter value to the condition(s).
    // We will need to update the column definition (column.tsx) to use a filter function that understands this,
    // OR we can just handle simple cases (1 condition per column) for MVP.
    
    Object.entries(conditionsByColumn).forEach(([colId, conds]) => {
        if (conds.length > 0) {
            // Passing the raw conditions array to the filter
            table.getColumn(colId)?.setFilterValue(conds)
        }
    })

  }, [conditions, table])


  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className={conditions.length > 0 ? "text-blue-600 bg-blue-50 hover:bg-blue-100" : "text-slate-600 border-dashed"}>
          <ListFilter className="h-3.5 w-3.5 mr-2" />
          Filter
          {conditions.length > 0 && (
            <Badge variant="secondary" className="ml-2 px-1 py-0 h-5 bg-blue-100 text-blue-700 hover:bg-blue-100 rounded-sm">
                {conditions.length}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-[600px] p-0" side="bottom">
        <div className="p-4 space-y-4">
             <div className="text-sm font-medium text-slate-500">In this view, show records</div>
             
             {conditions.length === 0 ? (
                 <div className="text-sm text-slate-400 italic py-2">No filters applied.</div>
             ) : (
                <div className="space-y-2">
                    {conditions.map((condition, index) => (
                        <div key={condition.id} className="flex items-center gap-2">
                            <div className="w-16 text-right text-sm text-slate-500">
                                {index === 0 ? "Where" : "and"}
                            </div>
                            
                            <Select 
                                value={condition.columnId} 
                                onValueChange={(val) => updateCondition(condition.id, "columnId", val)}
                            >
                                <SelectTrigger className="w-[180px] h-8 text-xs">
                                    <SelectValue placeholder="Column" />
                                </SelectTrigger>
                                <SelectContent>
                                    {filterableColumns.map(col => (
                                        <SelectItem key={col.id} value={col.id}>
                                            {/* Try to get header or id */}
                                            {col.id} 
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <Select 
                                value={condition.operator} 
                                onValueChange={(val) => updateCondition(condition.id, "operator", val)}
                            >
                                <SelectTrigger className="w-[130px] h-8 text-xs">
                                    <SelectValue placeholder="Operator" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="contains">contains</SelectItem>
                                    <SelectItem value="doesNotContain">does not contain</SelectItem>
                                    <SelectItem value="is">is</SelectItem>
                                    <SelectItem value="isNot">is not</SelectItem>
                                    <SelectItem value="isEmpty">is empty</SelectItem>
                                    <SelectItem value="isNotEmpty">is not empty</SelectItem>
                                </SelectContent>
                            </Select>

                           {!["isEmpty", "isNotEmpty"].includes(condition.operator) && (
                                <Input 
                                    className="h-8 w-[180px] text-xs"
                                    placeholder="Enter value..."
                                    value={condition.value}
                                    onChange={(e) => updateCondition(condition.id, "value", e.target.value)}
                                />
                           )}

                           <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-8 w-8 text-slate-400 hover:text-red-500"
                                onClick={() => removeCondition(condition.id)}
                            >
                                <Trash2 className="h-4 w-4" />
                           </Button>
                        </div>
                    ))}
                </div>
             )}

             <div className="pt-2">
                 <Button variant="ghost" size="sm" onClick={addCondition} className="text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                    <Plus className="h-4 w-4 mr-2" />
                    Add condition
                 </Button>
             </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
