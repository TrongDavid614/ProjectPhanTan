"use client";

import { useEffect, useState, use } from "react";
import ConcertDetail from "@/components/Card/ConCertDetail";

export default function ConcertDetailPage({ params }) {
  const { id } = use(params);

  const [data, setData] = useState(null);

  useEffect(() => {
    if (!id) return;

    // Backend API disabled - no server configured
    console.log("Fetching event details for id:", id);
    setData(null);

    /* Backend code - uncomment when backend is available:
    const fetchEvent = async () => {
      try {
        const res = await fetch(`/api/events/${id}`);
        const result = await res.json();
        setData(result);
      } catch (err) {
        console.error(err);
      }
    };

    fetchEvent();
    */
  }, [id]);

  return (
    <div style={{ padding: "20px" }}>
      <ConcertDetail data={data} />
    </div>
  );
}
