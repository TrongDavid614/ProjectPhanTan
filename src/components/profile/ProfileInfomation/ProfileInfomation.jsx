"use client";

import { useState, useEffect, useRef } from "react";
import styles from "./ProfileInfomation.module.css";
import ErrorPopup from "@/components/common/ErrorPopup/ErrorPopup";
import GoldButton from "@/components/common/Button/GoldButton";

const ProfileInfomation = () => {
  const [userLocal, setUserLocal] = useState(null);
  const [defaultData, setDefaultData] = useState({});
  const [formData, setFormData] = useState({});
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [avatarSrc, setAvatarSrc] = useState("");
  const [errorPopup, setErrorPopup] = useState({
    show: false,
    message: "",
    title: "",
  });
  const [uploading, setUploading] = useState(false);
  const [userId, setUserId] = useState(null);
  const fileInputRef = useRef(null);
  const firstNameRef = useRef(null);
  const lastNameRef = useRef(null);
  const phoneRef = useRef(null);
  const emailRef = useRef(null);

  useEffect(() => {
    const userRaw = localStorage.getItem("user");
    const user = userRaw ? JSON.parse(userRaw) : null;
    setUserLocal(user);
    setUserId(user?._id || null);

    if (user?.avatar) {
      setAvatarSrc(user.avatar);
    }
  }, []);

  // Fetch user detail khi có userLocal
  useEffect(() => {
    if (!userLocal?._id) return;

    // Backend API disabled - no server configured
    console.log("Fetching user detail:", userLocal._id);
    const userData = {
      firstName: userLocal.firstName || "",
      lastName: userLocal.lastName || "",
      phone: userLocal.phone || "",
      email: userLocal.email || "",
    };
    setDefaultData(userData);
    setFormData(userData);
  }, [userLocal]);

  function checkEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  function checkPhone(phone) {
    const phoneRegex = /^[0-9]{10}$/;
    return phoneRegex.test(phone);
  }

  function checkFullName(fullName) {
    const fullNameRegex = /^[A-Za-zÀ-ÖØ-ßğıĞñÑáéíóúÁÉÍÓÚüÜçÇĐđ ]{2,}$/;
    return fullNameRegex.test(fullName);
  }

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setAvatarSrc(URL.createObjectURL(file));

    try {
      setUploading(true);

      // Backend API disabled - no server configured
      console.log("Avatar upload attempted");
      const data = {
        url: URL.createObjectURL(file),
      };

      setAvatarSrc(data.url);

      const existingUser = JSON.parse(localStorage.getItem("user") || "{}");

      localStorage.setItem(
        "user",
        JSON.stringify({
          ...existingUser,
          avatar: data.url,
        }),
      );
      window.location.reload();

      /* Backend code - uncomment when backend is available:
            const form = new FormData();
            form.append("file", file);
            if (userId) {
                form.append("userId", userId);
            }

            const res = await fetch("/api/upload/avatar", {
                method: "POST",
                body: form
            });

            if (!res.ok) {
                throw new Error("Upload thất bại");
            }

            const data = await res.json();
            setAvatarSrc(data.url);

            const existingUser = JSON.parse(
                localStorage.getItem("user") || "{}"
            );

            localStorage.setItem(
                "user",
                JSON.stringify({
                    ...existingUser,
                    avatar: data.url
                })
            );
            window.location.reload();
            */
    } catch (err) {
      console.error("Upload avatar lỗi:", err);
      showError("Không thể upload ảnh. Vui lòng thử lại.", "Upload thất bại");
    } finally {
      setUploading(false);
    }
  };

  function showError(message, title = "Lỗi", success = false) {
    setErrorPopup({
      show: true,
      message,
      title,
      success,
    });
  }

  function closeError() {
    setErrorPopup({ show: false, message: "", title: "" });
  }

  function handleUpdate() {
    const finalData = {
      firstName: formData.firstName || defaultData.firstName,
      lastName: formData.lastName || defaultData.lastName,
      phone: formData.phone || defaultData.phone,
      email: formData.email || defaultData.email,
    };

    if (
      !firstNameRef.current.value &&
      !lastNameRef.current.value &&
      !phoneRef.current.value &&
      !emailRef.current.value
    ) {
      showError(
        "Vui lòng nhập thông tin cần sửa đổi",
        "Thông tin không hợp lệ",
      );
      return;
    }

    // Backend API disabled - no server configured
    console.log("Update user profile:", finalData);
    const raw = localStorage.getItem("user");

    if (raw) {
      const user = JSON.parse(raw);

      localStorage.setItem(
        "user",
        JSON.stringify({
          ...user,
          ...finalData,
        }),
      );
    }

    showError(
      "Thông tin đã được cập nhật (mock - backend disabled)",
      "Cập nhật thành công",
      true,
    );

    /* Backend code - uncomment when backend is available:
        fetch("/api/users/" + userLocal?._id, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(finalData)
        }).then((res) => {
            if (res.ok) {
                const raw = localStorage.getItem("user");
                if (raw) {
                    const user = JSON.parse(raw);
                    localStorage.setItem(
                        "user",
                        JSON.stringify({
                            ...user,
                            name:
                                finalData.firstName +
                                " " +
                                finalData.lastName,
                            phone: finalData.phone,
                            email: finalData.email,
                            avatar: avatarSrc
                        })
                    );
                }
                window.location.reload();
            } else {
                showError(
                    "Cập nhật thông tin thất bại. Vui lòng thử lại sau.",
                    "Cập nhật thất bại"
                );
            }
        });
        */
  }

  async function handleChangePassword() {
    if (
      !passwordData.currentPassword ||
      !passwordData.newPassword ||
      !passwordData.confirmPassword
    ) {
      showError("Vui lòng nhập đầy đủ thông tin");
      return;
    }

    if (passwordData.currentPassword === passwordData.newPassword) {
      showError("Mật khẩu mới phải khác mật khẩu cũ");
      return;
    }

    if (passwordData.newPassword.length < 8) {
      showError("Mật khẩu mới phải có ít nhất 8 ký tự");
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showError("Xác nhận mật khẩu không khớp");
      return;
    }

    try {
      // Backend API disabled - no server configured
      console.log("Change password attempted");
      showError(
        "Mật khẩu đã được thay đổi (mock - backend disabled)",
        "Thay đổi thành công",
        true,
      );

      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      /* Backend code - uncomment when backend is available:
            const res = await fetch(
                `/api/users/change-password/${userLocal?._id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        currentPassword: passwordData.currentPassword,
                        newPassword: passwordData.newPassword
                    })
                }
            );

            const data = await res.json();

            if (res.ok) {
                showError(
                    "Đổi mật khẩu thành công",
                    "Thành công"
                );

                setPasswordData({
                    currentPassword: "",
                    newPassword: "",
                    confirmPassword: ""
                });
            } else {
                showError(
                    data.message || "Đổi mật khẩu thất bại"
                );
            }
            */
    } catch (error) {
      showError("Không thể đổi mật khẩu. Vui lòng thử lại.");
    }
  }

  return (
    <div>
      <ErrorPopup
        message={errorPopup.show ? errorPopup.message : null}
        title={errorPopup.title}
        onClose={closeError}
      />
      <span className={styles.title}>Thông tin tài khoản</span>
      <div className={styles.profileContainer}>
        <div className={styles.avatarContainer}>
          <div className={styles.avatarWrapper}>
            <img className={styles.avatar} src={avatarSrc} alt="avatar" />
            <button
              className={styles.editAvatarBtn}
              onClick={() => fileInputRef.current.click()}
              title="Thay đổi ảnh đại diện"
              disabled={uploading}
            >
              {uploading ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{ animation: "spin 1s linear infinite" }}
                >
                  <circle cx="12" cy="12" r="10" opacity="0.25" />
                  <path d="M12 2a10 10 0 0 1 10 10" />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                  <circle cx="12" cy="13" r="4" />
                </svg>
              )}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={handleAvatarChange}
            />
          </div>
        </div>

        <div className={styles.formSection}>
          <div className={styles.formGroup}>
            <label>Họ</label>
            <input
              className={styles.input}
              ref={firstNameRef}
              type="text"
              placeholder="Nhập họ"
              value={formData.firstName || ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  firstName: e.target.value,
                })
              }
            />
          </div>

          <div className={styles.formGroup}>
            <label>Tên</label>
            <input
              className={styles.input}
              ref={lastNameRef}
              type="text"
              placeholder="Nhập tên"
              value={formData.lastName || ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  lastName: e.target.value,
                })
              }
            />
          </div>

          <div className={styles.formGroup}>
            <label>Số điện thoại</label>
            <input
              className={styles.input}
              ref={phoneRef}
              type="tel"
              placeholder="Nhập số điện thoại"
              value={formData.phone || ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  phone: e.target.value,
                })
              }
            />
          </div>

          <div className={styles.formGroup}>
            <label>Email</label>
            <input
              className={styles.input}
              ref={emailRef}
              type="email"
              placeholder="Nhập email"
              value={formData.email || ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  email: e.target.value,
                })
              }
            />
          </div>

          <div style={{ display: "flex", justifyContent: "center" }}>
            <GoldButton onClick={handleUpdate}>CẬP NHẬT THÔNG TIN</GoldButton>
          </div>
        </div>
      </div>

      <span className={styles.title}>Đổi mật khẩu</span>
      <div className={styles.profileContainer}>
        <div className={styles.formSection}>
          <div className={styles.formGroup}>
            <label>Mật khẩu hiện tại</label>
            <input
              className={styles.input}
              type="password"
              placeholder="Nhập mật khẩu hiện tại"
              value={passwordData.currentPassword}
              onChange={(e) =>
                setPasswordData({
                  ...passwordData,
                  currentPassword: e.target.value,
                })
              }
            />
          </div>

          <div className={styles.formGroup}>
            <label>Mật khẩu mới</label>
            <input
              className={styles.input}
              type="password"
              placeholder="Nhập mật khẩu mới"
              value={passwordData.newPassword}
              onChange={(e) =>
                setPasswordData({
                  ...passwordData,
                  newPassword: e.target.value,
                })
              }
            />
          </div>

          <div className={styles.formGroup}>
            <label>Xác nhận mật khẩu</label>
            <input
              className={styles.input}
              type="password"
              placeholder="Xác nhận mật khẩu mới"
              value={passwordData.confirmPassword}
              onChange={(e) =>
                setPasswordData({
                  ...passwordData,
                  confirmPassword: e.target.value,
                })
              }
            />
          </div>

          <div style={{ display: "flex", justifyContent: "center" }}>
            <GoldButton onClick={handleChangePassword}>ĐỔI MẬT KHẨU</GoldButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileInfomation;
