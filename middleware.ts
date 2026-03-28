// middleware.ts (root of project)
import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const adminPassword = process.env.ADMIN_PASSWORD ?? "savanna2024";
  const cookie        = req.cookies.get("admin_auth");

  // Allow if already authenticated
  if (cookie?.value === adminPassword) return NextResponse.next();

  // Allow the login page itself
  if (req.nextUrl.pathname === "/admin/login") return NextResponse.next();

  // Redirect to login for all other /admin routes
  return NextResponse.redirect(new URL("/admin/login", req.url));
}

export const config = {
  matcher: ["/admin/:path*"],
};