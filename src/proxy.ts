import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

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

// Cryptographically verify and unpack the token signature securely
async function getVerifiedRoleFromToken(
  token: string,
): Promise<UserRole | null> {
  try {
    const secretString = process.env.JWT_SECRET;
    if (!secretString) {
      console.error(
        "Middleware Error: JWT_SECRET environment variable is missing!",
      );
      return null;
    }

    const secret = new TextEncoder().encode(secretString);
    const { payload } = await jwtVerify(token, secret);
    return (payload.role as UserRole) || null;
  } catch (error) {
    console.error("Middleware Error: Failed to verify JWT token!", error);
    return null;
  }
}

export default async function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const { pathname } = request.nextUrl;
  const pathWithQuery = `${pathname}${request.nextUrl.search}`;

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
    if (!token || !userRole) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathWithQuery);
      const response = NextResponse.redirect(loginUrl);
      if (token) response.cookies.delete("token");
      return response;
    }

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
  // 🌟 RULE 3: Routing Fallback for Domain Root access "/"
  // =========================================================================
  if (pathname === "/") {
    // Scenario A: User is logged in -> Send them to their dashboard
    if (token && userRole) {
      const trueDashboard = DASHBOARD_PREFIXES.find((d) => d.role === userRole);
      if (trueDashboard) {
        return NextResponse.redirect(
          new URL(trueDashboard.fallback, request.url),
        );
      }
    }

    // Scenario B: User is NOT logged in or has no account -> Force to /login immediately
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
