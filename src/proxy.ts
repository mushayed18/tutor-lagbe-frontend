import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

// 1. Defined Routes
const AUTH_ROUTES = [
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
  "/verify-email",
];

const DASHBOARD_PREFIXES = [
  { prefix: "/admin", role: "ADMIN", fallback: "/admin/users" },
  { prefix: "/tutor", role: "TUTOR", fallback: "/tutor/feed" },
  { prefix: "/parent", role: "PARENT", fallback: "/parent/feed" },
];

type UserRole = "ADMIN" | "TUTOR" | "PARENT";

// Encode secret key for standard Web Crypto APIs used by the Edge Runtime
const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

// Cryptographically verify and unpack the token signature
async function getVerifiedRoleFromToken(
  token: string,
): Promise<UserRole | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return (payload.role as UserRole) || null;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    // Throws if token is expired, fake, or tampered with
    return null;
  }
}

export default async function proxy(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const { pathname } = request.nextUrl;
  const pathWithQuery = `${pathname}${request.nextUrl.search}`;

  // Extract and verify data using our shared key
  const userRole = token ? await getVerifiedRoleFromToken(token) : null;

  // =========================================================================
  // RULE 1: Direct Logged-In Users away from Auth Pages (/login, /register)
  // =========================================================================
  if (AUTH_ROUTES.some((route) => pathname.startsWith(route))) {
    if (token && userRole) {
      const targetDashboard = DASHBOARD_PREFIXES.find(
        (d) => d.role === userRole,
      );
      if (targetDashboard) {
        return NextResponse.redirect(
          new URL(targetDashboard.fallback, request.url),
        );
      }
    }
    return NextResponse.next();
  }

  // =========================================================================
  // RULE 2: Protect Dashboard folders from cross-role boundary breaches
  // =========================================================================
  const matchedDashboard = DASHBOARD_PREFIXES.find((d) =>
    pathname.startsWith(d.prefix),
  );

  if (matchedDashboard) {
    // Case A: Token is invalid, missing, or verification failed completely
    if (!token || !userRole) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathWithQuery);

      const response = NextResponse.redirect(loginUrl);
      // Clean up corrupted or expired cookies from client storage
      if (token) response.cookies.delete("token");
      return response;
    }

    // Case B: Logged in, but trying to sneak into another user's dashboard segment
    if (userRole !== matchedDashboard.role) {
      const trueDashboard = DASHBOARD_PREFIXES.find((d) => d.role === userRole);
      if (trueDashboard) {
        return NextResponse.redirect(
          new URL(trueDashboard.fallback, request.url),
        );
      }
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // =========================================================================
  // RULE 3: Routing Fallback for raw Domain Root access "/"
  // =========================================================================
  if (pathname === "/" && token && userRole) {
    const trueDashboard = DASHBOARD_PREFIXES.find((d) => d.role === userRole);
    if (trueDashboard) {
      return NextResponse.redirect(
        new URL(trueDashboard.fallback, request.url),
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
