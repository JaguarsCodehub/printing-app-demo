"use client";

import { useEffect, useState } from "react";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Customer } from "@/types";
import { DataTable } from "@/components/jobs/DataTable";
import { customerColumns } from "@/components/customers/columns";
import { CreateCustomerDialog } from "@/components/customers/CreateCustomerDialog";

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);

  useEffect(() => {
    const q = query(collection(db, "customers"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as Customer);
      setCustomers(data);
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="space-y-6">
       <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Customers</h2>
          <p className="text-muted-foreground">
            Manage your customer database.
          </p>
        </div>
        <CreateCustomerDialog />
      </div>

      <div className="space-y-4">
        <DataTable columns={customerColumns} data={customers} searchKey="name" />
      </div>
    </div>
  );
}
