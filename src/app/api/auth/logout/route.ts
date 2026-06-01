import { NextResponse } from "next/server";

export async function POST() {
  // Forward logout to Express backend
  await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`, {
    method: "POST",
  });

  // ✅ Delete cookie from FRONTEND domain
  const response = NextResponse.json({
    success: true,
    message: "Logged out successfully",
  });
  response.cookies.delete("token");
  return response;
}
