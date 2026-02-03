"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Job } from "@/types";
import { DataTable } from "@/components/jobs/DataTable";
import { columns } from "@/components/jobs/columns";
import JobDetailsDialog from "@/components/jobs/JobDetailsDialog";

export default function OverviewPage() {
  const { user, profile, userRole } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    completed: 0
  });

  useEffect(() => {
    if (!user || !userRole) return;

    const q = query(collection(db, "jobs"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      let jobsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as Job);

      // Filter by assignment for non-admins
      if (userRole !== "Admin") {
        jobsData = jobsData.filter(job => 
          job.assignments?.some(a => a.assignedTo === user.uid)
        );
      }

      setJobs(jobsData);

      const counts = {
        total: jobsData.length,
        pending: jobsData.filter(j => j.status === "NEW").length,
        inProgress: jobsData.filter(j => ["DESIGNING", "PRINTING", "FABRICATION"].includes(j.status)).length,
        completed: jobsData.filter(j => ["READY", "DISPATCHED", "DELIVERED"].includes(j.status)).length
      };

      setStats(counts);
    });

    return () => unsubscribe();
  }, [user, userRole]);

  return (
    <div className="space-y-8 w-full">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Dashboard</h1>
        <p className="text-slate-500 font-medium">
          Welcome back, {profile?.displayName || profile?.email}
        </p>
      </div>
      
      {/* <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
        <div className="px-4 py-3 bg-white border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-8 h-8 flex-shrink-0 bg-blue-50 text-blue-600 flex items-center justify-center font-black text-xs">∑</div>
          <div className="min-w-0">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Total Jobs</div>
            <div className="text-xl font-black text-slate-900 mt-1">{stats.total}</div>
          </div>
        </div>
        <div className="px-4 py-3 bg-white border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-8 h-8 flex-shrink-0 bg-amber-50 text-amber-600 flex items-center justify-center font-black text-xs">!</div>
          <div className="min-w-0">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Pending</div>
            <div className="text-xl font-black text-slate-900 mt-1">{stats.pending}</div>
          </div>
        </div>
        <div className="px-4 py-3 bg-white border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-8 h-8 flex-shrink-0 bg-indigo-50 text-indigo-600 flex items-center justify-center font-black text-xs">⚙</div>
          <div className="min-w-0">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">In Progress</div>
            <div className="text-xl font-black text-slate-900 mt-1">{stats.inProgress}</div>
          </div>
        </div>
        <div className="px-4 py-3 bg-white border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-8 h-8 flex-shrink-0 bg-emerald-50 text-emerald-600 flex items-center justify-center font-black text-xs">✓</div>
          <div className="min-w-0">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Completed</div>
            <div className="text-xl font-black text-slate-900 mt-1">{stats.completed}</div>
          </div>
        </div>
      </div> */}

      <div className="space-y-3">
        <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Recent Assignments</h2>
        </div>
        <DataTable columns={columns} data={jobs} onRowClick={setSelectedJob} />
      </div>

      <JobDetailsDialog 
        job={selectedJob} 
        open={!!selectedJob} 
        onOpenChange={(open) => !open && setSelectedJob(null)} 
      />
    </div>
  );
}
