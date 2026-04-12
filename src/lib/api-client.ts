import config from "@/config";

export const fetcher = async (endpoint: string, options: RequestInit = {}) => {
  const url = `${config.apiUrl}${endpoint}`;

  const defaultHeaders = {
    "Content-Type": "application/json",
  };

  const response = await fetch(url, {
    ...options,
    credentials: "include",
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  });

  return response;
};