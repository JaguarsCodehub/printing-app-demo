# PrintFlow – Job Card & Production Management (MVP)

## Product Requirements Document (PRD)

---

## 1. Product Overview

### Product Name

**PrintFlow – Job Card & Production Management (MVP)**

### Problem Statement

Printing businesses typically manage offline customers, design work, printing, fabrication, vendor coordination, and delivery using registers, WhatsApp, and verbal communication. This leads to:

* Missed deadlines
* Confusion between teams
* No visibility into job progress
* Poor accountability

### Solution

A web-based internal system to manage:

* Job cards
* Role-based task assignments
* Job lifecycle tracking
* A single source of truth for each job

---

## 2. MVP Goals

The MVP is intended to:

* Demonstrate the complete workflow
* Prove role-based access control
* Show clear job lifecycle tracking
* Act as a demo-ready product for the client

This MVP is **not** intended to be a full SaaS or production-scale system.

---

## 3. User Roles & Permissions

### Roles

* Admin
* Designer
* Printer
* Fabricator
* Vendor
* Dispatcher

### Role Access Matrix

| Role       | Access                         |
| ---------- | ------------------------------ |
| Admin      | Full system access             |
| Designer   | Only assigned design jobs      |
| Printer    | Only assigned print jobs       |
| Fabricator | Only assigned fabrication jobs |
| Vendor     | Only assigned vendor jobs      |
| Dispatcher | Only delivery-related jobs     |

**Rule:** A user can only see jobs explicitly assigned to them.

---

## 4. Authentication & User Management

### Authentication

* Firebase Authentication
* Email + Password login
* One pre-created Admin user (manually created)

### Admin Capabilities

* Create users
* Assign roles to users
* Enable / disable users

Self-signup is **out of scope** for the MVP.

---

## 5. Core Feature: Job Management

A **Job Card** represents a single customer printing requirement.

---

## 6. Job Creation (Offline → Digital)

### Actor

Admin / Front Desk

### Job Card Fields

#### Customer Information

* Mobile Number
* Customer Name
* Email (optional)
* Company (optional)

#### Job Information

* Job Title (e.g., Wedding Card Printing)
* Job Description
* Quantity
* Unit (Nos)
* Rate
* Total Amount (auto-calculated)
* Due Date
* Urgency (Yes / No)

#### Payment Information (Basic)

* Payment Type: Cash / Credit
* Advance Amount
* Balance Amount (auto-calculated)

#### Delivery Information

* Delivery Mode: Pickup / Local Delivery
* Delivery Date

---

## 7. Task Assignment Model

Admin can assign a job to one or more roles using checkboxes:

* Designer
* Printer
* Fabricator
* Vendor

Each assignment includes:

* Assigned user
* Optional remarks

---

## 8. Job Lifecycle & Status

### Job Status Flow

```
NEW
→ DESIGNING
→ DESIGN READY
→ PRINTING
→ FABRICATION
→ READY
→ DISPATCHED
→ DELIVERED
```

* Status transitions are manual in MVP
* Admin has full control over status changes

---

## 9. Designer Experience

### Designer Dashboard

* Displays only jobs assigned to the designer
* Table-based view using TanStack Table

### Designer Actions

* View job details
* Upload design files
* Update design status
* Add remarks

Designer cannot view printing, vendor, or payment information.

---

## 10. Printer Experience

### Printer Dashboard

* Displays only assigned print jobs

### Printer Actions

* View print specifications
* Update printing status
* Add remarks

---

## 11. Fabricator Experience

### Fabricator Dashboard

* Displays only assigned fabrication jobs

### Fabricator Actions

* View fabrication tasks
* Update fabrication progress
* Add remarks

---

## 12. Vendor Experience

### Vendor Dashboard

* Displays only jobs assigned to the vendor

### Vendor Actions

* View job details
* Update vendor-related status
* Add remarks

---

## 13. Dispatcher Experience

### Dispatcher Dashboard

* Displays jobs marked as READY

### Dispatcher Actions

* Update delivery status (Dispatched / Delivered)
* Add delivery remarks

---

## 14. Job Card Details Screen

The Job Card Details screen acts as the single source of truth.

### Must Display

* Job Number
* Job Date
* Current Status
* Customer Details
* Job Description
* Assigned Roles & Users
* Cost Breakdown

  * Design Cost
  * Fabrication Cost
  * Total Amount
  * Advance
  * Balance
* Remarks
* Attachments (designs, references)

### Admin-Only Actions

* Assign / reassign users
* Change job status
* Mark job as approved
* Print / export job card (optional)

---

## 15. UI & UX Guidelines

### Principles

* Airtable-inspired layout
* Clean and fast interface
* Table-first UI
* Keyboard-friendly interactions

### Components

* TanStack Table
* Inline editing
* Status badges
* Role-based views

UI polish is secondary for MVP; clarity and structure are primary.

---

## 16. Tech Stack (MVP)

### Frontend

* Next.js (App Router)
* TypeScript
* Tailwind CSS
* TanStack Table

### Backend / Infrastructure

* Firebase Authentication
* Firebase Firestore
* Firebase Storage

### Core Collections

* users
* jobs
* assignments
* attachments
* status_history

---

## 17. Out of Scope (MVP)

* Inventory management
* Accounting / GST
* WhatsApp or SMS notifications
* Payment gateway integration
* Delivery APIs (Porter, etc.)
* Customer login portal

---

## 18. MVP Success Criteria

The MVP is successful if:

* Admin can create and manage jobs
* Jobs can be assigned to multiple roles
* Each role sees only assigned jobs
* Job status updates function correctly
* Job Card displays all required information
* Client clearly understands the workflow and value

---

## 19. Future Enhancements (Post-MVP)

* SMS / WhatsApp notifications
* Inventory & wastage tracking
* Reports & analytics
* Multi-branch support
* SaaS monetization & subscriptions

---

**End of Document**
