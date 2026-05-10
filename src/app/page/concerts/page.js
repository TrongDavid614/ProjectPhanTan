"use client";

import { useEffect, useState } from "react";
import ConcertCard from "@/components/Card/ConcertCard";
import Navbar from "@/components/common/Navbar/Navbar";
import SearchBar from "@/components/common/SearchBar/SearchBar";
import FilterBar from "@/components/FilterBar/FilterBar";
import FilterTags from "@/components/FilterTags/FilterTags";

const API_BASE = "http://localhost:8080/api/user";

function normalizeTicketType(ticketType) {
  if (!ticketType) return null;

  return {
    ...ticketType,
    price: Number(
      ticketType.price || ticketType.ticketPrice || ticketType.unitPrice || 0,
    ),
  };
}

function getLowestTicketPrice(ticketTypes) {
  const prices = (ticketTypes || [])
    .map((ticketType) => normalizeTicketType(ticketType)?.price || 0)
    .filter((price) => Number.isFinite(price) && price > 0);

  if (prices.length === 0) {
    return null;
  }

  return Math.min(...prices);
}

async function fetchLowestTicketPrice(eventId) {
  try {
    const response = await fetch(
      `${API_BASE}/events/${encodeURIComponent(eventId)}/ticket-types`,
    );

    if (!response.ok) {
      return null;
    }

    const payload = await response.json();
    const ticketTypes = Array.isArray(payload?.data)
      ? payload.data
      : Array.isArray(payload)
        ? payload
        : [];

    return getLowestTicketPrice(ticketTypes);
  } catch {
    return null;
  }
}

export default function ConcertsPage() {
  const [events, setEvents] = useState([]);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
    fetch(`${API_BASE}/events`)
      .then((res) => res.json())
      .then(async (response) => {
        if (response.status === 200 && Array.isArray(response.data)) {
          const formattedEvents = await Promise.all(
            response.data.map(async (event) => {
              const eventId = event.eventId || event.event_id || event.id;
              const embeddedTicketTypes = Array.isArray(event.ticketTypes)
                ? event.ticketTypes
                : Array.isArray(event.ticket_types)
                  ? event.ticket_types
                  : [];

              const embeddedLowestPrice =
                getLowestTicketPrice(embeddedTicketTypes);
              const fetchedLowestPrice =
                embeddedLowestPrice ??
                (eventId ? await fetchLowestTicketPrice(eventId) : null);
              const fallbackMinPrice =
                Number(event.min_price || event.minPrice || 0) || null;

              return {
                ...event,
                _id: eventId,
                name: event.name || event.title || event.event_name,
                description: event.description || event.summary || "",
                img: event.img || event.image || event.poster || "/poster.jpg",
                minPrice: fetchedLowestPrice ?? fallbackMinPrice,
                venue: {
                  name:
                    event.venueName ||
                    event.venue_name ||
                    event.venue?.name ||
                    "",
                  city: event.city || event.venue?.city || "",
                },
                start_time:
                  event.startTime ||
                  event.start_time ||
                  event.time ||
                  event.start ||
                  null,
              };
            }),
          );

          setEvents(formattedEvents);
        }
      })
      .catch((err) => {
        console.error("Lỗi kết nối Backend:", err);
        setEvents([]);
      });
  }, []);
  const [filters, setFilters] = useState({
    city: "",
    price: "",
    genre: "",
  });
  const [searchText, setSearchText] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const parsePriceRange = (priceStr) => {
    if (!priceStr) return [0, Infinity];
    try {
      const parts = priceStr.split("-").map((p) => p.trim());
      if (parts.length === 1) {
        const n = Number(parts[0].replace(/[^0-9]/g, "")) || 0;
        return [n, n];
      }
      const a = Number(parts[0].replace(/[^0-9]/g, "")) || 0;
      const b = Number(parts[1].replace(/[^0-9]/g, "")) || Infinity;
      const multA = /k/i.test(parts[0]) ? 1000 : 1;
      const multB = /k/i.test(parts[1]) ? 1000 : 1;
      return [a * multA, b * multB];
    } catch (err) {
      return [0, Infinity];
    }
  };

  const [minPriceFilter, maxPriceFilter] = parsePriceRange(filters.price);

  const filteredEvents = events.filter((ev) => {
    if (searchText) {
      const hay = (searchText || "").toLowerCase();
      const title = (ev.name || ev.title || "").toString().toLowerCase();
      const desc = (ev.description || ev.summary || "")
        .toString()
        .toLowerCase();
      if (!title.includes(hay) && !desc.includes(hay)) return false;
    }
    if (filters.city) {
      const city = ev?.venue?.city || ev?.city || "";
      if (!city || !city.toLowerCase().includes(filters.city.toLowerCase())) {
        return false;
      }
    }

    if (filters.genre) {
      const genreVal = (ev.genre || ev.type || ev.categories || "").toString();
      if (
        genreVal &&
        !genreVal.toLowerCase().includes(filters.genre.toLowerCase())
      ) {
        return false;
      }
    }

    const price = Number(ev.minPrice) || 0;
    if (price < minPriceFilter || price > maxPriceFilter) return false;

    return true;
  });

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentEvents = filteredEvents.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  const totalPages = Math.ceil(filteredEvents.length / itemsPerPage);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filters.city, filters.price, filters.genre, searchText]);

  if (!hasMounted) {
    return null;
  }

  return (
    <div
      className="relative min-h-screen bg-cover bg-center"
      style={{ backgroundImage: "var(--background-image)" }}
    >
      <div className="relative z-10">
        <div className="max-w-[2000px] mx-auto pt-[calc(var(--navbar-height)*1.5)]">
          <div className="w-full px-30">
            <div className="flex items-center gap-8">
              <div className="flex-1">
                <SearchBar
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  onSearch={() => {}}
                />
              </div>
              <FilterBar filters={filters} setFilters={setFilters} />
            </div>

            <div className="mt-3">
              <FilterTags filters={filters} setFilters={setFilters} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mt-10">
              {currentEvents.map((event) => (
                <ConcertCard key={event._id} event={event} />
              ))}

              {events.length === 0 && (
                <p className="text-white text-center col-span-full drop-shadow-lg">
                  Không có concert nào
                </p>
              )}
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center mt-10 gap-2 flex-wrap">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  className="px-4 py-2 rounded bg-white/10 text-white hover:bg-white/20"
                >
                  ←
                </button>

                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`px-4 py-2 rounded transition ${
                      currentPage === i + 1
                        ? "bg-white text-black"
                        : "bg-white/10 text-white hover:bg-white/20"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}

                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  className="px-4 py-2 rounded bg-white/10 text-white hover:bg-white/20"
                >
                  →
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
