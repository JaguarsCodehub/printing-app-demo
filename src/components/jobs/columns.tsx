
import { ColumnDef } from "@tanstack/react-table"
import { Job } from "@/types"
import { Badge } from "@/components/ui/Badge"
import { JobActions } from "./JobActions"
import { cn } from "@/lib/utils"
import { 
  Hash, 
  Type, 
  User, 
  Calendar, 
  DollarSign, 
  CheckCircle2, 
  Clock 
} from "lucide-react"

const statusVariants: Record<string, string> = {
  NEW: "bg-blue-100 text-blue-700 border-transparent",
  DESIGNING: "bg-amber-100 text-amber-700 border-transparent",
  "DESIGN READY": "bg-emerald-100 text-emerald-700 border-transparent",
  PRINTING: "bg-indigo-100 text-indigo-700 border-transparent",
  FABRICATION: "bg-violet-100 text-violet-700 border-transparent",
  READY: "bg-green-100 text-green-700 border-transparent",
  DISPATCHED: "bg-slate-100 text-slate-700 border-transparent",
  DELIVERED: "bg-zinc-100 text-slate-500 border-transparent",
};

export const columns: ColumnDef<Job>[] = [
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
    accessorKey: "customerName",
    size: 140,
    header: () => (
      <div className="flex items-center gap-1.5">
        <User className="w-3.5 h-3.5 text-slate-400" />
        <span>Customer</span>
      </div>
    ),
    cell: ({ row }) => (
      <span className="font-medium text-slate-900">{row.getValue("customerName")}</span>
    ),
  },
  {
    accessorKey: "jobTitle",
    size: 180,
    header: () => (
      <div className="flex items-center gap-1.5">
        <Type className="w-3.5 h-3.5 text-slate-400" />
        <span>Description</span>
      </div>
    ),
    cell: ({ row }) => (
       <div className="flex flex-col max-w-[200px]">
          <span className="truncate text-slate-700">{row.getValue("jobTitle")}</span>
       </div>
    )
  },
  {
    accessorKey: "status",
    size: 120,
    header: () => (
      <div className="flex items-center gap-1.5">
        <CheckCircle2 className="w-3.5 h-3.5 text-slate-400" />
        <span>Status</span>
      </div>
    ),
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <Badge className={cn("px-2 py-0.5 rounded-full font-medium shadow-none text-[10px]", statusVariants[status] || "bg-slate-50 text-slate-500")}>
          {status}
        </Badge>
      )
    },
  },
  {
    accessorKey: "dueDate",
    size: 110,
    header: () => (
      <div className="flex items-center gap-1.5">
        <Calendar className="w-3.5 h-3.5 text-slate-400" />
        <span>Due Date</span>
      </div>
    ),
    cell: ({ row }) => {
      const date = new Date(row.getValue("dueDate"));
      const isUrgent = row.original.priority === "Urgent";
      return (
        <div className="flex items-center gap-2">
           <span className="text-slate-600">{date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
           {isUrgent && <span className="w-1.5 h-1.5 rounded-full bg-red-500" title="Urgent"></span>}
        </div>
      )
    },
  },
  {
    accessorKey: "quantity",
    size: 90,
    header: () => (
      <div className="flex items-center gap-1.5">
        <Hash className="w-3.5 h-3.5 text-slate-400" />
        <span>Qty</span>
      </div>
    ),
    cell: ({ row }) => (
      <span className="font-medium text-slate-700">{row.getValue("quantity")} <span className="text-xs text-slate-400">{row.original.unit}</span></span>
    ),
  },
  {
    accessorKey: "rate",
    size: 90,
    header: () => (
      <div className="flex items-center gap-1.5">
        <DollarSign className="w-3.5 h-3.5 text-slate-400" />
        <span>Rate</span>
      </div>
    ),
    cell: ({ row }) => (
      <span className="text-slate-600">₹{row.getValue("rate")}</span>
    ),
  },
  {
    accessorKey: "totalAmount",
    size: 110,
    header: () => (
      <div className="flex items-center gap-1.5">
        <DollarSign className="w-3.5 h-3.5 text-slate-400" />
        <span>Total</span>
      </div>
    ),
    cell: ({ row }) => (
      <span className="font-bold text-slate-700">₹{row.getValue("totalAmount")}</span>
    ),
  },
  {
    accessorKey: "advanceAmount",
    size: 110,
    header: () => (
      <div className="flex items-center gap-1.5">
        <DollarSign className="w-3.5 h-3.5 text-slate-400" />
        <span>Advance</span>
      </div>
    ),
    cell: ({ row }) => (
      <span className="text-slate-600">₹{row.getValue("advanceAmount")}</span>
    ),
  },
  {
    accessorKey: "balanceAmount",
    size: 110,
    header: () => (
      <div className="flex items-center gap-1.5">
        <DollarSign className="w-3.5 h-3.5 text-slate-400" />
        <span>Balance</span>
      </div>
    ),
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("balanceAmount"))
      const formatted = new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0
      }).format(amount)
 
      return (
        <span className={cn("font-medium", amount > 0 ? "text-red-600" : "text-emerald-600")}>
            {formatted}
        </span>
      )
    },
  },
  {
    id: "designer",
    size: 120,
    header: () => (
      <div className="flex items-center gap-1.5">
        <User className="w-3.5 h-3.5 text-slate-400" />
        <span>Designer</span>
      </div>
    ),
    cell: ({ row }) => {
      const assignment = row.original.assignments?.find(a => a.role === "Designer");
      return assignment ? (
        <span className="text-xs font-medium bg-purple-50 text-purple-700 px-2 py-1 rounded-full">{assignment.assignedByName}</span>
      ) : <span className="text-slate-300">-</span>
    }
  },
  {
    id: "printer",
    size: 120,
    header: () => (
      <div className="flex items-center gap-1.5">
        <User className="w-3.5 h-3.5 text-slate-400" />
        <span>Printer</span>
      </div>
    ),
    cell: ({ row }) => {
      const assignment = row.original.assignments?.find(a => a.role === "Printer");
      return assignment ? (
        <span className="text-xs font-medium bg-blue-50 text-blue-700 px-2 py-1 rounded-full">{assignment.assignedByName}</span>
      ) : <span className="text-slate-300">-</span>
    }
  },
  {
    id: "fabricator",
    size: 120,
    header: () => (
      <div className="flex items-center gap-1.5">
        <User className="w-3.5 h-3.5 text-slate-400" />
        <span>Fabricator</span>
      </div>
    ),
    cell: ({ row }) => {
      const assignment = row.original.assignments?.find(a => a.role === "Fabricator");
      return assignment ? (
        <span className="text-xs font-medium bg-amber-50 text-amber-700 px-2 py-1 rounded-full">{assignment.assignedByName}</span>
      ) : <span className="text-slate-300">-</span>
    }
  },

  {
    id: "actions",
    size: 50,
    cell: ({ row }) => <JobActions job={row.original} />,
  },
]
