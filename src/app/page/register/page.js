"use client";

import { useState } from "react";
import styles from "../login/login.module.css";
import Button from "@/components/common/Button/GoldButton";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

const EyeIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);
const EyeOffIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
    <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
    <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
    <line x1="2" y1="2" x2="22" y2="22" />
  </svg>
);

export default function RegisterPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    // Client-side validation
    if (!formData.firstName.trim()) {
      setError("Vui lòng nhập tên.");
      return;
    }
    if (!formData.lastName.trim()) {
      setError("Vui lòng nhập họ.");
      return;
    }
    if (!formData.email.trim()) {
      setError("Vui lòng nhập email.");
      return;
    }
    if (!formData.password.trim()) {
      setError("Vui lòng nhập mật khẩu.");
      return;
    }
    if (formData.password.length < 6) {
      setError("Mật khẩu phải ít nhất 6 ký tự.");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Mật khẩu xác nhận không khớp!");
      return;
    }

    setLoading(true);

    try {
      const API_URL =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
      const res = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password,
        }),
      });

      let data = {};
      try {
        data = await res.json();
      } catch {
        data = { error: "Invalid response format" };
      }

      if (res.ok) {
        // Auto-login after registration
        const mockToken = "token_" + Date.now();
        login(mockToken, {
          id: formData.email,
          userId: formData.email,
          user_id: formData.email,
          email: formData.email,
          name: formData.firstName + " " + formData.lastName,
        });

        // Redirect to home
        router.replace("/");
      } else {
        setError(data?.error || "Đăng ký thất bại. Vui lòng thử lại.");
      }
    } catch (err) {
      setError("Lỗi kết nối. Vui lòng kiểm tra backend.");
      console.error("Register error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <img
        src="/FirstPage.png"
        alt="Stage Ready Background"
        className="absolute inset-0 w-full h-full object-cover z-0 opacity-40 pointer-events-none"
      />

      <div
        className="absolute inset-0 pointer-events-none spotlight-beam beam-2"
        style={{ zIndex: 1 }}
      />

      <div className="relative z-10 w-full flex justify-center">
        <div className={styles.loginCard}>
          <Link
            href="/"
            className="absolute top-6 left-6 text-gray-400 text-sm flex items-center gap-2 hover:text-white transition italic z-20"
          >
            ← Trở về
          </Link>

          <div className={styles.logoArea}>
            <img
              src="/assets/images/logo.png"
              alt="8THREADS"
              style={{ width: "100px" }}
            />
            <h2 className={styles.title}>REGISTER</h2>
          </div>

          <form onSubmit={handleRegister}>
            <div className={styles.inputGroup}>
              <input
                type="text"
                placeholder="First Name"
                value={formData.firstName}
                onChange={(e) =>
                  setFormData({ ...formData, firstName: e.target.value })
                }
                required
                disabled={loading}
              />
            </div>

            <div className={styles.inputGroup}>
              <input
                type="text"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={(e) =>
                  setFormData({ ...formData, lastName: e.target.value })
                }
                required
                disabled={loading}
              />
            </div>

            <div className={styles.inputGroup}>
              <input
                type="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
                disabled={loading}
              />
            </div>

            <div className={styles.inputGroup}>
              <input
                type={showPass ? "text" : "password"}
                placeholder="Password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                required
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className={styles.eyeButton}
                disabled={loading}
              >
                {showPass ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>

            <div className={styles.inputGroup}>
              <input
                type={showPass ? "text" : "password"}
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData({ ...formData, confirmPassword: e.target.value })
                }
                required
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className={styles.eyeButton}
                disabled={loading}
              >
                {showPass ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>

            {error && (
              <p
                style={{
                  color: "#ff6b6b",
                  fontSize: "12px",
                  marginBottom: "12px",
                }}
              >
                {error}
              </p>
            )}

            <Button
              size="lg"
              className="w-full font-bold tracking-widest uppercase mt-4"
              disabled={loading}
              style={{ opacity: loading ? 0.6 : 1 }}
            >
              {loading ? "ĐANG ĐĂNG KÝ..." : "REGISTER"}
            </Button>
          </form>

          <div className={styles.divider}>or</div>

          <div className={styles.socialIcons}>
            <span>FB</span>
            <span>GG</span>
            <span>X</span>
          </div>

          <p className="text-center mt-6 text-gray-400 text-[14px]">
            Already have an account?{" "}
            <Link
              href="/user/login"
              className="text-[#a0a0a0] hover:text-[#cbb37a] transition ml-1"
            >
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
