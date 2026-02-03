"use client"

import { ColumnDef } from "@tanstack/react-table"
import { UserProfile } from "@/types"
import { Badge } from "@/components/ui/Badge"
import { User, Mail, Calendar, Key } from "lucide-react"
import { cn } from "@/lib/utils"

export const userColumns: ColumnDef<UserProfile>[] = [
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
    accessorKey: "displayName",
    size: 150,
    header: ({ column }) => (
      <div className="flex items-center gap-1.5 cursor-pointer" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        <User className="w-3.5 h-3.5 text-slate-400" />
        <span>Name</span>
      </div>
    ),
    cell: ({ row }) => (
      <div className="font-medium text-slate-900">{row.getValue("displayName")}</div>
    ),
  },
  {
    accessorKey: "email",
    size: 200,
    header: ({ column }) => (
      <div className="flex items-center gap-1.5 cursor-pointer" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        <Mail className="w-3.5 h-3.5 text-slate-400" />
        <span>Email</span>
      </div>
    ),
    cell: ({ row }) => (
      <div className="text-slate-500 font-mono text-xs">{row.getValue("email")}</div>
    ),
  },
  {
    accessorKey: "role",
    size: 120,
    header: ({ column }) => (
       <div className="flex items-center gap-1.5 cursor-pointer" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        <Key className="w-3.5 h-3.5 text-slate-400" />
        <span>Role</span>
      </div>
    ),
    cell: ({ row }) => {
      const role = row.getValue("role") as string
      return (
        <Badge variant="outline" className={cn(
          "font-medium",
          role === "Admin" && "bg-red-50 text-red-700 border-red-200",
          role === "Designer" && "bg-purple-50 text-purple-700 border-purple-200",
          role === "Printer" && "bg-blue-50 text-blue-700 border-blue-200",
          role === "Fabricator" && "bg-amber-50 text-amber-700 border-amber-200"
        )}>
          {role}
        </Badge>
      )
    },
  },
  {
    accessorKey: "createdAt",
    size: 120,
    header: ({ column }) => (
      <div className="flex items-center gap-1.5 cursor-pointer" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        <Calendar className="w-3.5 h-3.5 text-slate-400" />
        <span>Joined</span>
      </div>
    ),
    cell: ({ row }) => {
      return (
        <span className="text-slate-500 text-xs">
          {new Date(row.getValue("createdAt")).toLocaleDateString('en-IN', { dateStyle: 'medium' })}
        </span>
      )
    },
  },
]
