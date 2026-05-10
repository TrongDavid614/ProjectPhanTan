import axios from "axios";

const ADMIN_BASE =
  process.env.NEXT_PUBLIC_ADMIN_API ||
  `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"}/api/admin`;

const api = axios.create({
  baseURL: ADMIN_BASE,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

const unwrapResponse = (response) => response?.data?.data ?? response?.data;

const getCurrentOwnerIdentifier = () => {
  if (typeof window === "undefined") return "";

  try {
    const raw = window.localStorage.getItem("user");
    if (!raw) return "";

    const user = JSON.parse(raw);
    return user?.userId || user?.user_id || user?.id || user?.email || "";
  } catch {
    return "";
  }
};

export const getAdminDashboardStats = async () => {
  const owner = getCurrentOwnerIdentifier();
  const response = await api.get("/stats", {
    params: owner ? { owner } : undefined,
  });
  const data = unwrapResponse(response) || {};

  return {
    events: data.events ?? data.totalEvents ?? 0,
    ticketsSold: data.ticketsSold ?? data.totalTicketsSold ?? 0,
    revenue: data.revenue ?? data.totalRevenue ?? 0,
    orders: data.orders ?? data.totalOrders ?? 0,
  };
};

export const getAdminEvents = async () => {
  const owner = getCurrentOwnerIdentifier();
  const response = await api.get("/events", {
    params: owner ? { owner } : undefined,
  });
  return unwrapResponse(response);
};

export const getAdminEventById = async (eventId) => {
  const response = await api.get(`/events/${eventId}`);
  return unwrapResponse(response);
};

export const searchAdminEvents = async (keyword) => {
  const response = await api.get("/events/search", {
    params: { keyword },
  });
  return unwrapResponse(response);
};

export const filterAdminEventsByStatus = async (status) => {
  const response = await api.get("/events/status", {
    params: { status },
  });
  return unwrapResponse(response);
};

export const createAdminEvent = async (payload) => {
  const owner = getCurrentOwnerIdentifier();
  const response = await api.post("/events", payload, {
    params: owner ? { owner } : undefined,
  });
  return unwrapResponse(response);
};

export const updateAdminEvent = async (eventId, payload) => {
  const response = await api.put(`/events/${eventId}`, payload);
  return unwrapResponse(response);
};

export const deleteAdminEvent = async (eventId) => {
  const response = await api.delete(`/events/${eventId}`);
  return unwrapResponse(response);
};

export const getAdminOrders = async () => {
  const response = await api.get("/orders");
  return unwrapResponse(response);
};

export const getAdminOrderDetail = async (orderId) => {
  const response = await api.get(`/orders/${orderId}`);
  return unwrapResponse(response);
};

export const filterAdminOrdersByStatus = async (status) => {
  const response = await api.get("/orders/status", {
    params: { status },
  });
  return unwrapResponse(response);
};

export const updateAdminOrderStatus = async (orderId, payload) => {
  const response = await api.put(`/orders/${orderId}/status`, payload);
  return unwrapResponse(response);
};

export const createAdminTicketType = async (payload) => {
  const response = await api.post("/tickets", payload);
  return unwrapResponse(response);
};

export const updateAdminTicketType = async (ticketTypeId, payload) => {
  const response = await api.put(`/tickets/${ticketTypeId}`, payload);
  return unwrapResponse(response);
};

export const deleteAdminTicketType = async (ticketTypeId) => {
  const response = await api.delete(`/tickets/${ticketTypeId}`);
  return unwrapResponse(response);
};

export const getAdminTicketTypesByEvent = async (eventId) => {
  const response = await api.get(`/tickets/event/${eventId}`);
  return unwrapResponse(response);
};

export const createAdminVoucher = async (payload) => {
  const response = await api.post("/vouchers", payload);
  return unwrapResponse(response);
};

export const updateAdminVoucher = async (voucherId, payload) => {
  const response = await api.put(`/vouchers/${voucherId}`, payload);
  return unwrapResponse(response);
};

export const deleteAdminVoucher = async (voucherId) => {
  const response = await api.delete(`/vouchers/${voucherId}`);
  return unwrapResponse(response);
};

export const assignAdminVoucherToEvent = async (voucherId, payload) => {
  const response = await api.post(
    `/vouchers/${voucherId}/assign-event`,
    payload,
  );
  return unwrapResponse(response);
};

export default api;
