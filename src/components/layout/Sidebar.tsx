"use client";

import { useAuth } from "@/providers/AuthProvider";
import { NAV_LINKS } from "@/constants/navigation";
import NavItem from "./NavItem";
import Image from "next/image";
import Button from "@/components/ui/Button"; // 1. Import your reusable button
import { LogOut } from "lucide-react"; // 2. Import the icon
import { useState } from "react"; // 3. For loading state

export default function Sidebar() {
  const { user, isLoading, logout } = useAuth(); // 4. Destructure logout
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  if (isLoading) {
    return (
      <aside className="hidden md:flex flex-col w-20 xl:w-64 h-screen sticky top-0 border-r border-border p-4 bg-background">
        {/* Logo Skeleton */}
        <div className="mb-10 px-4">
          <div className="h-8 w-32 bg-surface-hover animate-pulse rounded-lg hidden xl:block" />
        </div>

        {/* Nav Links Skeleton */}
        <nav className="flex flex-col gap-4 flex-1">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center gap-4 px-4">
              <div className="w-6 h-6 rounded-md bg-surface-hover animate-pulse" />
              <div className="h-4 w-24 bg-surface-hover animate-pulse rounded hidden xl:block" />
            </div>
          ))}
        </nav>

        {/* Profile Skeleton */}
        <div className="pt-4 border-t border-border flex items-center gap-3 px-2">
          <div className="w-10 h-10 rounded-full bg-surface-hover animate-pulse shrink-0" />
          <div className="hidden xl:block space-y-2">
            <div className="h-3 w-20 bg-surface-hover animate-pulse rounded" />
            <div className="h-2 w-28 bg-surface-hover animate-pulse rounded" />
          </div>
        </div>
      </aside>
    );
  }

  // 5. Create the handle function
  const handleLogout = async () => {
    setIsLoggingOut(true);
    await logout();
    setIsLoggingOut(false);
  };

  const userRole = user?.role || "TUTOR";
  const links = NAV_LINKS[userRole];

  return (
    <aside className="hidden md:flex flex-col w-20 xl:w-64 h-screen sticky top-0 border-r border-border p-4 bg-background">
      <div className="mb-10 px-4">
        <h1 className="text-2xl font-bold text-primary hidden xl:block tracking-tight">
          Tutor Lagbe
        </h1>
      </div>

      <nav className="flex flex-col gap-2 flex-1">
        {links.map((link) => (
          <NavItem
            key={link.href}
            label={link.label}
            href={link.href}
            icon={link.icon}
          />
        ))}
      </nav>

      {/* 6. ADD LOGOUT BUTTON HERE (Above the profile section) */}
      <div className="mb-4 px-2">
        <Button
          variant="outline"
          className="w-full justify-start gap-3 border-none hover:bg-red-500/10 hover:text-red-500 text-text-muted transition-colors"
          onClick={handleLogout}
          isLoading={isLoggingOut}
        >
          <LogOut size={20} />
          <span className="hidden xl:block font-medium">Logout</span>
        </Button>
      </div>

      <div className="pt-4 border-t border-border flex items-center gap-3 px-2">
        <div className="w-10 h-10 rounded-full bg-surface-hover border border-border shrink-0 overflow-hidden relative">
          {user?.photo ? (
            <Image
              src={user.photo}
              alt={user.name}
              fill // Use fill for better fitting in the rounded div
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-primary font-bold">
              {user?.name?.[0].toUpperCase()}
            </div>
          )}
        </div>
        <div className="hidden xl:block overflow-hidden">
          <p className="text-sm font-bold truncate">{user?.name}</p>
          <p className="text-xs text-text-muted truncate">{user?.email}</p>
        </div>
      </div>
    </aside>
  );
}
