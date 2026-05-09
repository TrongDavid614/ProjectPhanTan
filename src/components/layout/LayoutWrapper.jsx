"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/common/Navbar/Navbar";
import Footer from "@/components/common/Footer/Footer";

export default function LayoutWrapper({ children }) {
  const pathname = usePathname();

  // Treat undefined pathname as root to avoid flash-of-header during initial client render
  let p = pathname || "/";
  if (p.length > 1 && p.endsWith("/")) p = p.slice(0, -1);
  const normalized = p;

  const hideLayout =
    normalized === "/" ||
    normalized === "/highlight" ||
    normalized.startsWith("/admin") ||
    normalized === "/page/login" ||
    normalized === "/page/register" ||
    normalized === "/page/admin-register" ||
    normalized === "/user/login" ||
    normalized === "/user/register" ||
    normalized.startsWith("/artists");

  return (
    <>
      {!hideLayout && <Navbar />}
      {children}
      {!hideLayout && <Footer />}
    </>
  );
}
