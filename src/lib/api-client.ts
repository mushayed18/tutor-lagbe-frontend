import config from "@/config";

const NEXT_JS_ROUTES = ["/auth/login", "/auth/logout", "/auth/verify-email"];

export const fetcher = async (endpoint: string, options: RequestInit = {}) => {
  const isNextJsRoute = NEXT_JS_ROUTES.some((route) =>
    endpoint.startsWith(route),
  );
  const url = isNextJsRoute ? `/api${endpoint}` : `${config.apiUrl}${endpoint}`;

  const headers = new Headers(options.headers);

  if (options.body instanceof FormData) {
    headers.delete("Content-Type");
  } else if (options.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  // ✅ For Express backend calls, read cookie manually and send as Bearer token
  // This is needed because the cookie is on the frontend domain, not backend domain
  if (!isNextJsRoute) {
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="))
      ?.split("=")[1];

    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
  }

  const response = await fetch(url, {
    ...options,
    credentials: "include",
    headers: headers,
  });

  return response;
};
