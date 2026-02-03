
"use client";

import { useEffect, useState } from "react";
import { collection, onSnapshot, query, addDoc, serverTimestamp } from "firebase/firestore";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { db, auth } from "@/lib/firebase";
import { UserProfile, UserRole } from "@/types";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/Dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import { Plus } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { useAuth } from "@/contexts/AuthContext";
import { DataTable } from "@/components/jobs/DataTable";
import { userColumns } from "./columns";

export default function UsersPage() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const { userRole } = useAuth();
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newName, setNewName] = useState("");
  const [newRole, setNewRole] = useState<UserRole>("Designer");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Only Admin should see this really
    const q = query(collection(db, "users"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const usersData = snapshot.docs.map(doc => doc.data() as UserProfile);
      setUsers(usersData);
    });
    return () => unsubscribe();
  }, []);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    let secondaryApp: any = null;

    try {
      // Initialize a secondary app to avoid logging out the current admin
      const { initializeApp, deleteApp } = await import("firebase/app");
      const { getAuth, createUserWithEmailAndPassword } = await import("firebase/auth");
      const { firebaseConfig } = await import("@/lib/firebase");
      const { setDoc, doc } = await import("firebase/firestore");

      const secondaryAppName = `secondary-${Date.now()}`;
      secondaryApp = initializeApp(firebaseConfig, secondaryAppName);
      const secondaryAuth = getAuth(secondaryApp);

      const cred = await createUserWithEmailAndPassword(secondaryAuth, newEmail, newPassword);
      
      const newProfile: UserProfile = {
        uid: cred.user.uid,
        email: newEmail,
        displayName: newName,
        role: newRole,
        createdAt: Date.now(),
      };
      
      // Write to the MAIN database using the global 'db' instance
      // (Assuming Admin has write permissions to 'users' collection)
      await setDoc(doc(db, "users", cred.user.uid), newProfile);
      
      // Cleanup secondary app
      await deleteApp(secondaryApp);
      
      setOpen(false);
      setNewEmail("");
      setNewPassword("");
      setNewName("");
      setLoading(false);
      
      alert(`User ${newName} created successfully!`);
      
    } catch (error: any) {
      console.error(error);
      alert(error.message);
      setLoading(false);
      if (secondaryApp) {
          try {
             const { deleteApp } = await import("firebase/app");
             await deleteApp(secondaryApp);
          } catch(e) { console.error("Error cleaning up", e)}
      }
    }
  };

  if (userRole !== "Admin") {
    return <div>Access Denied. Admins only.</div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Users</h2>
          <p className="text-muted-foreground">
            Manage your team members and roles.
          </p>
        </div>
        
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add User
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Team Member</DialogTitle>
              <DialogDescription>
                This will create a new login account.
                <br/>
                <span className="text-amber-600 font-bold">Warning: You will be logged out after creation.</span>
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleCreateUser} className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Name</label>
                <Input value={newName} onChange={e => setNewName(e.target.value)} required placeholder="Jane Doe" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Email</label>
                <Input value={newEmail} onChange={e => setNewEmail(e.target.value)} required type="email" placeholder="jane@printflow.com" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Password</label>
                <Input value={newPassword} onChange={e => setNewPassword(e.target.value)} required type="password" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Role</label>
                <Select value={newRole} onValueChange={(val) => setNewRole(val as UserRole)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Admin">Admin</SelectItem>
                    <SelectItem value="Designer">Designer</SelectItem>
                    <SelectItem value="Printer">Printer</SelectItem>
                    <SelectItem value="Fabricator">Fabricator</SelectItem>
                    <SelectItem value="Vendor">Vendor</SelectItem>
                    <SelectItem value="Dispatcher">Dispatcher</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <DialogFooter>
                <Button type="submit" disabled={loading}>
                  {loading ? "Creating..." : "Create User"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-4">
        <DataTable columns={userColumns} data={users} searchKey="displayName" />
      </div>
    </div>
  );
}
