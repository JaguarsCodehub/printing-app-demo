"use client";

import { useEffect, useState } from "react";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Vendor } from "@/types";
import { DataTable } from "@/components/jobs/DataTable";
import { vendorColumns } from "@/components/vendors/columns";
import { CreateVendorDialog } from "@/components/vendors/CreateVendorDialog";

export default function VendorsPage() {
  const [vendors, setVendors] = useState<Vendor[]>([]);

  useEffect(() => {
    const q = query(collection(db, "vendors"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as Vendor);
      setVendors(data);
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="space-y-6">
       <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Vendors</h2>
          <p className="text-muted-foreground">
            Manage your vendor directory.
          </p>
        </div>
        <CreateVendorDialog />
      </div>

      <div className="space-y-4">
        <DataTable columns={vendorColumns} data={vendors} searchKey="name" />
      </div>
    </div>
  );
}
