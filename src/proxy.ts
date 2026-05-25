// middleware.ts  ← place this at the ROOT of your project (same level as package.json)

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose"; // ✅ MUST use jose, NOT jsonwebtoken (Edge Runtime safe)

// ─────────────────────────────────────────────
// 1. CONFIGURATION CONSTANTS
// ─────────────────────────────────────────────

// Pages that a logged-in user should NOT be able to visit
const AUTH_ROUTES = [
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
  "/verify-email",
];

// Which URL prefixes belong to which role
const ROLE_ROUTES: Record<string, string[]> = {
  ADMIN: ["/admin"],
  TUTOR: ["/tutor"],
  PARENT: ["/parent"],
};

// After login, where does each role land?
function getDashboard(role: string | null): string {
  if (role === "ADMIN") return "/admin/dashboard";
  if (role === "TUTOR") return "/tutor/feed";
  if (role === "PARENT") return "/parent/feed";
  return "/login"; // unknown or null role → back to login
}

// ─────────────────────────────────────────────
// 2. TOKEN DECODER (Edge-safe)
// ─────────────────────────────────────────────

async function getRole(token: string): Promise<string | null> {
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    
    // ✅ TEMPORARY DEBUG — remove after fix
    console.log("JWT_SECRET exists:", !!process.env.JWT_SECRET);
    console.log("JWT_SECRET length:", process.env.JWT_SECRET?.length);
    console.log("Token exists:", !!token);
    console.log("Token prefix:", token?.substring(0, 20));
    
    const { payload } = await jwtVerify(token, secret);
    
    console.log("Decoded role:", payload.role); // ✅ does it reach here?
    
    return (payload.role as string) ?? null;
  } catch (error) {
    console.log("jwtVerify failed:", error); // ✅ what error?
    return null;
  }
}

// ─────────────────────────────────────────────
// 3. MAIN MIDDLEWARE FUNCTION
// ─────────────────────────────────────────────

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ── Step 1: Read & decode the token ──────────
  const token = request.cookies.get("token")?.value;
  let userRole: string | null = null;

  if (token) {
    userRole = await getRole(token);

    // Token exists but is broken/expired → wipe it and send to login
    if (!userRole) {
      const response = NextResponse.redirect(new URL("/login", request.url));
      response.cookies.delete("token");
      return response;
    }
  }

  // ── Step 2: Logged-in users must not see auth pages ──
  if (token && userRole && AUTH_ROUTES.includes(pathname)) {
    return NextResponse.redirect(new URL(getDashboard(userRole), request.url));
  }

  // ── Step 3: Redirect root "/" based on login state ──
  if (pathname === "/") {
    if (token && userRole) {
      return NextResponse.redirect(
        new URL(getDashboard(userRole), request.url),
      );
    }
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // ── Step 4: RBAC — protect every role-prefixed route ──
  for (const role in ROLE_ROUTES) {
    const belongsToThisRole = ROLE_ROUTES[role].some((path) =>
      pathname.startsWith(path),
    );

    if (belongsToThisRole) {
      // Case A: Not logged in at all → go to login, remember where they wanted to go
      if (!token || !userRole) {
        const loginUrl = new URL("/login", request.url);
        loginUrl.searchParams.set("redirect", pathname); // e.g. /login?redirect=/tutor/feed
        return NextResponse.redirect(loginUrl);
      }

      // Case B: Logged in but wrong role → go to their own dashboard
      if (userRole !== role) {
        return NextResponse.redirect(
          new URL(getDashboard(userRole), request.url),
        );
      }
    }
  }

  // ── Step 5: Everything passed, continue normally ──
  return NextResponse.next();
}

// ─────────────────────────────────────────────
// 4. MATCHER — which paths this middleware runs on
// ─────────────────────────────────────────────

export const config = {
  matcher: [
    // Run on every route EXCEPT Next.js internals and static files
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
