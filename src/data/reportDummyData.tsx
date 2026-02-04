import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";
import { User, Type, Calendar, Hash, CheckCircle2, Clock } from "lucide-react";

// Designer report
export interface DesignerReportRow {
  id: string;
  designerName: string;
  jobTitle: string;
  status: string;
  dueDate: string;
  completedAt: string;
}

export const designerReportDummyData: DesignerReportRow[] = [
  { id: "1", designerName: "Priya S.", jobTitle: "Wedding Card Design", status: "DESIGN READY", dueDate: "2025-02-01", completedAt: "2025-01-30" },
  { id: "2", designerName: "Priya S.", jobTitle: "Visiting Cards 500 pcs", status: "DESIGNING", dueDate: "2025-02-05", completedAt: "-" },
  { id: "3", designerName: "Rahul M.", jobTitle: "Brochure A4 3-fold", status: "DESIGN READY", dueDate: "2025-02-03", completedAt: "2025-02-02" },
  { id: "4", designerName: "Rahul M.", jobTitle: "Banner Design 6x3", status: "DESIGNING", dueDate: "2025-02-08", completedAt: "-" },
  { id: "5", designerName: "Anita K.", jobTitle: "Sticker Sheet Design", status: "DESIGN READY", dueDate: "2025-02-04", completedAt: "2025-02-03" },
  { id: "6", designerName: "Anita K.", jobTitle: "Menu Card Layout (Cafe)", status: "DESIGN READY", dueDate: "2025-02-06", completedAt: "2025-02-05" },
  { id: "7", designerName: "Priya S.", jobTitle: "Product Labels – 6 variants", status: "DESIGNING", dueDate: "2025-02-10", completedAt: "-" },
  { id: "8", designerName: "Rahul M.", jobTitle: "Standee Creative 2x5", status: "DESIGN READY", dueDate: "2025-02-07", completedAt: "2025-02-06" },
  { id: "9", designerName: "Anita K.", jobTitle: "Invoice Book (Duplicate)", status: "DESIGNING", dueDate: "2025-02-11", completedAt: "-" },
  { id: "10", designerName: "Priya S.", jobTitle: "Wedding Invite – Envelope Design", status: "DESIGN READY", dueDate: "2025-02-09", completedAt: "2025-02-08" },
  { id: "11", designerName: "Rahul M.", jobTitle: "Poster A2 – Campaign Set", status: "DESIGNING", dueDate: "2025-02-12", completedAt: "-" },
  { id: "12", designerName: "Anita K.", jobTitle: "Sticker Sheet – Die Cut Preview", status: "DESIGN READY", dueDate: "2025-02-08", completedAt: "2025-02-07" },
];

const designerStatusVariants: Record<string, string> = {
  DESIGNING: "bg-amber-100 text-amber-700 border-transparent",
  "DESIGN READY": "bg-emerald-100 text-emerald-700 border-transparent",
};

export const designerReportColumns: ColumnDef<DesignerReportRow>[] = [
  { accessorKey: "designerName", header: () => <div className="flex items-center gap-1.5"><User className="w-3.5 h-3.5 text-slate-400" /><span>Designer</span></div>, cell: ({ row }) => <span className="font-medium text-slate-900">{row.getValue("designerName")}</span>, size: 120 },
  { accessorKey: "jobTitle", header: () => <div className="flex items-center gap-1.5"><Type className="w-3.5 h-3.5 text-slate-400" /><span>Job Title</span></div>, cell: ({ row }) => <span className="text-slate-700">{row.getValue("jobTitle")}</span>, size: 180 },
  { accessorKey: "status", header: () => <div className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-slate-400" /><span>Status</span></div>, cell: ({ row }) => { const s = row.getValue("status") as string; return <Badge className={cn("px-2 py-0.5 rounded-full text-[10px]", designerStatusVariants[s] || "bg-slate-50 text-slate-500")}>{s}</Badge>; }, size: 110 },
  { accessorKey: "dueDate", header: () => <div className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-slate-400" /><span>Due Date</span></div>, cell: ({ row }) => <span className="text-slate-600">{row.getValue("dueDate")}</span>, size: 100 },
  { accessorKey: "completedAt", header: () => <div className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-slate-400" /><span>Completed At</span></div>, cell: ({ row }) => <span className="text-slate-500 text-xs">{row.getValue("completedAt")}</span>, size: 100 },
];

// Printer report
export interface PrinterReportRow {
  id: string;
  printerName: string;
  jobTitle: string;
  status: string;
  quantity: number;
  dueDate: string;
}

export const printerReportDummyData: PrinterReportRow[] = [
  { id: "1", printerName: "Vikram P.", jobTitle: "Visiting Cards 500 pcs", status: "PRINTING", quantity: 500, dueDate: "2025-02-05" },
  { id: "2", printerName: "Vikram P.", jobTitle: "Brochure A4 3-fold", status: "READY", quantity: 1000, dueDate: "2025-02-03" },
  { id: "3", printerName: "Suresh T.", jobTitle: "Banner 6x3", status: "PRINTING", quantity: 10, dueDate: "2025-02-08" },
  { id: "4", printerName: "Suresh T.", jobTitle: "Sticker Sheet", status: "READY", quantity: 2000, dueDate: "2025-02-04" },
  { id: "5", printerName: "Vikram P.", jobTitle: "Wedding Card Printing", status: "PRINTING", quantity: 300, dueDate: "2025-02-01" },
  { id: "6", printerName: "Meera D.", jobTitle: "Letterheads – 2000 pcs", status: "PRINTING", quantity: 2000, dueDate: "2025-02-10" },
  { id: "7", printerName: "Meera D.", jobTitle: "Menu Cards – 200 pcs", status: "READY", quantity: 200, dueDate: "2025-02-06" },
  { id: "8", printerName: "Suresh T.", jobTitle: "Poster A2 – 150 pcs", status: "PRINTING", quantity: 150, dueDate: "2025-02-12" },
  { id: "9", printerName: "Vikram P.", jobTitle: "Product Labels – 5000 pcs", status: "PRINTING", quantity: 5000, dueDate: "2025-02-11" },
  { id: "10", printerName: "Meera D.", jobTitle: "Envelope Printing – 1000 pcs", status: "READY", quantity: 1000, dueDate: "2025-02-09" },
  { id: "11", printerName: "Suresh T.", jobTitle: "Flex Print – 20 pcs", status: "READY", quantity: 20, dueDate: "2025-02-07" },
  { id: "12", printerName: "Vikram P.", jobTitle: "Invoice Book – 50 sets", status: "READY", quantity: 50, dueDate: "2025-02-08" },
];

const printerStatusVariants: Record<string, string> = {
  PRINTING: "bg-indigo-100 text-indigo-700 border-transparent",
  READY: "bg-green-100 text-green-700 border-transparent",
};

export const printerReportColumns: ColumnDef<PrinterReportRow>[] = [
  { accessorKey: "printerName", header: () => <div className="flex items-center gap-1.5"><User className="w-3.5 h-3.5 text-slate-400" /><span>Printer</span></div>, cell: ({ row }) => <span className="font-medium text-slate-900">{row.getValue("printerName")}</span>, size: 120 },
  { accessorKey: "jobTitle", header: () => <div className="flex items-center gap-1.5"><Type className="w-3.5 h-3.5 text-slate-400" /><span>Job</span></div>, cell: ({ row }) => <span className="text-slate-700">{row.getValue("jobTitle")}</span>, size: 180 },
  { accessorKey: "status", header: () => <div className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-slate-400" /><span>Status</span></div>, cell: ({ row }) => { const s = row.getValue("status") as string; return <Badge className={cn("px-2 py-0.5 rounded-full text-[10px]", printerStatusVariants[s] || "bg-slate-50 text-slate-500")}>{s}</Badge>; }, size: 100 },
  { accessorKey: "quantity", header: () => <div className="flex items-center gap-1.5"><Hash className="w-3.5 h-3.5 text-slate-400" /><span>Qty</span></div>, cell: ({ row }) => <span className="font-medium text-slate-700">{row.getValue("quantity")}</span>, size: 80 },
  { accessorKey: "dueDate", header: () => <div className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-slate-400" /><span>Due Date</span></div>, cell: ({ row }) => <span className="text-slate-600">{row.getValue("dueDate")}</span>, size: 100 },
];

// Fabricator report
export interface FabricatorReportRow {
  id: string;
  fabricatorName: string;
  jobTitle: string;
  status: string;
  dueDate: string;
}

export const fabricatorReportDummyData: FabricatorReportRow[] = [
  { id: "1", fabricatorName: "Deepak L.", jobTitle: "Visiting Cards - Lamination", status: "FABRICATION", dueDate: "2025-02-06" },
  { id: "2", fabricatorName: "Deepak L.", jobTitle: "Brochure - Perfect Binding", status: "READY", dueDate: "2025-02-04" },
  { id: "3", fabricatorName: "Kavita R.", jobTitle: "Banner - Hemming", status: "FABRICATION", dueDate: "2025-02-09" },
  { id: "4", fabricatorName: "Kavita R.", jobTitle: "Sticker - Kiss Cut", status: "READY", dueDate: "2025-02-05" },
  { id: "5", fabricatorName: "Deepak L.", jobTitle: "Wedding Card - Foiling", status: "FABRICATION", dueDate: "2025-02-02" },
  { id: "6", fabricatorName: "Kavita R.", jobTitle: "Standee - Base + Pastings", status: "FABRICATION", dueDate: "2025-02-10" },
  { id: "7", fabricatorName: "Deepak L.", jobTitle: "Menu Cards - Lamination (Matt)", status: "READY", dueDate: "2025-02-06" },
  { id: "8", fabricatorName: "Imran A.", jobTitle: "Letterheads - Cutting + Packing", status: "FABRICATION", dueDate: "2025-02-11" },
  { id: "9", fabricatorName: "Imran A.", jobTitle: "Poster A2 - Mounting", status: "FABRICATION", dueDate: "2025-02-12" },
  { id: "10", fabricatorName: "Kavita R.", jobTitle: "Labels - Sheet Cutting", status: "READY", dueDate: "2025-02-08" },
  { id: "11", fabricatorName: "Deepak L.", jobTitle: "Envelope - Folding + Glue", status: "FABRICATION", dueDate: "2025-02-09" },
  { id: "12", fabricatorName: "Imran A.", jobTitle: "Flex - Eyelets", status: "READY", dueDate: "2025-02-07" },
];

const fabricatorStatusVariants: Record<string, string> = {
  FABRICATION: "bg-violet-100 text-violet-700 border-transparent",
  READY: "bg-green-100 text-green-700 border-transparent",
};

export const fabricatorReportColumns: ColumnDef<FabricatorReportRow>[] = [
  { accessorKey: "fabricatorName", header: () => <div className="flex items-center gap-1.5"><User className="w-3.5 h-3.5 text-slate-400" /><span>Fabricator</span></div>, cell: ({ row }) => <span className="font-medium text-slate-900">{row.getValue("fabricatorName")}</span>, size: 120 },
  { accessorKey: "jobTitle", header: () => <div className="flex items-center gap-1.5"><Type className="w-3.5 h-3.5 text-slate-400" /><span>Job</span></div>, cell: ({ row }) => <span className="text-slate-700">{row.getValue("jobTitle")}</span>, size: 200 },
  { accessorKey: "status", header: () => <div className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-slate-400" /><span>Status</span></div>, cell: ({ row }) => { const s = row.getValue("status") as string; return <Badge className={cn("px-2 py-0.5 rounded-full text-[10px]", fabricatorStatusVariants[s] || "bg-slate-50 text-slate-500")}>{s}</Badge>; }, size: 110 },
  { accessorKey: "dueDate", header: () => <div className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-slate-400" /><span>Due Date</span></div>, cell: ({ row }) => <span className="text-slate-600">{row.getValue("dueDate")}</span>, size: 100 },
];

// Daily Task report
export interface DailyTaskReportRow {
  id: string;
  date: string;
  taskName: string;
  assignee: string;
  status: string;
  dueTime: string;
}

export const dailyTaskReportDummyData: DailyTaskReportRow[] = [
  { id: "1", date: "2025-02-04", taskName: "Visiting Cards 500 pcs", assignee: "Vikram P.", status: "In Progress", dueTime: "6:00 PM" },
  { id: "2", date: "2025-02-04", taskName: "Brochure A4 3-fold", assignee: "Priya S.", status: "Completed", dueTime: "12:00 PM" },
  { id: "3", date: "2025-02-04", taskName: "Banner 6x3", assignee: "Suresh T.", status: "Pending", dueTime: "4:00 PM" },
  { id: "4", date: "2025-02-04", taskName: "Wedding Card Design", assignee: "Rahul M.", status: "Completed", dueTime: "10:00 AM" },
  { id: "5", date: "2025-02-04", taskName: "Sticker Lamination", assignee: "Deepak L.", status: "In Progress", dueTime: "5:00 PM" },
  { id: "6", date: "2025-02-03", taskName: "Visiting Cards - Delivery", assignee: "Dispatcher", status: "Completed", dueTime: "2:00 PM" },
  { id: "7", date: "2025-02-03", taskName: "Menu Cards - Print Proof", assignee: "Meera D.", status: "Completed", dueTime: "11:30 AM" },
  { id: "8", date: "2025-02-03", taskName: "Standee - Creative Review", assignee: "Anita K.", status: "Pending", dueTime: "6:30 PM" },
  { id: "9", date: "2025-02-03", taskName: "Poster A2 - Plate Setup", assignee: "Suresh T.", status: "In Progress", dueTime: "3:15 PM" },
  { id: "10", date: "2025-02-02", taskName: "Invoice Book - Binding", assignee: "Deepak L.", status: "Completed", dueTime: "1:00 PM" },
  { id: "11", date: "2025-02-02", taskName: "Labels - Die Cut Test", assignee: "Imran A.", status: "In Progress", dueTime: "5:45 PM" },
  { id: "12", date: "2025-02-02", taskName: "Envelope - Alignment Check", assignee: "Vikram P.", status: "Pending", dueTime: "4:20 PM" },
  { id: "13", date: "2025-02-01", taskName: "Wedding Card - Foiling Setup", assignee: "Kavita R.", status: "Completed", dueTime: "9:45 AM" },
  { id: "14", date: "2025-02-01", taskName: "Flex - Eyelets", assignee: "Imran A.", status: "Completed", dueTime: "2:30 PM" },
  { id: "15", date: "2025-02-01", taskName: "Letterheads - Packing", assignee: "Dispatcher", status: "Pending", dueTime: "6:10 PM" },
  { id: "16", date: "2025-02-04", taskName: "Labels - Print + Cut", assignee: "Meera D.", status: "In Progress", dueTime: "7:00 PM" },
  { id: "17", date: "2025-02-04", taskName: "Poster A2 - Mounting", assignee: "Imran A.", status: "Pending", dueTime: "5:30 PM" },
  { id: "18", date: "2025-02-04", taskName: "Menu Cards - Lamination", assignee: "Deepak L.", status: "Pending", dueTime: "8:00 PM" },
];

const dailyStatusVariants: Record<string, string> = {
  Pending: "bg-slate-100 text-slate-600 border-transparent",
  "In Progress": "bg-amber-100 text-amber-700 border-transparent",
  Completed: "bg-emerald-100 text-emerald-700 border-transparent",
};

export const dailyTaskReportColumns: ColumnDef<DailyTaskReportRow>[] = [
  { accessorKey: "date", header: () => <div className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-slate-400" /><span>Date</span></div>, cell: ({ row }) => <span className="font-medium text-slate-900">{row.getValue("date")}</span>, size: 100 },
  { accessorKey: "taskName", header: () => <div className="flex items-center gap-1.5"><Type className="w-3.5 h-3.5 text-slate-400" /><span>Task / Job</span></div>, cell: ({ row }) => <span className="text-slate-700">{row.getValue("taskName")}</span>, size: 180 },
  { accessorKey: "assignee", header: () => <div className="flex items-center gap-1.5"><User className="w-3.5 h-3.5 text-slate-400" /><span>Assignee</span></div>, cell: ({ row }) => <span className="text-slate-600">{row.getValue("assignee")}</span>, size: 120 },
  { accessorKey: "status", header: () => <div className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-slate-400" /><span>Status</span></div>, cell: ({ row }) => { const s = row.getValue("status") as string; return <Badge className={cn("px-2 py-0.5 rounded-full text-[10px]", dailyStatusVariants[s] || "bg-slate-50 text-slate-500")}>{s}</Badge>; }, size: 110 },
  { accessorKey: "dueTime", header: () => <div className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-slate-400" /><span>Due Time</span></div>, cell: ({ row }) => <span className="text-slate-600">{row.getValue("dueTime")}</span>, size: 90 },
];

// Daily tasks by day (for recharts bar chart)
export const dailyTasksByDayDummy = [
  { date: "Jan 29", total: 9, completed: 7, pending: 2 },
  { date: "Jan 30", total: 11, completed: 9, pending: 2 },
  { date: "Jan 31", total: 13, completed: 10, pending: 3 },
  { date: "Feb 1", total: 12, completed: 10, pending: 2 },
  { date: "Feb 2", total: 15, completed: 14, pending: 1 },
  { date: "Feb 3", total: 18, completed: 16, pending: 2 },
  { date: "Feb 4", total: 20, completed: 11, pending: 9 },
];
