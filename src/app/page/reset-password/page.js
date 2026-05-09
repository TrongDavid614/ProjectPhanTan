"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import styles from "./reset-password.module.css";
import Navbar from "@/components/common/Navbar/Navbar";
import GoldButton from "@/components/common/Button/GoldButton";
import { Eye, EyeOff } from "lucide-react";

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    if (!token) {
      setError("Link khôi phục không hợp lệ hoặc đã hết hạn");
    }
  }, [token]);

  const validatePassword = (pwd) => {
    if (pwd.length < 6) {
      return "Mật khẩu phải có ít nhất 6 ký tự";
    }
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validation
    if (!password || !confirmPassword) {
      setError("Vui lòng điền đầy đủ thông tin");
      return;
    }

    const passwordError = validatePassword(password);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    if (password !== confirmPassword) {
      setError("Mật khẩu không trùng khớp");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `/api/v1/auth/reset-password?token=${encodeURIComponent(token)}&newPassword=${encodeURIComponent(password)}`,
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

      setSuccess(data.message || "Đổi mật khẩu thành công!");
      setPassword("");
      setConfirmPassword("");

      // Redirect to login after 2 seconds
      setTimeout(() => {
        router.push("/page/login");
      }, 2000);
    } catch (err) {
      setError("Có lỗi xảy ra, vui lòng thử lại");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className={styles.pageShell}>
        <Navbar />
        <main className={styles.main}>
          <div className={styles.container}>
            <div className={styles.card}>
              <h1>Đặt Lại Mật Khẩu</h1>
              <div className={styles.errorMessage}>{error}</div>
              <div className={styles.footer}>
                <p>
                  Quay lại <Link href="/page/login">đăng nhập</Link>
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className={styles.pageShell}>
      <Navbar />
      <main className={styles.main}>
        <div className={styles.container}>
          <div className={styles.card}>
            <h1>Đặt Lại Mật Khẩu</h1>
            <p className={styles.subtitle}>
              Nhập mật khẩu mới cho tài khoản của bạn
            </p>

            {error && <div className={styles.errorMessage}>{error}</div>}
            {success && <div className={styles.successMessage}>{success}</div>}

            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.formGroup}>
                <label htmlFor="password">Mật Khẩu Mới</label>
                <div className={styles.passwordInput}>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Nhập mật khẩu mới"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    className={styles.toggleBtn}
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={loading}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="confirmPassword">Xác Nhận Mật Khẩu</label>
                <div className={styles.passwordInput}>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Xác nhận mật khẩu mới"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    className={styles.toggleBtn}
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    disabled={loading}
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </div>

              <GoldButton
                type="submit"
                disabled={loading}
                className={styles.submitBtn}
              >
                {loading ? "Đang xử lý..." : "Đặt Lại Mật Khẩu"}
              </GoldButton>
            </form>

            <div className={styles.footer}>
              <p>
                Quay lại <Link href="/page/login">đăng nhập</Link>
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
