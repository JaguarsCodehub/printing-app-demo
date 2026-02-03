"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { addDoc, collection } from "firebase/firestore";
import { db } from "@/lib/firebase";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Plus } from "lucide-react";

const customerSchema = z.object({
  name: z.string().min(2, "Name is required"),
  mobile: z.string().min(10, "Valid mobile number required"),
  email: z.string().email().optional().or(z.literal("")),
  companyName: z.string().optional(),
  gstin: z.string().optional(),
  address: z.string().optional(),
});

type CustomerFormValues = z.infer<typeof customerSchema>;

export function CreateCustomerDialog() {
  const [open, setOpen] = useState(false);
  
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<CustomerFormValues>({
    resolver: zodResolver(customerSchema),
  });

  const onSubmit = async (data: CustomerFormValues) => {
    try {
      await addDoc(collection(db, "customers"), {
        ...data,
        createdAt: Date.now(),
      });
      setOpen(false);
      reset();
    } catch (error) {
      console.error("Error creating customer:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Add Customer
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Customer</DialogTitle>
          <DialogDescription>Enter customer details.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Customer Name</label>
            <Input {...register("name")} placeholder="John Doe" />
            {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div className="space-y-2">
                <label className="text-sm font-medium">Mobile</label>
                <Input {...register("mobile")} placeholder="9876543210" />
                {errors.mobile && <p className="text-xs text-red-500">{errors.mobile.message}</p>}
             </div>
             <div className="space-y-2">
                <label className="text-sm font-medium">Email (Optional)</label>
                <Input {...register("email")} placeholder="john@example.com" />
                {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
             </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Company Name (Optional)</label>
            <Input {...register("companyName")} placeholder="Acme Corp" />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">GSTIN (Optional)</label>
            <Input {...register("gstin")} placeholder="GSTIN Number" />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Address (Optional)</label>
            <Input {...register("address")} placeholder="Full Address" />
          </div>

          <DialogFooter>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Customer"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
