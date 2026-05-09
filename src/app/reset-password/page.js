"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ResetPasswordRedirect() {
  const router = useRouter();

  useEffect(() => {
    const token =
      typeof window !== "undefined"
        ? new URLSearchParams(window.location.search).get("token")
        : null;

    const dest = token
      ? `/user/reset-password?token=${encodeURIComponent(token)}`
      : "/user/reset-password";
    // Use replace so back-button behavior is natural
    router.replace(dest);
  }, [router]);

  return null;
}
