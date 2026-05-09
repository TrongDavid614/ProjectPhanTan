"use client";

import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function AdminNavbar() {
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    router.replace("/admin/login");
  };

  const displayName = user?.name || user?.email || "Admin";

  return (
    <header className="w-full h-16 flex items-center justify-between px-6 bg-transparent">
      <div className="flex items-center gap-4">
        <Image
          src="/assets/images/logo.png"
          alt="8Threads"
          width={120}
          height={36}
        />
        <div className="text-sm text-gray-300">Admin Dashboard</div>
      </div>

      <div className="flex items-center gap-4">
        <div className="text-sm text-gray-300">Xin chào, {displayName}</div>
        <button
          onClick={handleLogout}
          className="ml-4 px-3 py-1 rounded bg-[#cbb37a] text-black text-sm font-medium"
        >
          Logout
        </button>
      </div>
    </header>
  );
}
