"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import ViewTicketPage from "../viewticket";

export default function Page() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);

  useEffect(() => {
    // Backend API disabled - no server configured
    console.log("Fetching event for viewticket:", id);
    setEvent(null);

    /* Backend code - uncomment when backend is available:
        fetch(`http://localhost:8080/api/user/events/${id}`)
        .then(res => res.json())
        .then(data => setEvent(data));
        */
  }, [id]);

  if (!event)
    return <div style={{ color: "white", padding: 50 }}>Đang tải...</div>;

  return <ViewTicketPage event={event} />;
}
