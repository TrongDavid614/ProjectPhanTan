"use client";

import React, { useState } from "react";
import Image from "next/image";
import styles from "./Navbar.module.css";
import { ChevronDown, Home, Sparkles, Ticket } from "lucide-react";
import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import ConfirmDialog from "@/components/common/ConfirmDialog/ConfirmDialog";

const Navbar = () => {
  const router = useRouter();
  const { user, isLoggedIn, logout, loading } = useAuth();

  const [isOpen, setIsOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  if (loading) return null;

  const menuItems = [
    {
      label: "Vé của tôi",
      icon: "/ticket.svg",
      path: "/my-ticket",
    },
    {
      label: "Tài khoản",
      icon: "/user.svg",
      path: "/infomation",
    },
    {
      label: "Đăng xuất",
      icon: "/logout.svg",
      action: "logout",
    },
  ];

  const handleAction = (item) => {
    if (item.action === "logout") {
      setShowLogoutConfirm(true);
      return;
    }

    if (item.path) {
      router.push(item.path);
    }

    setIsOpen(false);
  };

  const handleConfirmLogout = () => {
    setShowLogoutConfirm(false);
    logout();
    router.push("/user/login");
  };

  const handleCancelLogout = () => {
    setShowLogoutConfirm(false);
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>
        <Image
          src="/assets/images/logo.png"
          alt="8Threads Logo"
          width={120}
          height={40}
          priority
          style={{ width: "auto", height: "40px" }}
        />
      </div>

      <div className={styles.rightSide}>
        <div className={styles.menu}>
          <Link href="/" className={styles.link}>
            <Home size={20} />
            Trang chủ
          </Link>
          <Link href="/page/concerts" className={styles.link}>
            <Ticket size={20} />
            Mua vé
          </Link>
          <Link href="/page/ai" className={styles.link}>
            <Sparkles size={20} />
            AI tư vấn
          </Link>
        </div>

        <div className={styles.userSection}>
          {!isLoggedIn ? (
            <button
              className={styles.loginButton}
              onClick={() => router.push("/user/login")}
            >
              Đăng nhập
            </button>
          ) : (
            <>
              <button
                onClick={() => setIsOpen(!isOpen)}
                className={styles.userButton}
              >
                <div className={styles.avatar}>
                  <img src={user?.avatar || "/image 22.svg"} alt="User" />
                </div>
                <span className={styles.username}>{user?.name || "User"}</span>
                <ChevronDown
                  size={16}
                  className={`${styles.arrow} ${isOpen ? styles.rotate : ""}`}
                />
              </button>

              {isOpen && (
                <>
                  <div
                    className={styles.overlay}
                    onClick={() => setIsOpen(false)}
                  />

                  <div className={styles.dropdown}>
                    {menuItems.map((item, index) => (
                      <div
                        key={index}
                        className={styles.dropdownItem}
                        onClick={() => handleAction(item)}
                      >
                        <Image
                          src={item.icon}
                          alt={item.label}
                          width={25}
                          height={25}
                        />
                        <span>{item.label}</span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </div>

      <ConfirmDialog
        isOpen={showLogoutConfirm}
        title="Đăng xuất"
        message="Bạn có chắc chắn muốn đăng xuất không?"
        onConfirm={handleConfirmLogout}
        onCancel={handleCancelLogout}
        confirmText="Đăng xuất"
        cancelText="Hủy"
      />
    </nav>
  );
};

export default Navbar;
