"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Customer } from "@/types"
import { Badge } from "@/components/ui/Badge"
import { User, Phone, Building2, MapPin } from "lucide-react"

export const customerColumns: ColumnDef<Customer>[] = [
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
    accessorKey: "name",
    header: ({ column }) => (
      <div className="flex items-center gap-1.5 cursor-pointer" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        <User className="w-3.5 h-3.5 text-slate-400" />
        <span>Name</span>
      </div>
    ),
    cell: ({ row }) => (
      <div className="font-medium text-slate-900">{row.getValue("name")}</div>
    ),
  },
  {
    accessorKey: "mobile",
    header: ({ column }) => (
      <div className="flex items-center gap-1.5">
        <Phone className="w-3.5 h-3.5 text-slate-400" />
        <span>Mobile</span>
      </div>
    ),
    cell: ({ row }) => (
      <div className="text-slate-600 font-mono text-xs">{row.getValue("mobile")}</div>
    ),
  },
  {
    accessorKey: "companyName",
    header: ({ column }) => (
      <div className="flex items-center gap-1.5">
        <Building2 className="w-3.5 h-3.5 text-slate-400" />
        <span>Company</span>
      </div>
    ),
    cell: ({ row }) => (
      <div className="text-slate-600 text-sm">
        {row.getValue("companyName") || <span className="text-slate-300">-</span>}
      </div>
    ),
  },
   {
    accessorKey: "gstin", 
    header: "GSTIN",
    cell: ({ row }) => <span className="text-xs font-mono text-slate-500">{row.getValue("gstin") || "-"}</span>
  },
]
