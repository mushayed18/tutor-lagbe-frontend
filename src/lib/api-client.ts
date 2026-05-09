import config from "@/config";

export const fetcher = async (endpoint: string, options: RequestInit = {}) => {
  const url = `${config.apiUrl}${endpoint}`;

  // 1. Initialize headers from options (if any)
  const headers = new Headers(options.headers);

  // 2. Logic for Content-Type
  if (options.body instanceof FormData) {
    // If body is FormData, we MUST NOT set Content-Type manually.
    // The browser will automatically set it to multipart/form-data with the boundary.
    headers.delete("Content-Type");
  } else if (options.body && !headers.has("Content-Type")) {
    // If there is a body and it's NOT FormData, default to JSON
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(url, {
    ...options,
    credentials: "include",
    headers: headers, // 3. Pass the Headers object
  });

  return response;
};