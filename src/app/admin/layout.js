"use client";

import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminNavbar from "@/components/admin/AdminNavbar";
import withAdminAuth from "@/components/admin/withAdminAuth";

function AdminLayout({ children }) {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="flex">
        <AdminSidebar />
        <div className="flex-1 min-h-screen">
          <AdminNavbar />
          <div className="p-6">{children}</div>
        </div>
      </div>
    </div>
  );
}

export default withAdminAuth(AdminLayout);
