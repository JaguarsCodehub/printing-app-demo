"use client";

import { useEffect, useState } from "react";
import { collection, onSnapshot, getDocs, writeBatch, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { JOB_CATEGORIES, JobCategoryDefinition } from "@/data/jobCategories";
import { Button } from "@/components/ui/Button";
import { Plus } from "lucide-react";
import { DataTable } from "@/components/jobs/DataTable";
import { productColumns } from "@/components/products/columns";
// import { CreateProductDialog } from "@/components/products/CreateProductDialog"; // TOD0

export default function ProductsPage() {
  const [products, setProducts] = useState<JobCategoryDefinition[]>([]);

  useEffect(() => {
    // Real-time listener
    const unsubscribe = onSnapshot(collection(db, "product_categories"), (snapshot) => {
      const data = snapshot.docs.map(doc => doc.data() as JobCategoryDefinition);
      setProducts(data);
    });

    // Seeding check
    const checkAndSeed = async () => {
        const snap = await getDocs(collection(db, "product_categories"));
        if (snap.empty) {
            console.log("Seeding product categories...");
            const batch = writeBatch(db);
            JOB_CATEGORIES.forEach(cat => {
                const docRef = doc(db, "product_categories", cat.id);
                batch.set(docRef, cat);
            });
            await batch.commit();
            console.log("Seeding complete.");
        }
    };
    checkAndSeed();

    return () => unsubscribe();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Products</h2>
          <p className="text-muted-foreground">
            Manage your product catalog and their specifications.
          </p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Add Product
        </Button>
      </div>

      <div className="space-y-4">
        <DataTable columns={productColumns} data={products} searchKey="label" />
      </div>
    </div>
  );
}
