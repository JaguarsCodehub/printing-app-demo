"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Vendor } from "@/types"
import { Badge } from "@/components/ui/Badge"
import { User, Phone, Briefcase } from "lucide-react"

export const vendorColumns: ColumnDef<Vendor>[] = [
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
    accessorKey: "serviceType",
    header: ({ column }) => (
      <div className="flex items-center gap-1.5">
        <Briefcase className="w-3.5 h-3.5 text-slate-400" />
        <span>Type</span>
      </div>
    ),
    cell: ({ row }) => (
      <Badge variant="secondary" className="bg-slate-100 text-slate-600 border-slate-200">
        {row.getValue("serviceType")}
      </Badge>
    ),
  },
  {
    accessorKey: "address",
    header: "Address",
    cell: ({ row }) => <span className="text-xs text-slate-500 truncate max-w-[200px] block">{row.getValue("address") || "-"}</span>
  },
]
