
"use client";

import { Job } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/Dialog";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";
import { JOB_CATEGORIES } from "@/data/jobCategories";

interface JobDetailsDialogProps {
  job: Job | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const statusVariants: Record<string, string> = {
  NEW: "bg-blue-50 text-blue-700 border-blue-200",
  DESIGNING: "bg-amber-50 text-amber-700 border-amber-200",
  "DESIGN READY": "bg-emerald-50 text-emerald-700 border-emerald-200",
  PRINTING: "bg-indigo-50 text-indigo-700 border-indigo-200",
  FABRICATION: "bg-violet-50 text-violet-700 border-violet-200",
  READY: "bg-green-50 text-green-700 border-green-200",
  DISPATCHED: "bg-slate-50 text-slate-700 border-slate-200",
  DELIVERED: "bg-slate-100 text-slate-500 border-slate-200",
};

export default function JobDetailsDialog({ job, open, onOpenChange }: JobDetailsDialogProps) {
  if (!job) return null;

  const category = JOB_CATEGORIES.find(c => c.id === job.category);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] p-0 overflow-hidden rounded-none border-slate-200 shadow-2xl flex flex-col">
        <DialogHeader className="bg-slate-50 border-b border-slate-200 p-6 space-y-1 flex-shrink-0">
          <div className="flex items-center justify-between">
            <Badge className={cn("px-2 py-0.5 rounded-none border text-[10px] font-bold shadow-none tracking-widest", statusVariants[job.status] || "bg-slate-50")}>
               {job.status}
            </Badge>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Created {new Date(job.createdAt).toLocaleDateString()}</span>
          </div>
          <DialogTitle className="text-2xl font-black text-slate-900 tracking-tight">{job.jobTitle}</DialogTitle>
          <p className="text-sm text-slate-500 font-medium">{job.description || "No specific instructions provided."}</p>
        </DialogHeader>

        <div className="overflow-y-auto flex-1">
          
          {/* Main Info Section - Ticket Style */}
          <div className="flex flex-col border-b border-slate-200">
             {/* Key Details Row - White */}
             <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-slate-100 bg-white">
                <div className="p-4 flex flex-col gap-1">
                   <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Customer</span>
                   <span className="text-sm font-bold text-slate-800">{job.customerName}</span>
                   <span className="text-xs text-slate-500">{job.mobileNumber}</span>
                </div>
                <div className="p-4 flex flex-col gap-1">
                   <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Job Type</span>
                   <span className="text-sm font-bold text-slate-800">{category?.label || job.category}</span>
                   <span className="text-xs text-slate-500">{job.quantity} {job.unit}</span>
                </div>
                <div className="p-4 flex flex-col gap-1">
                   <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Due Date</span>
                   <span className="text-sm font-bold text-slate-800">{new Date(job.dueDate).toLocaleDateString()}</span>
                   <span className={cn("text-xs font-medium", job.priority === 'Urgent' ? "text-red-500" : "text-slate-500")}>
                      {job.priority} Priority
                   </span>
                </div>
                <div className="p-4 flex flex-col gap-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Delivery</span>
                    <span className="text-sm font-bold text-slate-800">{job.deliveryMode}</span>
                </div>
             </div>
             
             {/* Financial Row - Slight Background & Separator */}
             <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-slate-200/50 bg-slate-50 border-t border-slate-100">
                <div className="p-4 flex flex-col gap-1">
                   <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Amount</span>
                   <span className="text-lg font-black text-slate-800">₹{job.totalAmount}</span>
                </div>
                <div className="p-4 flex flex-col gap-1">
                   <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Advance</span>
                   <span className="text-lg font-bold text-slate-600">₹{job.advanceAmount}</span>
                </div>
                 <div className="p-4 flex flex-col gap-1">
                   <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Balance</span>
                   <span className={cn("text-lg font-black", job.balanceAmount > 0 ? "text-red-600" : "text-emerald-600")}>
                      ₹{job.balanceAmount}
                   </span>
                </div>
                 <div className="p-4 flex flex-col gap-1">
                   <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Payment Status</span>
                   <Badge variant="outline" className={cn("w-fit mt-1 rounded-sm px-2 font-bold", job.paymentStatus === 'Paid' ? "bg-emerald-100 text-emerald-700 border-emerald-200" : "bg-amber-100 text-amber-700 border-amber-200")}>
                      {job.paymentStatus}
                   </Badge>
                </div>
             </div>
          </div>

          {/* Specs Section - Table View */}
          {job.specifications && (
            <div className="grid grid-cols-1 md:grid-cols-2 bg-slate-50 border-b border-slate-200">
               {/* Printing Specs Table */}
               <div className="border-r border-slate-200">
                  <div className="bg-slate-100/50 px-4 py-2 border-b border-slate-200 flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                      <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Printing Specs</h3>
                  </div>
                  <div className="divide-y divide-slate-100 bg-white">
                      {Object.entries(job.specifications.printing || {}).map(([key, val]) => (
                          <div key={key} className="flex px-4 py-3 hover:bg-slate-50 transition-colors">
                              <span className="w-1/3 text-xs font-medium text-slate-400 capitalize">{key}</span>
                              <span className="w-2/3 text-sm font-semibold text-slate-700 break-words">{val}</span>
                          </div>
                      ))}
                      {(!job.specifications.printing || Object.keys(job.specifications.printing).length === 0) && (
                          <div className="p-4 text-xs text-slate-400 italic text-center">No printing specs</div>
                      )}
                  </div>
               </div>

               {/* Fabrication Specs Table */}
               <div>
                  <div className="bg-slate-100/50 px-4 py-2 border-b border-slate-200 flex items-center gap-2">
                       <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                       <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Fabrication Specs</h3>
                  </div>
                  <div className="divide-y divide-slate-100 bg-white">
                      {Object.entries(job.specifications.fabrication || {}).map(([key, val]) => (
                          <div key={key} className="flex px-4 py-3 hover:bg-slate-50 transition-colors">
                              <span className="w-1/3 text-xs font-medium text-slate-400 capitalize">{key}</span>
                              <span className="w-2/3 text-sm font-semibold text-slate-700 break-words">{val}</span>
                          </div>
                      ))}
                      {(!job.specifications.fabrication || Object.keys(job.specifications.fabrication).length === 0) && (
                          <div className="p-4 text-xs text-slate-400 italic text-center">No fabrication specs</div>
                      )}
                  </div>
               </div>
            </div>
          )}

          <div className="p-6 bg-slate-50 border-b border-slate-200">
              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Team Assignments</h3>
              <div className="space-y-2">
                  {job.assignments?.length ? job.assignments.map((as, i) => (
                      <div key={i} className="bg-white border border-slate-200 p-3 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                              <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5">{as.role}</span>
                              <span className="text-sm font-bold text-slate-800">{as.assignedByName}</span>
                          </div>
                          <span className="text-[10px] font-medium text-slate-400">Assigned {new Date(as.assignedAt).toLocaleDateString()}</span>
                      </div>
                  )) : (
                      <div className="text-xs font-medium text-slate-400 italic">No one assigned yet.</div>
                  )}
              </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
