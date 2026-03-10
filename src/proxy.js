import { NextResponse } from "next/server";

export function proxy(request) {
  const pathname = request.nextUrl.pathname;

  // Admin logout — clear admin_token and redirect to admin login
  if (pathname === "/admin-dashboard/logout") {
    const loginUrl = new URL("/admin-dashboard/login", request.url);
    const response = NextResponse.redirect(loginUrl);
    response.cookies.delete("admin_token");
    return response;
  }

  // Admin dashboard protection — require admin_token except on login page
  if (pathname.startsWith("/admin-dashboard")) {
    const adminToken = request.cookies.get("admin_token")?.value;
    const isLoginPage = pathname === "/admin-dashboard/login";
    if (!adminToken && !isLoginPage) {
      const loginUrl = new URL("/admin-dashboard/login", request.url);
      loginUrl.searchParams.set("returnTo", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Legacy: user logout
  if (pathname === "/logout") {
    const loginUrl = new URL("/login", request.url);
    const response = NextResponse.redirect(loginUrl);
    response.cookies.delete("auth_token");
    return response;
  }

  // Legacy: /cp protection
  const token = request.cookies.get("auth_token")?.value;
  if (!token && pathname.startsWith("/cp")) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("returnTo", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin-dashboard/:path*", "/cp/:path*", "/logout"],
};
