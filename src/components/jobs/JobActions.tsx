
"use client";

import { useState } from "react";
import { Job, JobStatus } from "@/types";
import { Button } from "@/components/ui/Button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/DropdownMenu";
import { MoreHorizontal, UserPlus, CheckCircle, Eye } from "lucide-react";
import AssignJobDialog from "./AssignJobDialog";
import JobDetailsDialog from "./JobDetailsDialog";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

const STATUSES: JobStatus[] = [
  "NEW", "DESIGNING", "DESIGN READY", "PRINTING", "FABRICATION", "READY", "DISPATCHED", "DELIVERED"
];

export function JobActions({ job }: { job: Job }) {
  const [assignOpen, setAssignOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const updateStatus = async (status: JobStatus) => {
    try {
      await updateDoc(doc(db, "jobs", job.id), { status });
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-7 w-7 p-0 rounded-none border border-slate-200">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-3.5 w-3.5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="rounded-none border-slate-200 shadow-xl">
          <DropdownMenuLabel className="text-[10px] uppercase font-bold text-slate-400">Actions</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => setDetailsOpen(true)} className="text-xs font-bold py-2">
            <Eye className="mr-2 h-4 w-4" /> View Details
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setAssignOpen(true)} className="text-xs font-bold py-2">
            <UserPlus className="mr-2 h-4 w-4" /> Assign Team
          </DropdownMenuItem>
          <DropdownMenuSeparator className="bg-slate-100" />
          <DropdownMenuSub>
            <DropdownMenuSubTrigger className="text-xs font-bold py-2 text-primary">
              <CheckCircle className="mr-2 h-4 w-4" /> Update Status
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent className="rounded-none border-slate-200 shadow-xl">
              <DropdownMenuRadioGroup value={job.status} onValueChange={(v) => updateStatus(v as JobStatus)}>
                {STATUSES.map((s) => (
                  <DropdownMenuRadioItem key={s} value={s} className="text-xs font-bold">
                    {s}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
        </DropdownMenuContent>
      </DropdownMenu>

      <AssignJobDialog job={job} open={assignOpen} onOpenChange={setAssignOpen} />
      <JobDetailsDialog job={job} open={detailsOpen} onOpenChange={setDetailsOpen} />
    </>
  );
}
