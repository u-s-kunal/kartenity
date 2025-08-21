// pages/api/login.js
import { NextResponse } from "next/server";

export async function POST(req) {
  const { username, password } = await req.json();

  if (
    username === `${process.env.ADMIN_USER}` &&
    password === `${process.env.ADMIN_PASS}`
  ) {
    const res = NextResponse.json({ success: true });
    res.cookies.set("auth", "my-secret-token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60, // 1 hour
    });
    return res;
  }

  return NextResponse.json({ success: false }, { status: 401 });
}
