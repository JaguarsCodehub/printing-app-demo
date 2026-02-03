
"use client";

import { useEffect, useState } from "react";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Job } from "@/types";
import { DataTable } from "@/components/jobs/DataTable";
import { columns } from "@/components/jobs/columns";
import CreateJobDialog from "@/components/jobs/CreateJobDialog";
import JobDetailsDialog from "@/components/jobs/JobDetailsDialog";
import { useAuth } from "@/contexts/AuthContext";

export default function JobsPage() {
  const { user, userRole } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // ... logic ...
    if (!user || !userRole) return;

    let q;
    if (userRole === "Admin") {
      q = query(collection(db, "jobs"), orderBy("createdAt", "desc"));
    } else {
      q = query(collection(db, "jobs"), orderBy("createdAt", "desc"));
    }

    const unsubscribe = onSnapshot(q, (snapshot) => {
      let jobsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Job[];

      if (userRole !== "Admin") {
          jobsData = jobsData.filter(job => 
            job.assignments?.some(a => a.assignedTo === user.uid)
          );
      }

      setJobs(jobsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user, userRole]);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Jobs</h2>
          <p className="text-muted-foreground">
            Manage your printing jobs and track their status.
          </p>
        </div>
        <CreateJobDialog />
      </div>

      {loading ? (
        <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : (
        <DataTable columns={columns} data={jobs} onRowClick={setSelectedJob} />
      )}

      <JobDetailsDialog 
        job={selectedJob} 
        open={!!selectedJob} 
        onOpenChange={(open) => !open && setSelectedJob(null)} 
      />
    </div>
  );
}
