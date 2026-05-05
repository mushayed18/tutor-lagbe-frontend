"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { fetcher } from "@/lib/api-client";
import { useRouter } from "next/navigation";

// Matching your exact API response structure
export interface User {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  photo: string | null;
  location: string | null;
  role: "TUTOR" | "PARENT" | "ADMIN";
  subscriptionType: "FREE" | "PREMIUM";
  subscriptionRole: string | null;
  subscriptionExpiresAt: string | null;
  isVerified: boolean;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  refreshUser: () => Promise<void>; // Useful if they upgrade to Premium
  logout: () => Promise<void>; // Add this
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  refreshUser: async () => {},
  logout: async () => {}, // Add this
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const loadUser = async () => {
    try {
      const response = await fetcher("/user/me");
      const result = await response.json();
      if (result.success) {
        setUser(result.data);
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      //   console.error("Auth Error:", error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      const response = await fetcher("/auth/logout", { method: "POST" });
      const result = await response.json();

      if (result.success) {
        setUser(null); // Clear local state
        router.push("/login"); // Redirect to login
        router.refresh(); // Ensure middleware picks up the cleared cookie
      }
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, refreshUser: loadUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
