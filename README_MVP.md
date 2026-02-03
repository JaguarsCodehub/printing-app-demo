
# PrintFlow MVP - Instructions

## Getting Started

1.  **Install Dependencies**
    ```bash
    npm install
    ```
    (I have already run this for you)

2.  **Run Development Server**
    ```bash
    npm run dev
    ```

3.  **Initial Setup (Create Admin User)**
    - Navigate to `http://localhost:3000/setup`
    - Fill in the form to create your first **Admin** user.
    - This will create the user in Firebase Auth and the `users` collection.

4.  **Using the App**
    - **Login**: Go to `/login` (or you will be redirected there).
    - **Dashboard**: View overview.
    - **Users (Admin Only)**: Go to `/users`. Click "Add User" to create staff accounts (Designers, Printers, etc.).
      - *Note*: Creating a user will currently log you in as that new user. You may need to logout and login back as Admin.
    - **Jobs**: Go to `/jobs`.
      - **Create Job**: Click "Create Job".
      - **Assign**: Click the "..." menu on a job row -> "Assign Team".
      - **Update Status**: Click "..." -> "Update Status".

## Features Implemented
- **Authentication**: Role-based (Admin, Designer, Printer, Fabricator, Vendor, Dispatcher).
- **Job Management**: Full lifecycle tracking (New -> Delivered).
- **Assignments**: Assign specific roles to specific users.
- **Dashboards**: Users only see jobs assigned to them (except Admin who sees all).
- **Tech Stack**: Next.js 15, TailwindCSS, Firebase, TanStack Table.
