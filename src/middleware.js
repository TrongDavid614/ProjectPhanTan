import { NextResponse } from "next/server";

const getRole = (request) => request.cookies.get("auth_role")?.value || "";
const getToken = (request) => request.cookies.get("auth_token")?.value || "";

export function middleware(request) {
  const { pathname } = request.nextUrl;
  const isAdminLogin = pathname === "/admin/login";
  const isAdminRegister = pathname === "/admin/register";
  const isProtectedAdminRoute =
    pathname.startsWith("/admin") && !isAdminLogin && !isAdminRegister;

  const token = getToken(request);
  const role = String(getRole(request)).toUpperCase();
  const isAdmin = token && role === "ADMIN";

  if ((isAdminLogin || isAdminRegister) && isAdmin) {
    return NextResponse.redirect(new URL("/admin/dashboard", request.url));
  }

  if (isProtectedAdminRoute && !isAdmin) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
