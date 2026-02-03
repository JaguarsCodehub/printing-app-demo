
"use client";

import { useEffect, useState } from "react";
import { collection, doc, getDocs, updateDoc, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Job, UserProfile, UserRole, JobAssignment } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";

interface AssignJobDialogProps {
  job: Job;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ROLES_TO_ASSIGN: UserRole[] = ["Designer", "Printer", "Fabricator", "Vendor", "Dispatcher"];

export default function AssignJobDialog({ job, open, onOpenChange }: AssignJobDialogProps) {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [assignments, setAssignments] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      // Initialize with current assignments
      const current: Record<string, string> = {};
      job.assignments.forEach(a => {
        current[a.role] = a.assignedTo;
      });
      setAssignments(current);

      // Fetch users
      const fetchUsers = async () => {
        // In real app, cache this or pass from parent
        const q = query(collection(db, "users"), where("role", "in", ROLES_TO_ASSIGN));
        const snap = await getDocs(q);
        setUsers(snap.docs.map(d => d.data() as UserProfile));
      };
      fetchUsers();
    }
  }, [open, job]);

  const handleAssign = async () => {
    setLoading(true);
    try {
      const newAssignments: JobAssignment[] = Object.entries(assignments)
        .filter(([_, uid]) => uid) // Only keep selected
        .map(([role, uid]) => {
          const user = users.find(u => u.uid === uid);
          return {
            role: role as UserRole,
            assignedTo: uid,
            assignedByName: user?.displayName || "Unknown",
            assignedAt: Date.now(),
          };
        });

      await updateDoc(doc(db, "jobs", job.id), {
        assignments: newAssignments
      });
      onOpenChange(false);
    } catch (error) {
      console.error("Error updating assignments:", error);
    } finally {
      setLoading(false);
    }
  };

  const getUsersForRole = (role: string) => users.filter(u => u.role === role);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Assign Job #{job.jobId}</DialogTitle>
          <DialogDescription>
            Assign team members to this job.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {ROLES_TO_ASSIGN.map((role) => (
            <div key={role} className="space-y-2">
              <label className="text-sm font-medium">{role}</label>
              <Select 
                value={assignments[role] || "unassigned"} 
                onValueChange={(val) => setAssignments(prev => ({ ...prev, [role]: val === "unassigned" ? "" : val }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder={`Select ${role}`} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="unassigned">-- Unassigned --</SelectItem>
                  {getUsersForRole(role).map(u => (
                    <SelectItem key={u.uid} value={u.uid}>
                      {u.displayName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ))}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleAssign} disabled={loading}>
            {loading ? "Saving..." : "Save Assignments"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
