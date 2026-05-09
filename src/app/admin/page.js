"use client";

import { useEffect, useState } from "react";
import { getAdminDashboardStats } from "@/lib/api";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    events: 0,
    ticketsSold: 0,
    revenue: 0,
    orders: 0,
  });

  useEffect(() => {
    (async () => {
      try {
        const res = await getAdminDashboardStats();
        setStats(res || {});
      } catch (err) {
        // fallback: try to fetch totals separately or keep zeros
      }
    })();
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Dashboard</h2>

      <div className="grid grid-cols-4 gap-6">
        <div className="p-4 rounded-lg bg-[#0b0b0b] shadow-sm">
          <div className="text-sm text-gray-400">Tổng sự kiện</div>
          <div className="text-3xl font-semibold">{stats.events ?? 0}</div>
        </div>

        <div className="p-4 rounded-lg bg-[#0b0b0b] shadow-sm">
          <div className="text-sm text-gray-400">Tổng vé đã bán</div>
          <div className="text-3xl font-semibold">{stats.ticketsSold ?? 0}</div>
        </div>

        <div className="p-4 rounded-lg bg-[#0b0b0b] shadow-sm">
          <div className="text-sm text-gray-400">Doanh thu</div>
          <div className="text-3xl font-semibold">{stats.revenue ?? 0} VND</div>
        </div>

        <div className="p-4 rounded-lg bg-[#0b0b0b] shadow-sm">
          <div className="text-sm text-gray-400">Số đơn hàng</div>
          <div className="text-3xl font-semibold">{stats.orders ?? 0}</div>
        </div>
      </div>
    </div>
  );
}
