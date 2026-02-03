
"use client";

import { useState, useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { addDoc, collection, getDocs, query, where, Timestamp, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/contexts/AuthContext";
import { UserProfile as User, UserRole, JobAssignment } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import { JOB_CATEGORIES, JobCategoryDefinition } from "@/data/jobCategories";

const jobSchema = z.object({
  category: z.string().min(1, "Category is required"),
  customerName: z.string().min(2, "Name is required"),
  mobileNumber: z.string().min(10, "Valid mobile number required"),
  jobTitle: z.string().min(3, "Job title required"),
  description: z.string().optional(),
  quantity: z.coerce.number().min(1, "Quantity must be at least 1"),
  unit: z.string().default("Nos"),
  rate: z.coerce.number().min(0),
  advanceAmount: z.coerce.number().min(0),
  priority: z.enum(["Normal", "Urgent"]),
  deliveryMode: z.enum(["Pickup", "Local Delivery"]),
  dueDate: z.string().min(1, "Due date is required"),
  
  // Costs
  designCost: z.coerce.number().min(0).optional(),
  fabricationCost: z.coerce.number().min(0).optional(),

  // Assignments
  designerId: z.string().optional(),
  printerId: z.string().optional(),
  fabricatorId: z.string().optional(),
  vendorId: z.string().optional(),
  
  designerRemark: z.string().optional(),
  printerRemark: z.string().optional(),
  fabricatorRemark: z.string().optional(),
  vendorRemark: z.string().optional(),

  // Dynamic specs
  printing: z.record(z.string(), z.any()).optional(),
  fabrication: z.record(z.string(), z.any()).optional(),
});

type JobFormValues = z.infer<typeof jobSchema>;

export default function CreateJobDialog({ onJobCreated }: { onJobCreated?: () => void }) {
  const [open, setOpen] = useState(false);
  const { user } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  
  const { register, control, handleSubmit, reset, setValue, watch, formState: { errors, isSubmitting } } = useForm<JobFormValues>({
    resolver: zodResolver(jobSchema) as any,
    defaultValues: {
      quantity: 1,
      unit: "Nos",
      rate: 0,
      advanceAmount: 0,
      priority: "Normal",
      deliveryMode: "Pickup",
      designCost: 0,
      fabricationCost: 0,
      printing: {},
      fabrication: {},
      dueDate: new Date().toISOString().split('T')[0],
    },
  });

  const selectedCategory = watch("category");
  const [activeCategory, setActiveCategory] = useState<JobCategoryDefinition | undefined>();
  const [categories, setCategories] = useState<JobCategoryDefinition[]>(JOB_CATEGORIES);

  useEffect(() => {
    // Fetch dynamic categories
    const unsubscribe = onSnapshot(collection(db, "product_categories"), (snapshot) => {
        const data = snapshot.docs.map(doc => doc.data() as JobCategoryDefinition);
        if (data.length > 0) {
            setCategories(data);
        }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    setActiveCategory(categories.find(c => c.id === selectedCategory));
  }, [selectedCategory, categories]);

  useEffect(() => {
    const fetchUsers = async () => {
        try {
            const q = query(collection(db, "users"));
            const snapshot = await getDocs(q);
            const usersData = snapshot.docs.map(doc => ({ uid: doc.id, ...doc.data() } as User));
            setUsers(usersData);
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    };
    if (open) {
        fetchUsers();
    }
  }, [open]);

  const getUsersByRole = (role: UserRole) => users.filter(u => u.role === role);

  const onSubmit = async (data: JobFormValues) => {
    if (!user) return;

    try {
      const totalAmount = data.quantity * data.rate;
      const balanceAmount = totalAmount - data.advanceAmount;

      const assignments: JobAssignment[] = [];
      const addAssignment = (role: UserRole, id?: string, remark?: string) => {
         if (id && id !== "none") {
            const assignedUser = users.find(u => u.uid === id);
            if (assignedUser) {
                assignments.push({
                    role,
                    assignedTo: id,
                    assignedByName: assignedUser.displayName || assignedUser.email,
                    remarks: remark,
                    assignedAt: Date.now(),
                });
            }
         }
      };

      addAssignment("Designer", data.designerId, data.designerRemark);
      addAssignment("Printer", data.printerId, data.printerRemark);
      addAssignment("Fabricator", data.fabricatorId, data.fabricatorRemark);
      addAssignment("Vendor", data.vendorId, data.vendorRemark);

      await addDoc(collection(db, "jobs"), {
        jobId: Math.floor(100000 + Math.random() * 900000).toString(),
        category: data.category,
        customerName: data.customerName,
        mobileNumber: data.mobileNumber,
        jobTitle: data.jobTitle,
        description: data.description,
        quantity: data.quantity,
        unit: data.unit,
        rate: data.rate,
        totalAmount,
        advanceAmount: data.advanceAmount,
        balanceAmount,
        paymentStatus: balanceAmount <= 0 ? "Paid" : (data.advanceAmount > 0 ? "Partial" : "Unpaid"),
        priority: data.priority,
        deliveryMode: data.deliveryMode,
        dueDate: data.dueDate ? new Date(data.dueDate).getTime() : Date.now(),
        designCost: data.designCost,
        fabricationCost: data.fabricationCost,
        status: "NEW", // Initial status
        assignments,
        specifications: {
            printing: data.printing || {},
            fabrication: data.fabrication || {}
        },
        createdBy: user.uid,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });

      setOpen(false);
      reset();
      onJobCreated?.();
    } catch (error) {
      console.error("Error creating job:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button onClick={() => setOpen(true)}>+ Create Job</Button>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>New Job Card</DialogTitle>
          <DialogDescription>Create a new printing job.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pt-4">
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2 col-span-2">
                <label className="text-sm font-medium">Job Category</label>
                <Select onValueChange={(val) => setValue("category", val)} defaultValue={watch("category")}>
                <SelectTrigger>
                    <SelectValue placeholder="Select Job Type..." />
                </SelectTrigger>
                <SelectContent>
                    {categories.map(cat => (
                        <SelectItem key={cat.id} value={cat.id}>{cat.label}</SelectItem>
                    ))}
                </SelectContent>
                </Select>
                {errors.category && <p className="text-sm text-red-500">{errors.category.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Customer Name</label>
              <Input {...register("customerName")} placeholder="John Doe" />
              {errors.customerName && <p className="text-sm text-red-500">{errors.customerName.message}</p>}
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Mobile Number</label>
              <Input {...register("mobileNumber")} placeholder="9876543210" />
              {errors.mobileNumber && <p className="text-sm text-red-500">{errors.mobileNumber.message}</p>}
            </div>

            <div className="space-y-2 col-span-2">
              <label className="text-sm font-medium">Job Title / Description</label>
              <Input {...register("jobTitle")} placeholder="e.g. 1000 Visiting Cards" />
              {errors.jobTitle && <p className="text-sm text-red-500">{errors.jobTitle.message}</p>}
            </div>

             <div className="space-y-2 col-span-2">
              <label className="text-sm font-medium">Additional Instructions</label>
              <Input {...register("description")} placeholder="Any specific remarks..." />
            </div>

            {/* Deadline */}
            <div className="space-y-2">
                 <label className="text-sm font-medium">Deadline / Due Date</label>
                 <Input type="date" {...register("dueDate")} />
                 {errors.dueDate && <p className="text-sm text-red-500">{errors.dueDate.message}</p>}
            </div>
          </div>

          <div className="bg-slate-50/50 rounded-xl p-6 border border-slate-100">
             <div className="flex items-center justify-between mb-4">
               <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Specifications</h3>
               {!activeCategory && <span className="text-[10px] text-slate-400 italic">Select a category to view fields</span>}
             </div>
             
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                     <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                         <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                         <h4 className="text-sm font-bold text-slate-700">Printing</h4>
                     </div>
                     {activeCategory?.printingFields.length ? (
                         <div className="grid gap-4">
                            {activeCategory.printingFields.map(field => (
                                <div key={field.name} className="space-y-1.5">
                                    <label className="text-xs font-medium text-slate-500">{field.label}</label>
                                    {field.type === 'select' ? (
                                        <Select onValueChange={(val) => setValue(`printing.${field.name}`, val)}>
                                            <SelectTrigger className="h-9 bg-white border-slate-200 focus:ring-1 focus:ring-blue-500/20">
                                                <SelectValue placeholder={`Select ${field.label}`} />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {field.options?.map(opt => (
                                                    <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    ) : (
                                        <Input 
                                            type={field.type} 
                                            {...register(`printing.${field.name}`)}
                                            className="h-9 bg-white border-slate-200 focus-visible:ring-1 focus-visible:ring-blue-500/20" 
                                        />
                                    )}
                                </div>
                            ))}
                         </div>
                     ) : (
                        <div className="h-24 flex items-center justify-center border-2 border-dashed border-slate-100 rounded-lg">
                            <span className="text-xs text-slate-300 font-medium">No printing specs</span>
                        </div>
                     )}
                </div>

                <div className="space-y-4">
                     <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                         <div className="w-1.5 h-1.5 bg-amber-500 rounded-full"></div>
                         <h4 className="text-sm font-bold text-slate-700">Fabrication</h4>
                     </div>
                     {activeCategory?.fabricationFields.length ? (
                         <div className="grid gap-4">
                            {activeCategory.fabricationFields.map(field => (
                                <div key={field.name} className="space-y-1.5">
                                    <label className="text-xs font-medium text-slate-500">{field.label}</label>
                                    {field.type === 'select' ? (
                                        <Select onValueChange={(val) => setValue(`fabrication.${field.name}`, val)}>
                                            <SelectTrigger className="h-9 bg-white border-slate-200 focus:ring-1 focus:ring-amber-500/20">
                                                <SelectValue placeholder={`Select ${field.label}`} />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {field.options?.map(opt => (
                                                    <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    ) : (
                                        <Input 
                                            type={field.type} 
                                            {...register(`fabrication.${field.name}`)}
                                            className="h-9 bg-white border-slate-200 focus-visible:ring-1 focus-visible:ring-amber-500/20" 
                                        />
                                    )}
                                </div>
                            ))}
                         </div>
                     ) : (
                        <div className="h-24 flex items-center justify-center border-2 border-dashed border-slate-100 rounded-lg">
                            <span className="text-xs text-slate-300 font-medium">No fabrication specs</span>
                        </div>
                     )}
                </div>
             </div>
          </div>

          {/* Assignments Section */}
          <div className="border rounded-xl overflow-hidden">
                <div className="bg-slate-100 px-4 py-2 border-b border-slate-200">
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Assign Task To</h3>
                </div>
                <div className="divide-y divide-slate-100 bg-slate-50/30">
                    {/* Designer */}
                    <div className="p-4 grid grid-cols-12 gap-4 items-center">
                        <div className="col-span-3 text-sm font-medium text-slate-600">Assign to Designer</div>
                        <div className="col-span-3">
                             <Select onValueChange={(val) => setValue("designerId", val)}>
                                <SelectTrigger className="h-9 bg-white"><SelectValue placeholder="Select Designer" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="none">-- None --</SelectItem>
                                    {getUsersByRole("Designer").map(u => (
                                        <SelectItem key={u.uid} value={u.uid}>{u.displayName || u.email}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="col-span-3">
                            <Input {...register("designerRemark")} placeholder="Remarks..." className="h-9 bg-white" />
                        </div>
                        <div className="col-span-3">
                             <Input type="number" {...register("designCost")} placeholder="Design Cost" className="h-9 bg-white" />
                        </div>
                    </div>
                    {/* Printer */}
                    <div className="p-4 grid grid-cols-12 gap-4 items-center">
                        <div className="col-span-3 text-sm font-medium text-slate-600">Assign to Printer</div>
                        <div className="col-span-3">
                             <Select onValueChange={(val) => setValue("printerId", val)}>
                                <SelectTrigger className="h-9 bg-white"><SelectValue placeholder="Select Printer" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="none">-- None --</SelectItem>
                                    {getUsersByRole("Printer").map(u => (
                                        <SelectItem key={u.uid} value={u.uid}>{u.displayName || u.email}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="col-span-3">
                            <Input {...register("printerRemark")} placeholder="Remarks..." className="h-9 bg-white" />
                        </div>
                    </div>
                     {/* Fabricator */}
                     <div className="p-4 grid grid-cols-12 gap-4 items-center">
                        <div className="col-span-3 text-sm font-medium text-slate-600">Assign to Fabricator</div>
                        <div className="col-span-3">
                             <Select onValueChange={(val) => setValue("fabricatorId", val)}>
                                <SelectTrigger className="h-9 bg-white"><SelectValue placeholder="Select Fabricator" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="none">-- None --</SelectItem>
                                    {getUsersByRole("Fabricator").map(u => (
                                        <SelectItem key={u.uid} value={u.uid}>{u.displayName || u.email}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="col-span-3">
                            <Input {...register("fabricatorRemark")} placeholder="Remarks..." className="h-9 bg-white" />
                        </div>
                        <div className="col-span-3">
                             <Input type="number" {...register("fabricationCost")} placeholder="Fab Cost" className="h-9 bg-white" />
                        </div>
                    </div>
                     {/* Vendor */}
                     <div className="p-4 grid grid-cols-12 gap-4 items-center">
                        <div className="col-span-3 text-sm font-medium text-slate-600">Assign to Vendor</div>
                        <div className="col-span-3">
                             <Select onValueChange={(val) => setValue("vendorId", val)}>
                                <SelectTrigger className="h-9 bg-white"><SelectValue placeholder="Select Vendor" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="none">-- None --</SelectItem>
                                    {getUsersByRole("Vendor").map(u => (
                                        <SelectItem key={u.uid} value={u.uid}>{u.displayName || u.email}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="col-span-3">
                            <Input {...register("vendorRemark")} placeholder="Remarks..." className="h-9 bg-white" />
                        </div>
                    </div>
                </div>
          </div>

          <div className="grid grid-cols-2 gap-4 border-t pt-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Quantity</label>
              <div className="flex gap-2">
                <Input type="number" {...register("quantity")} placeholder="100" />
                <Select onValueChange={(val) => setValue("unit", val)} defaultValue={watch("unit") || "Nos"}>
                  <SelectTrigger className="w-24">
                    <SelectValue placeholder="Unit" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Nos">Nos</SelectItem>
                    <SelectItem value="Set">Set</SelectItem>
                    <SelectItem value="SQFT">SQFT</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Rate per Unit</label>
              <Input type="number" {...register("rate")} placeholder="0.00" />
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium">Advance Amount</label>
                <Input type="number" {...register("advanceAmount")} placeholder="0.00" />
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium">Delivery & Priority</label>
                <div className="flex gap-2">
                     <Select onValueChange={(val) => setValue("priority", val as any)} defaultValue="Normal">
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Normal">Normal</SelectItem>
                            <SelectItem value="Urgent">Urgent</SelectItem>
                        </SelectContent>
                    </Select>
                    <Select onValueChange={(val) => setValue("deliveryMode", val as any)} defaultValue="Pickup">
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                             <SelectItem value="Pickup">Pickup</SelectItem>
                             <SelectItem value="Local Delivery">Local Delivery</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Total Summary */}
            <div className="col-span-2 bg-slate-100 rounded-lg p-4 flex items-center justify-between border border-slate-200">
                <div className="flex flex-col">
                    <span className="text-xs text-slate-500 font-medium uppercase tracking-wider">Total Amount</span>
                    <span className="text-2xl font-black text-slate-800">
                        ₹{((Number(watch("quantity")) || 0) * (Number(watch("rate")) || 0)).toFixed(2)}
                    </span>
                </div>
                 <div className="h-8 w-px bg-slate-300 mx-4"></div>
                <div className="flex flex-col">
                    <span className="text-xs text-slate-500 font-medium uppercase tracking-wider">Advance</span>
                    <span className="text-xl font-bold text-slate-600">
                        ₹{(Number(watch("advanceAmount")) || 0).toFixed(2)}
                    </span>
                </div>
                <div className="h-8 w-px bg-slate-300 mx-4"></div>
                <div className="flex flex-col items-end">
                     <span className="text-xs text-slate-500 font-medium uppercase tracking-wider">Balance Due</span>
                    <span className={`text-2xl font-black ${((Number(watch("quantity")) || 0) * (Number(watch("rate")) || 0) - (Number(watch("advanceAmount")) || 0)) > 0 ? 'text-red-600' : 'text-emerald-600'}`}>
                        ₹{((Number(watch("quantity")) || 0) * (Number(watch("rate")) || 0) - (Number(watch("advanceAmount")) || 0)).toFixed(2)}
                    </span>
                </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Creating..." : "Create Job Card"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
