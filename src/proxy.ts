import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const AUTH_ROUTES = [
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
  "/verify-email",
];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Look purely for the existence of the token cookie string
  const hasToken = request.cookies.has("token");

  // CASE 1: User IS logged in (has token) -> Block them from hitting /login or /register
  if (hasToken && AUTH_ROUTES.includes(pathname)) {
    // Since we aren't decoding the role here, we redirect them safely away to a default landing,
    // or let Next.js handle the page destination. Let's send them to an empty/safe path,
    // or simply redirect them to a baseline layout.
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // CASE 2: User IS NOT logged in (no token)
  if (!hasToken) {
    // If they are trying to access an authentication page anyway, let them pass through smoothly
    if (AUTH_ROUTES.includes(pathname)) {
      return NextResponse.next();
    }

    // For ALL other routes (/, /admin/*, /parent/*, /tutor/*), intercept and send to login
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
