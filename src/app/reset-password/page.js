"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function ResetPasswordRedirect() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Prefer next's search params but fallback to window if needed
    const token =
      (searchParams && searchParams.get && searchParams.get("token")) ||
      (typeof window !== "undefined" &&
        new URLSearchParams(window.location.search).get("token"));

    const dest = token
      ? `/page/reset-password?token=${encodeURIComponent(token)}`
      : "/page/reset-password";
    // Use replace so back-button behavior is natural
    router.replace(dest);
  }, [router, searchParams]);

  return null;
}
