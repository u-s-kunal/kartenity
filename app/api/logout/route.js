import { NextResponse } from "next/server";
import { serialize } from "cookie";

export async function POST() {
  return new NextResponse(JSON.stringify({ success: true }), {
    status: 200,
    headers: {
      "Set-Cookie": serialize("auth", "", {
        path: "/",
        httpOnly: true,
        expires: new Date(0), // expire cookie
      }),
    },
  });
}
