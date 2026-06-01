import config from "@/config";

// These routes are handled by Next.js route handlers (same domain)
// so the cookie gets set on the frontend domain where proxy.ts can read it
const NEXT_JS_ROUTES = ["/auth/login", "/auth/logout", "/auth/verify-email"];

export const fetcher = async (endpoint: string, options: RequestInit = {}) => {
  // ✅ Auth routes → Next.js route handler (same domain, cookie works)
  // Everything else → Express backend directly
  const isNextJsRoute = NEXT_JS_ROUTES.some((route) =>
    endpoint.startsWith(route),
  );
  const url = isNextJsRoute
    ? `/api${endpoint}` // e.g. /api/auth/login
    : `${config.apiUrl}${endpoint}`; // e.g. https://tutor-lagbe-backend.onrender.com/api/user/me

  const headers = new Headers(options.headers);

  if (options.body instanceof FormData) {
    headers.delete("Content-Type");
  } else if (options.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(url, {
    ...options,
    credentials: "include",
    headers: headers,
  });

  return response;
};
