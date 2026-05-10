"use client";

import { useState, useEffect } from "react";
import ImageUpload from "./ImageUpload";
import { createAdminEvent, updateAdminEvent } from "@/lib/api";

export default function EventForm({ initial = null, onSaved, onCancel }) {
  const [form, setForm] = useState({
    name: "",
    categoryId: "",
    description: "",
    img: "",
    startTime: "",
    endTime: "",
    saleStart: "",
    saleEnd: "",
    venueName: "",
    city: "",
    country: "",
    status: "draft",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (initial) setForm((f) => ({ ...f, ...initial }));
  }, [initial]);

  const handleChange = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const handleUploaded = (secureUrl) =>
    setForm((f) => ({ ...f, img: secureUrl }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      // Support both `eventId` (backend) and legacy `id` keys from initial
      const eventId = initial?.eventId || initial?.id;
      if (eventId) {
        const res = await updateAdminEvent(eventId, form);
        onSaved?.(res);
      } else {
        const res = await createAdminEvent(form);
        onSaved?.(res);
      }
    } catch (err) {
      setError(err?.response?.data?.message || err.message || "Lỗi lưu event");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-[#0b0b0b] p-6 rounded-lg shadow-sm"
    >
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm text-gray-300">Tên sự kiện</label>
          <input
            value={form.name}
            onChange={handleChange("name")}
            className="w-full mt-1 p-2 rounded bg-gray-900 text-white"
          />
        </div>
        <div>
          <label className="text-sm text-gray-300">Category ID</label>
          <input
            value={form.categoryId}
            onChange={handleChange("categoryId")}
            className="w-full mt-1 p-2 rounded bg-gray-900 text-white"
          />
        </div>

        <div className="col-span-2">
          <label className="text-sm text-gray-300">Description</label>
          <textarea
            value={form.description}
            onChange={handleChange("description")}
            rows={4}
            className="w-full mt-1 p-2 rounded bg-gray-900 text-white"
          />
        </div>

        <div>
          <label className="text-sm text-gray-300">Image</label>
          <div className="mt-1">
            <ImageUpload onUploaded={handleUploaded} />
            {form.img && (
              <img
                src={form.img}
                alt="preview"
                className="mt-2 rounded-md max-h-32 object-cover"
              />
            )}
          </div>
        </div>

        <div>
          <label className="text-sm text-gray-300">Status</label>
          <select
            value={form.status}
            onChange={handleChange("status")}
            className="w-full mt-1 p-2 rounded bg-gray-900 text-white"
          >
            <option value="draft">Draft</option>
            <option value="upcoming">Upcoming</option>
            <option value="selling">Selling</option>
            <option value="ended">Ended</option>
            <option value="cancelled">Cancelled</option>
            <option value="active">Active</option>
          </select>
        </div>

        <div>
          <label className="text-sm text-gray-300">Start Time</label>
          <input
            type="datetime-local"
            value={form.startTime}
            onChange={handleChange("startTime")}
            className="w-full mt-1 p-2 rounded bg-gray-900 text-white"
          />
        </div>
        <div>
          <label className="text-sm text-gray-300">End Time</label>
          <input
            type="datetime-local"
            value={form.endTime}
            onChange={handleChange("endTime")}
            className="w-full mt-1 p-2 rounded bg-gray-900 text-white"
          />
        </div>

        <div>
          <label className="text-sm text-gray-300">Sale Start</label>
          <input
            type="datetime-local"
            value={form.saleStart}
            onChange={handleChange("saleStart")}
            className="w-full mt-1 p-2 rounded bg-gray-900 text-white"
          />
        </div>
        <div>
          <label className="text-sm text-gray-300">Sale End</label>
          <input
            type="datetime-local"
            value={form.saleEnd}
            onChange={handleChange("saleEnd")}
            className="w-full mt-1 p-2 rounded bg-gray-900 text-white"
          />
        </div>

        <div>
          <label className="text-sm text-gray-300">Venue Name</label>
          <input
            value={form.venueName}
            onChange={handleChange("venueName")}
            className="w-full mt-1 p-2 rounded bg-gray-900 text-white"
          />
        </div>
        <div>
          <label className="text-sm text-gray-300">City</label>
          <input
            value={form.city}
            onChange={handleChange("city")}
            className="w-full mt-1 p-2 rounded bg-gray-900 text-white"
          />
        </div>

        <div>
          <label className="text-sm text-gray-300">Country</label>
          <input
            value={form.country}
            onChange={handleChange("country")}
            className="w-full mt-1 p-2 rounded bg-gray-900 text-white"
          />
        </div>
      </div>

      {error && <div className="text-red-400 mt-3">{error}</div>}

      <div className="mt-4 flex gap-3">
        <button
          type="submit"
          disabled={saving}
          className="px-4 py-2 bg-yellow-400 text-black rounded font-semibold"
        >
          {saving ? "Đang lưu..." : "Lưu"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-gray-800 text-white rounded"
        >
          Hủy
        </button>
      </div>
    </form>
  );
}
