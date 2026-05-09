"use client";

import Link from "next/link";
import { Home, CalendarDays, Tag, Ticket, FileText } from "lucide-react";

export default function AdminSidebar() {
  const items = [
    { label: "Dashboard", href: "/admin", icon: Home },
    { label: "Events", href: "/admin/events", icon: CalendarDays },
    { label: "Ticket Types", href: "/admin/tickets", icon: Ticket },
    { label: "Orders", href: "/admin/orders", icon: FileText },
    { label: "Vouchers", href: "/admin/vouchers", icon: Tag },
  ];

  return (
    <aside className="w-64 bg-[#0b0b0b] border-r border-gray-800 min-h-screen p-6">
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-white">8ThreadsEvent</h3>
        <div className="text-sm text-gray-400">Quản lý sự kiện</div>
      </div>

      <nav className="flex flex-col gap-2">
        {items.map((it) => {
          const Icon = it.icon;
          return (
            <Link
              key={it.href}
              href={it.href}
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-200 hover:bg-white/5"
            >
              <Icon size={18} />
              <span>{it.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
