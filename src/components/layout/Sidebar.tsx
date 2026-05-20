"use client";

import { useAuth } from "@/providers/AuthProvider";
import { NAV_LINKS } from "@/constants/navigation";
import NavItem from "./NavItem";
import Image from "next/image";
import Button from "@/components/ui/Button";
import { LogOut } from "lucide-react";
import { useState } from "react";
import SidebarSkeleton from "./SidebarSkeleton";

export default function Sidebar() {
  const { user, isLoading, logout } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  if (isLoading) {
    return <SidebarSkeleton />;
  }

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await logout();
    setIsLoggingOut(false);
  };

  const userRole = user?.role || "TUTOR";
  const links = NAV_LINKS[userRole];

  return (
    <aside className="hidden md:flex flex-col w-20 xl:w-64 h-screen sticky top-0 border-r border-border p-4 bg-background justify-between">
      {/* Top Section: Header & Nav links wrapper */}
      <div className="flex flex-col flex-1 min-h-0">
        <div className="mb-10 px-4 shrink-0">
          <h1 className="text-2xl font-bold text-primary hidden xl:block tracking-tight">
            Tutor Lagbe
          </h1>
        </div>

        {/* FIX 2: Added overflow-y-auto & custom scrollbar handling.
          The navigation block will now safely scroll if there are too many links,
          preventing your profile or logout buttons from gets clipped.
        */}
        <nav className="flex flex-col gap-2 flex-1 overflow-y-auto pr-1 no-scrollbar">
          {links.map((link) => (
            <NavItem
              key={link.href}
              label={link.label}
              href={link.href}
              icon={link.icon}
            />
          ))}
        </nav>
      </div>

      {/* Bottom Section: Action Controllers & User Profile Context Card */}
      <div className="shrink-0 pt-4 space-y-4">
        {/* FIX 1: Modified structural button composition classes.
          Switched layout properties to 'xl:px-4 py-3 justify-center xl:justify-start' 
          so it scales down into a clean, perfectly centered icon block on tablets/laptops.
        */}
        <div className="px-0 xl:px-2">
          <Button
            variant="outline"
            className="w-full flex items-center justify-center xl:justify-start gap-4 px-0 xl:px-4 py-3 rounded-full border border-border hover:bg-red-500/10 hover:text-red-500 text-text-muted transition-all duration-200 group active:scale-95"
            onClick={handleLogout}
            isLoading={isLoggingOut}
          >
            <div className="relative flex items-center justify-center shrink-0">
              <LogOut
                size={26}
                className="transition-colors group-hover:text-red-500"
              />
            </div>
            <span className="text-lg hidden xl:block font-medium">Logout</span>
          </Button>
        </div>

        <div className="pt-4 border-t border-border flex items-center justify-center xl:justify-start gap-3 px-2">
          <div className="w-10 h-10 rounded-full bg-surface-hover border border-border shrink-0 overflow-hidden relative">
            {user?.photo ? (
              <Image
                src={user.photo}
                alt={user.name}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-primary font-bold">
                {user?.name?.[0].toUpperCase()}
              </div>
            )}
          </div>
          <div className="hidden xl:block overflow-hidden">
            <p className="text-sm font-bold truncate text-text-main">
              {user?.name}
            </p>
            <p className="text-xs text-text-muted truncate">{user?.email}</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
