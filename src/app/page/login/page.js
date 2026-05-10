"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LoginPageRedirect() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to user login page
    router.replace("/user/login");
  }, [router]);

  return null;
}
