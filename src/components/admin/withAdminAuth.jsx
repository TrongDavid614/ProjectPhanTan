"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

const getRole = (user = {}) =>
  String(user?.role || user?.userRole || user?.type || "").toUpperCase();

export default function withAdminAuth(WrappedComponent) {
  return function AdminAuthGate(props) {
    const router = useRouter();
    const { user, loading } = useAuth();

    useEffect(() => {
      if (loading) return;

      const token = localStorage.getItem("token");
      const role = getRole(user);

      if (!token || role !== "ADMIN") {
        router.replace("/admin/login");
      }
    }, [loading, router, user]);

    if (loading) {
      return null;
    }

    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    const role = getRole(user);

    if (!token || role !== "ADMIN") {
      return null;
    }

    return <WrappedComponent {...props} />;
  };
}
