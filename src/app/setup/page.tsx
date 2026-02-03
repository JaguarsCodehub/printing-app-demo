
"use client";

import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { UserProfile } from "@/types";
import { useRouter } from "next/navigation";

export default function SetupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const router = useRouter();

  const handleSetup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMsg("");

    try {
      // 1. Create Auth User
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 2. Create Admin Profile in Firestore
      const newProfile: UserProfile = {
        uid: user.uid,
        email: user.email!,
        displayName: name,
        role: "Admin",
        createdAt: Date.now(),
      };

      await setDoc(doc(db, "users", user.uid), newProfile);
      
      setMsg("Admin user created successfully! Redirecting...");
      setTimeout(() => router.push("/"), 2000);
    } catch (error: any) {
      console.error(error);
      setMsg(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md p-8 border rounded-xl shadow-lg bg-card">
        <h1 className="text-2xl font-bold mb-6">Initial Setup (Admin)</h1>
        
        <form onSubmit={handleSetup} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Full Name</label>
            <input
              type="text"
              required
              className="w-full p-2 border rounded-md bg-background"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              required
              className="w-full p-2 border rounded-md bg-background"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              required
              className="w-full p-2 border rounded-md bg-background"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {msg && (
            <div className={`p-2 text-sm rounded ${msg.startsWith("Error") ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>
              {msg}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-primary-foreground py-2 rounded-md font-medium hover:bg-primary/90 disabled:opacity-50"
          >
            {loading ? "Creating Admin..." : "Create Admin User"}
          </button>
        </form>
      </div>
    </div>
  );
}
