
export type UserRole = 'Admin' | 'Designer' | 'Printer' | 'Fabricator' | 'Vendor' | 'Dispatcher';

export interface UserProfile {
  uid: string;
  email: string;
  displayName?: string;
  role: UserRole;
  createdAt: number;
}

export type JobStatus = 
  | 'NEW' 
  | 'DESIGNING' 
  | 'DESIGN READY' 
  | 'PRINTING' 
  | 'FABRICATION' 
  | 'READY' 
  | 'DISPATCHED' 
  | 'DELIVERED';

export interface JobAssignment {
  role: UserRole;
  assignedTo: string; // User UID
  assignedByName?: string; // Denormalized name for display
  remarks?: string;
  assignedAt: number;
}

export interface Job {
  id: string; // Firestore Doc ID
  jobId: number; // Incrementing Job Number (1001, 1002 etc)
  
  // Customer Info
  customerName: string;
  mobileNumber: string;
  email?: string;
  companyName?: string;

  // Job Info
  jobTitle: string;
  description: string;
  quantity: number;
  unit: string; // e.g., 'Nos', 'SqFt'
  rate: number;
  totalAmount: number;
  
  priority: 'Normal' | 'Urgent';
  dueDate: number; // Timestamp

  // Payment
  paymentType: 'Cash' | 'Credit';
  advanceAmount: number;
  balanceAmount: number;
  paymentStatus: 'Unpaid' | 'Partial' | 'Paid';

  // Delivery
  deliveryMode: 'Pickup' | 'Local Delivery';
  deliveryDate?: number;

  // Workflow
  status: JobStatus;
  assignments: JobAssignment[];
  
  // Dynamic Specs
  category: string;
  specifications?: {
    printing: Record<string, string | number>;
    fabrication: Record<string, string | number>;
  };

  createdAt: number;
  updatedAt: number;
  createdBy: string;
}

export interface Customer {
  id: string; // Firestore Doc ID
  name: string;
  mobile: string;
  email?: string;
  companyName?: string;
  gstin?: string;
  address?: string;
  createdAt: number;
}

export interface Vendor {
  id: string; // Firestore Doc ID
  name: string;
  mobile: string;
  email?: string;
  serviceType: string; // e.g., 'Printer', 'Fabricator'
  address?: string;
  createdAt: number;
}
