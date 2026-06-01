import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json();

  // Forward to Express backend
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const result = await res.json();

  if (!result.success) {
    return NextResponse.json(result, { status: 400 });
  }

  // ✅ Set cookie on FRONTEND domain (tutor-lagbe.onrender.com)
  // proxy.ts can now read this cookie perfectly
  const response = NextResponse.json(result);
  response.cookies.set("token", result.token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 7 * 24 * 60 * 60,
  });

  return response;
}
