// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "./lib/auth";

export const runtime = "nodejs";

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  const path = req.nextUrl.pathname;

  console.log("Middleware jalan →", { path, hasToken: !!token });

  const loginUrl = new URL("/login", req.url);
  const userDashboardUrl = new URL("/dashboard", req.url);
  const adminDashboardUrl = new URL("/admindashboard", req.url);

  // ===================================================
  // 1. Login / Register → redirect kalau udah login
  // ===================================================
  if (path === "/login" || path === "/register") {
    if (token) {
      const payload = await verifyToken(token);
      if (payload?.role) {
        return payload.role === "admin"
          ? NextResponse.redirect(adminDashboardUrl)
          : NextResponse.redirect(userDashboardUrl);
      }
      const res = NextResponse.redirect(loginUrl);
      res.cookies.delete("token");
      return res;
    }
    return NextResponse.next();
  }

  // ===================================================
  // 2. Protect USER routes → /dashboard
  // ===================================================
  if (path.startsWith("/dashboard")) {
    if (!token) return NextResponse.redirect(loginUrl);

    const payload = await verifyToken(token);
    if (!payload || payload.role !== "user") {
      if (payload?.role === "admin") return NextResponse.redirect(adminDashboardUrl);
      const res = NextResponse.redirect(loginUrl);
      res.cookies.delete("token");
      return res;
    }

    return NextResponse.next();
  }

  // ===================================================
  // 3. Protect ADMIN routes → /admin/* dan /admindashboard
  // ===================================================
  if (
    path.startsWith("/admin") ||
    path === "/admindashboard" ||
    path.startsWith("/admindashboard")
  ) {
    if (!token) return NextResponse.redirect(loginUrl);

    const payload = await verifyToken(token);
    if (!payload || payload.role !== "admin") {
      // Kalau user biasa nyasar → lempar ke dashboard user
      if (payload?.role === "user") return NextResponse.redirect(userDashboardUrl);

      // Role tidak valid → logout paksa
      const res = NextResponse.redirect(loginUrl);
      res.cookies.delete("token");
      return res;
    }

    return NextResponse.next();
  }

  // ===================================================
  // 4. Root / → redirect sesuai role
  // ===================================================
  if (path === "/") {
    if (token) {
      const payload = await verifyToken(token);
      if (payload?.role === "admin") return NextResponse.redirect(adminDashboardUrl);
      if (payload?.role === "user") return NextResponse.redirect(userDashboardUrl);
    }
    return NextResponse.next();
  }

  // ===================================================
  // Semua route lain → bebas
  // ===================================================
  return NextResponse.next();
}

// ===================================================
// Matcher — jalankan middleware di route penting
// ===================================================
export const config = {
  matcher: [
    "/",
    "/login",
    "/register",
    "/dashboard/:path*",
    "/admin/:path*",
    "/admindashboard",
    "/admindashboard/:path*",
  ],
};
