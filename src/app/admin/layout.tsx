// src/app/(admin)/layout.tsx

import { StaffSidebar } from "../(public)/components/StaffSidebar";

// import { AdminNavigation } from "@/components/AdminNavigation"; // You would create this component later

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Placeholder for the secured Admin Navigation bar */}
      <StaffSidebar /> 
      
      <main className="pt-16 p-4">
        {children}
      </main>
    </div>
  );
}