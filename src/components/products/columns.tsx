"use client"

import { ColumnDef } from "@tanstack/react-table"
import { JobCategoryDefinition } from "@/data/jobCategories" // Or wherever type is defined (it was in jobCategories.ts but used in CreateJobDialog)
// Wait, I see JobCategoryDefinition is in `src/data/jobCategories.ts`. I should check if it is exported.
// Yes, I viewed `jobCategories.ts` earlier.

import { Badge } from "@/components/ui/Badge"
import { Package, Printer, Scissors, Hash } from "lucide-react"

// Re-define type if needed or import.
// I'll assume I can import it. If not, I'll use `any` initially or define it.
// Actually, `src/data/jobCategories.ts` had `export type JobCategoryDefinition`.

export const productColumns: ColumnDef<JobCategoryDefinition>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <input 
        type="checkbox"
        checked={table.getIsAllPageRowsSelected()}
        onChange={(e) => table.toggleAllPageRowsSelected(!!e.target.checked)}
        className="rounded border-slate-300 translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <input 
        type="checkbox"
        checked={row.getIsSelected()}
        onChange={(e) => row.toggleSelected(!!e.target.checked)}
        className="rounded border-slate-300 translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
    size: 40,
  },
  {
    accessorKey: "label",
    header: ({ column }) => (
      <div className="flex items-center gap-1.5 cursor-pointer" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        <Package className="w-3.5 h-3.5 text-slate-400" />
        <span>Product Name</span>
      </div>
    ),
    cell: ({ row }) => (
      <div className="font-medium text-slate-900">{row.getValue("label")}</div>
    ),
    size: 180,
  },
  {
    accessorKey: "id",
    header: ({ column }) => (
      <div className="flex items-center gap-1.5">
        <Hash className="w-3.5 h-3.5 text-slate-400" />
        <span>ID</span>
      </div>
    ),
    cell: ({ row }) => (
      <div className="text-slate-500 font-mono text-xs">{row.getValue("id")}</div>
    ),
    size: 120,
  },
  {
    accessorKey: "printingFields",
    header: ({ column }) => (
      <div className="flex items-center gap-1.5">
        <Printer className="w-3.5 h-3.5 text-slate-400" />
        <span>Printing Specs</span>
      </div>
    ),
    size: 250,
    cell: ({ row }) => {
      const fields = row.original.printingFields || [];
      return (
        <div className="flex flex-wrap gap-1.5">
          {fields.map((field: any) => (
            <Badge key={field.name} variant="secondary" className="px-2 py-0.5 text-xs font-medium bg-blue-50 text-blue-700 border-blue-200">
              {field.label}
            </Badge>
          ))}
          {fields.length === 0 && <span className="text-xs text-slate-300">-</span>}
        </div>
      );
    },
  },
  {
    accessorKey: "fabricationFields",
    header: ({ column }) => (
      <div className="flex items-center gap-1.5">
        <Scissors className="w-3.5 h-3.5 text-slate-400" />
        <span>Fabrication Specs</span>
      </div>
    ),
    size: 250,
    cell: ({ row }) => {
      const fields = row.original.fabricationFields || [];
      return (
        <div className="flex flex-wrap gap-1.5">
          {fields.map((field: any) => (
            <Badge key={field.name} variant="secondary" className="px-2 py-0.5 text-xs font-medium bg-amber-50 text-amber-700 border-amber-200">
              {field.label}
            </Badge>
          ))}
          {fields.length === 0 && <span className="text-xs text-slate-300">-</span>}
        </div>
      );
    },
  },
]
