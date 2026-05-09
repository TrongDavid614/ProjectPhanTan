"use client";

import { useState } from "react";

export default function ImageUpload({ onUploaded, uploadUrl, uploadPreset }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLoading(true);
    setError("");

    try {
      const form = new FormData();
      form.append("file", file);

      // Use backend public upload endpoint (preferred) or Cloudinary direct upload
      const url =
        uploadUrl ||
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"}/api/public/upload`;

      const headers = {};
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const res = await fetch(url, {
        method: "POST",
        body: form,
        credentials: "include",
        headers,
      });

      const text = await res.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch {
        throw new Error(`Invalid response: ${text.substring(0, 100)}`);
      }

      if (!res.ok) throw new Error(data?.message || "Upload failed");

      // Handle both Cloudinary response and backend response formats
      const imageUrl =
        data.data?.url ||
        data.url ||
        data.data?.secure_url ||
        data.secure_url ||
        "";
      if (!imageUrl) throw new Error("No image URL returned from upload");

      onUploaded?.(imageUrl);
    } catch (err) {
      setError(err?.message || "Upload error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <input type="file" accept="image/*" onChange={handleFile} />
      {loading && <div className="text-sm text-gray-300">Đang upload...</div>}
      {error && <div className="text-sm text-red-400">{error}</div>}
    </div>
  );
}
