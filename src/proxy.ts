import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose"; // 🌟 Note: Keep jose here, standard jsonwebtoken crashes in Edge middleware runtimes!

const AUTH_ROUTES = [
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
  "/verify-email",
];

// Instructor's style Role Group map adapted to Tutor Lagbe requirements
const roleGroup: Record<string, string[]> = {
  ADMIN: ["/admin"],
  TUTOR: ["/tutor"],
  PARENT: ["/parent"],
};

// Fallback utility mapping roles to their primary landing feeds
function getDashboard(role: string | null): string {
  if (role === "ADMIN") return "/admin/users";
  if (role === "TUTOR") return "/tutor/feed";
  if (role === "PARENT") return "/parent/feed";
  return "/login";
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const pathWithQuery = `${pathname}${request.nextUrl.search}`;

  // Extract token from cookies container
  const token = request.cookies.get("token")?.value;

  let userRole: string | null = null;

  if (token) {
    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET);
      const { payload } = await jwtVerify(token, secret);
      userRole = (payload.role as string) || null;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      // Clean up broken tokens instantly on authorization validation failure
      const res = NextResponse.redirect(new URL("/login", request.url));
      res.cookies.delete("token");
      return res;
    }
  }

  // 1. Direct authenticated users away from authentication pages
  if (token && userRole && AUTH_ROUTES.includes(pathname)) {
    return NextResponse.redirect(new URL(getDashboard(userRole), request.url));
  }

  // 2. Strict protection check for raw domain root "/"
  if (pathname === "/") {
    if (token && userRole) {
      return NextResponse.redirect(
        new URL(getDashboard(userRole), request.url),
      );
    }
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // 3. Instructor's Dynamic Role-Based Access Control (RBAC) loop
  for (const role in roleGroup) {
    if (roleGroup[role].some((path) => pathname.startsWith(path))) {
      // If user has no valid token OR their active role does not match the dashboard group requirement
      if (!token || userRole !== role) {
        const targetDashboardRoute = getDashboard(userRole);

        // Prevent infinite redirection loops by verifying target mismatch
        if (pathname !== targetDashboardRoute) {
          const redirectUrl = userRole
            ? new URL(targetDashboardRoute, request.url)
            : new URL("/login", request.url);

          // Append return tracking query if redirecting an unauthenticated user to login
          if (!userRole) {
            redirectUrl.searchParams.set("redirect", pathWithQuery);
          }

          return NextResponse.redirect(redirectUrl);
        }
      }
    }
  }

  return NextResponse.next();
}

// Ensure the routing pattern intercepts all pages except asset pipelines
export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
