"use client";

import { useState } from "react";
import EventTable from "@/components/admin/EventTable";
import EventForm from "@/components/admin/EventForm";

export default function AdminEventsPage() {
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState(null);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Event Management</h2>
        <div className="flex gap-3">
          <button
            onClick={() => {
              setEditItem(null);
              setShowForm(true);
            }}
            className="px-4 py-2 bg-yellow-400 text-black rounded"
          >
            Add Event
          </button>
        </div>
      </div>

      <EventTable
        onEdit={(ev) => {
          setEditItem(ev);
          setShowForm(true);
        }}
      />

      {showForm && (
        <div className="fixed inset-0 bg-black/60 flex items-start justify-center p-6 overflow-auto">
          <div className="w-full max-w-4xl max-h-[calc(100vh-120px)] overflow-auto">
            <EventForm
              initial={editItem}
              onSaved={() => {
                setShowForm(false);
                window.location.reload();
              }}
              onCancel={() => setShowForm(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
