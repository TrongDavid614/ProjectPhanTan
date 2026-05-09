"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function UserEntry() {
  const router = useRouter();

  useEffect(() => {
    // Redirect /user to the public root. This keeps one codebase
    // while exposing a /user entrypoint.
    router.replace("/");
  }, [router]);

  return null;
}
