"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import SelectSeatUI from "./SelectSeatUI";

const API_BASE = "/api/v1";

function normalizeEvent(event) {
  if (!event) return null;

  return {
    ...event,
    eventId: event.eventId || event.event_id || event.id,
    name: event.name || event.title || event.event_name || "",
    description: event.description || event.summary || "",
    img: event.img || event.image || event.poster || "/poster.jpg",
    venue: {
      name: event.venueName || event.venue_name || event.venue?.name || "",
      city: event.city || event.venue?.city || "",
    },
    startTime:
      event.startTime ||
      event.start_time ||
      event.time?.event?.start ||
      event.start ||
      null,
  };
}

function normalizeTicketType(ticketType) {
  if (!ticketType) return null;

  return {
    ...ticketType,
    ticketTypeId:
      ticketType.ticketTypeId ||
      ticketType.ticket_type_id ||
      ticketType.id ||
      ticketType._id,
    name: ticketType.name || ticketType.type || ticketType.ticketTypeName || "",
    type: ticketType.type || ticketType.name || "",
    price: Number(
      ticketType.price || ticketType.ticketPrice || ticketType.unitPrice || 0,
    ),
    totalQuantity: Number(
      ticketType.totalQuantity ||
        ticketType.total_quantity ||
        ticketType.quantity ||
        0,
    ),
    soldQuantity: Number(
      ticketType.soldQuantity || ticketType.sold_quantity || 0,
    ),
    isActive:
      ticketType.isActive ?? ticketType.is_active ?? ticketType.active ?? true,
  };
}

async function fetchFirstWorkingJson(urls) {
  let lastError = null;
  const failures = [];

  for (const url of urls) {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        const errorText = await response.text().catch(() => "");
        failures.push(`${url} -> ${response.status} ${errorText}`);
        continue;
      }

      return await response.json();
    } catch (error) {
      lastError = error;
      failures.push(`${url} -> ${String(error?.message || error)}`);
    }
  }

  if (lastError) {
    throw lastError;
  }

  throw new Error(
    failures.length > 0
      ? failures.join(" | ")
      : "Không thể tải dữ liệu từ backend",
  );
}

export default function SelectSeatSmartPage() {
  const { id } = useParams();
  const [ticketTypes, setTicketTypes] = useState(null);
  const [eventInfo, setEventInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const raw = localStorage.getItem("user");
    if (!raw) {
      window.location.href = "/user/login";
      return;
    }

    try {
      JSON.parse(raw);
    } catch {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      window.location.href = "/user/login";
    }
  }, []);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);

        const eventsPayload = await fetchFirstWorkingJson([
          `${API_BASE}/events`,
          `/api/events`,
        ]);

        const events = Array.isArray(eventsPayload?.data)
          ? eventsPayload.data
          : Array.isArray(eventsPayload)
            ? eventsPayload
            : [];

        const foundEvent = normalizeEvent(
          events.find((event) => {
            const normalizedId = event?.eventId || event?.event_id || event?.id;
            return normalizedId === id;
          }),
        );

        setEventInfo(foundEvent);

        const realEventId = foundEvent?.eventId || id;

        const embeddedTicketTypes = Array.isArray(foundEvent?.ticketTypes)
          ? foundEvent.ticketTypes
          : Array.isArray(foundEvent?.ticket_types)
            ? foundEvent.ticket_types
            : [];

        if (embeddedTicketTypes.length > 0) {
          setTicketTypes(
            embeddedTicketTypes.map(normalizeTicketType).filter(Boolean),
          );
          return;
        }

        const ticketPayload = await fetchFirstWorkingJson([
          `${API_BASE}/events/${encodeURIComponent(realEventId)}/ticket-types`,
        ]);

        const rawTicketTypes = Array.isArray(ticketPayload?.data)
          ? ticketPayload.data
          : Array.isArray(ticketPayload)
            ? ticketPayload
            : [];

        setTicketTypes(rawTicketTypes.map(normalizeTicketType).filter(Boolean));
      } catch (err) {
        console.error("Lỗi thông mạch dữ liệu:", err);
        setEventInfo(null);
        setTicketTypes([]);
      } finally {
        setLoading(false);
      }
    }

    if (id) fetchData();
  }, [id]);

  if (loading) {
    return (
      <div
        style={{
          color: "white",
          textAlign: "center",
          marginTop: "30vh",
          fontSize: "18px",
        }}
      >
        <p>Đang tải sơ đồ rạp...</p>
      </div>
    );
  }

  return (
    <SelectSeatUI
      ticketTypes={ticketTypes}
      eventInfo={eventInfo}
      eventId={eventInfo?.eventId || id}
    />
  );
}
