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
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select";
import { Plus } from "lucide-react";

const vendorSchema = z.object({
  name: z.string().min(2, "Name is required"),
  mobile: z.string().min(10, "Valid mobile required"),
  email: z.string().email().optional().or(z.literal("")),
  serviceType: z.enum(["Printer", "Fabricator", "Material Supplier", "Other"]),
  address: z.string().optional(),
});

type VendorFormValues = z.infer<typeof vendorSchema>;

export function CreateVendorDialog() {
  const [open, setOpen] = useState(false);
  const { register, handleSubmit, setValue, watch, formState: { errors, isSubmitting }, reset } = useForm<VendorFormValues>({
    resolver: zodResolver(vendorSchema),
    defaultValues: {
        serviceType: "Printer"
    }
  });

  const onSubmit = async (data: VendorFormValues) => {
    try {
      await addDoc(collection(db, "vendors"), {
        ...data,
        createdAt: Date.now(),
      });
      setOpen(false);
      reset();
    } catch (error) {
       console.error(error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add Vendor
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
            <DialogTitle>Add New Vendor</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
            <div className="space-y-2">
                <label className="text-sm font-medium">Vendor Name</label>
                <Input {...register("name")} placeholder="Vendor Name" />
                {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
            </div>
            
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium">Mobile</label>
                    <Input {...register("mobile")} placeholder="9876543210" />
                    {errors.mobile && <p className="text-xs text-red-500">{errors.mobile.message}</p>}
                </div>
                 <div className="space-y-2">
                    <label className="text-sm font-medium">Service Type</label>
                    <Select onValueChange={(val) => setValue("serviceType", val as any)} defaultValue={watch("serviceType")}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Printer">Printer</SelectItem>
                            <SelectItem value="Fabricator">Fabricator</SelectItem>
                            <SelectItem value="Material Supplier">Material Supplier</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium">Email (Optional)</label>
                <Input {...register("email")} placeholder="vendor@example.com" />
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium">Address (Optional)</label>
                <Input {...register("address")} placeholder="Full Address" />
            </div>

            <DialogFooter>
                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Creating..." : "Create Vendor"}
                </Button>
            </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
