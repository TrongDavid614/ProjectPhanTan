"use client";

import { useState, useEffect } from "react";
import styles from "./PaymentHistory.module.css";

const tabs = [
  { key: "all", label: "Tất cả" },
  { key: "paid", label: "Thành công" },
  { key: "pending", label: "Đang xử lý" },
  { key: "cancelled", label: "Đã hủy" },
];

export default function PaymentHistory() {
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const API_URL = "http://localhost:8080";

  useEffect(() => {
    async function fetchHistory() {
      try {
        const userRaw = localStorage.getItem("user");

        if (!userRaw) {
          setError("Bạn chưa đăng nhập");
          setLoading(false);
          return;
        }

        const user = JSON.parse(userRaw);
        const ownerId = user?.userId || user?.user_id || user?.id;
        if (!ownerId) {
          setError("Không tìm thấy thông tin người dùng.");
          setLoading(false);
          return;
        }

        // Fetch by ownerId first
        let res = await fetch(
          `${API_URL}/api/v1/orders/history/${encodeURIComponent(ownerId)}`,
        );
        let data = [];
        try {
          data = await res.json();
        } catch (e) {
          throw new Error("Không thể đọc dữ liệu từ server");
        }

        if (!res.ok) {
          throw new Error(data?.error || "Không thể tải lịch sử mua vé");
        }

        // Fallback: if history is empty and user has an email different
        // from ownerId, try by email (addresses dev/mock mismatch).
        if (
          Array.isArray(data) &&
          data.length === 0 &&
          user?.email &&
          user.email !== ownerId
        ) {
          try {
            const fbRes = await fetch(
              `${API_URL}/api/v1/orders/history/${encodeURIComponent(user.email)}`,
            );
            const fbData = await fbRes.json();
            if (fbRes.ok && Array.isArray(fbData) && fbData.length > 0) {
              data = fbData;
            }
          } catch (e) {
            // ignore fallback
          }
        }

        // Normalize items structure if needed
        const normalized = Array.isArray(data)
          ? data.map((o) => ({
              orderId: o.orderId,
              status: (o.status || "pending").toLowerCase(),
              createdAt: o.createdAt || o.created_at,
              event: o.event || {
                name: o.eventName || "Sự kiện",
                img: o.eventImg || null,
                venue: { name: o.venueName || "Địa điểm", city: "" },
              },
              items: Array.isArray(o.items)
                ? o.items
                : (o.orderItems || []).map((it) => ({
                    name: it.name || it.ticketTypeName || it.ticketType?.name,
                    quantity: it.quantity || it.qty || 1,
                    unitPrice: it.unitPrice || it.price || it.unit_price || 0,
                  })),
              paymentMethod:
                o.paymentMethod ||
                o.payment?.method ||
                o.paymentMethodName ||
                "VNPAY",
              originalTotal:
                o.originalTotal || o.totalAmount || o.total_amount || 0,
              discount: o.discount || 0,
              subtotal: o.subtotal || o.totalAmount || o.total_amount || 0,
            }))
          : [];

        setOrders(normalized);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchHistory();
  }, []);

  const filteredOrders = orders.filter((item) => {
    if (activeTab === "all") return true;
    return item.status === activeTab;
  });

  const formatMoney = (n) => Number(n || 0).toLocaleString("vi-VN") + "đ";

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

  const getStatusText = (status) => {
    if (status === "paid") return "Thành công";
    if (status === "pending") return "Đang xử lý";
    if (status === "cancelled") return "Đã hủy";
    return status;
  };

  const getStatusClass = (status) => {
    if (status === "paid") return styles.success;
    if (status === "pending") return styles.pending;
    if (status === "cancelled") return styles.cancelled;
    return "";
  };

  return (
    <div className={styles.wrapper}>
      <h1 className={styles.title}>Lịch sử mua vé</h1>

      <div className={styles.tabs}>
        {tabs.map((tab) => (
          <button
            key={tab.key}
            className={activeTab === tab.key ? styles.active : ""}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <p>Đang tải...</p>
      ) : error ? (
        <p>{error}</p>
      ) : filteredOrders.length === 0 ? (
        <p>Chưa có lịch sử mua vé</p>
      ) : (
        <div className={styles.list}>
          {filteredOrders.map((order) => (
            <div key={order.orderId} className={styles.card}>
              {/* Poster */}
              <img src={order.event?.img} alt="" className={styles.poster} />

              {/* Center */}
              <div className={styles.info}>
                <div className={styles.topRow}>
                  <h3>{order.event?.name}</h3>

                  <span
                    className={`${styles.status} ${getStatusClass(
                      order.status,
                    )}`}
                  >
                    {getStatusText(order.status)}
                  </span>
                </div>

                <div className={styles.metaRow}>
                  <span>
                    <img
                      src="/location-marker.svg"
                      alt=""
                      className={styles.icon}
                    />
                    {order.event?.venue?.name}, {order.event?.venue?.city}
                  </span>

                  <span>
                    <img src="/calendar.svg" alt="" className={styles.icon} />
                    {formatDate(order.createdAt)}
                  </span>
                </div>

                <div className={styles.ticketWrap}>
                  <div>
                    <strong>Vé:</strong>{" "}
                    {order.items.map((item, i) => (
                      <div key={i}>
                        {item.name} x{item.quantity}
                      </div>
                    ))}
                  </div>

                  <div>
                    <strong>Giá:</strong>{" "}
                    {order.items.map((item, i) => (
                      <div key={i}>{formatMoney(item.unitPrice)}</div>
                    ))}
                  </div>
                </div>

                <div className={styles.payment}>
                  <strong>Phương thức thanh toán:</strong>{" "}
                  {order.paymentMethod?.toUpperCase()}
                </div>
              </div>

              {/* Right */}
              <div className={styles.total}>
                <div>
                  <span>Tạm tính:</span>
                  <strong>{formatMoney(order.originalTotal)}</strong>
                </div>

                <div>
                  <span>Chiết khấu:</span>
                  <strong>- {formatMoney(order.discount)}</strong>
                </div>

                <div>
                  <span>Tổng cộng:</span>
                  <strong>{formatMoney(order.subtotal)}</strong>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
