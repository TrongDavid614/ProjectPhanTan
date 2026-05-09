"use client";

import { useState } from "react";
import Link from "next/link";
import styles from "./forgot-password.module.css";
import Navbar from "@/components/common/Navbar/Navbar";
import GoldButton from "@/components/common/Button/GoldButton";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    if (!email) {
      setError("Vui lòng nhập email");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        "/api/v1/auth/forgot-password?email=" + encodeURIComponent(email),
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Có lỗi xảy ra, vui lòng thử lại");
        return;
      }

      setSuccess(
        data.message || "Đã gửi link khôi phục mật khẩu vào email của bạn!",
      );
      setEmail("");
    } catch (err) {
      setError("Có lỗi xảy ra, vui lòng thử lại");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.pageShell}>
      <Navbar />
      <main className={styles.main}>
        <div className={styles.container}>
          <div className={styles.card}>
            <h1>Quên Mật Khẩu</h1>
            <p className={styles.subtitle}>
              Nhập email của bạn và chúng tôi sẽ gửi link khôi phục mật khẩu
            </p>

            {error && <div className={styles.errorMessage}>{error}</div>}
            {success && <div className={styles.successMessage}>{success}</div>}

            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.formGroup}>
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Nhập email của bạn"
                  disabled={loading}
                />
              </div>

              <GoldButton
                type="submit"
                disabled={loading}
                className={styles.submitBtn}
              >
                {loading ? "Đang xử lý..." : "Gửi Link Khôi Phục"}
              </GoldButton>
            </form>

            <div className={styles.footer}>
              <p>
                Quay lại <Link href="/user/login">đăng nhập</Link>
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
