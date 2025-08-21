// middleware.js
import { NextResponse } from "next/server";

export function middleware(req) {
  const token = req.cookies.get("auth"); // read cookie named "auth"

  // If no token and trying to access dashboard → redirect to login
  if (!token) {
    return NextResponse.redirect(new URL("/pages/login", req.url));
  }

  // If token exists → allow request
  return NextResponse.next();
}

// ✅ Apply middleware only to dashboard routes
export const config = {
  matcher: ["/pages/dashboard/:path*", "/pages/dashboard"],
};
