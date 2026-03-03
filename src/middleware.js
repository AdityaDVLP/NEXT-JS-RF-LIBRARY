import { NextResponse } from "next/server";

export function middleware(request) {
  const isLoggedIn = request.cookies.get("admin-auth");

  if (!isLoggedIn && request.nextUrl.pathname.startsWith("/admin/dashboard")) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/dashboard"],
};