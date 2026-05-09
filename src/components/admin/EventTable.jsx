"use client";

import { useEffect, useState } from "react";
import { deleteAdminEvent, getAdminEvents } from "@/lib/api";

export default function EventTable({ onEdit }) {
  const [events, setEvents] = useState([]);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const res = await getAdminEvents();
      setEvents(Array.isArray(res) ? res : []);
    } catch (err) {
      console.error(err);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Xác nhận xóa event này?")) return;
    try {
      await deleteAdminEvent(id);
      setEvents((prev) => prev.filter((e) => e.id !== id && e.eventId !== id));
    } catch (err) {
      alert("Xóa thất bại");
    }
  };

  const filtered = events.filter((ev) => {
    if (
      q &&
      !(ev.name || ev.title || "").toLowerCase().includes(q.toLowerCase())
    )
      return false;
    if (status && (ev.status || "").toLowerCase() !== status.toLowerCase())
      return false;
    return true;
  });

  return (
    <div className="bg-[#0b0b0b] p-4 rounded-lg">
      <div className="flex items-center gap-3 mb-4">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search event"
          className="p-2 rounded bg-gray-900 text-white"
        />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="p-2 rounded bg-gray-900 text-white"
        >
          <option value="">All</option>
          <option value="draft">Draft</option>
          <option value="upcoming">Upcoming</option>
          <option value="selling">Selling</option>
          <option value="ended">Ended</option>
          <option value="cancelled">Cancelled</option>
          <option value="active">Active</option>
        </select>
        <button
          onClick={fetchEvents}
          className="ml-auto px-3 py-2 bg-white/10 text-white rounded"
        >
          Refresh
        </button>
      </div>

      {loading ? (
        <div className="text-gray-300">Loading...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left table-auto">
            <thead>
              <tr className="text-sm text-gray-400">
                <th className="p-2">Name</th>
                <th className="p-2">City</th>
                <th className="p-2">Start</th>
                <th className="p-2">Status</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((ev) => (
                <tr
                  key={ev.id || ev.eventId}
                  className="border-t border-gray-800"
                >
                  <td className="p-2 py-4 text-white">{ev.name || ev.title}</td>
                  <td className="p-2">{ev.city || ev.venue?.city || ""}</td>
                  <td className="p-2">
                    {new Date(
                      ev.startTime || ev.start_time || ev.start || Date.now(),
                    ).toLocaleString()}
                  </td>
                  <td className="p-2">{ev.status || "-"}</td>
                  <td className="p-2">
                    <div className="flex gap-2">
                      <button
                        onClick={() => onEdit?.(ev)}
                        className="px-2 py-1 bg-yellow-400 text-black rounded"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(ev.id || ev.eventId)}
                        className="px-2 py-1 bg-red-600 text-white rounded"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
