"use client";

import { useAuth } from "@/providers/AuthProvider";
import { NAV_LINKS } from "@/constants/navigation";
import NavItem from "./NavItem";

export default function BottomNav() {
  const { user, isLoading } = useAuth();

  // If we are still fetching the user, don't show the nav yet
  // to avoid showing the wrong links for a split second.
  if (isLoading) return null;

  // Use the real role from your API response, fallback to TUTOR if guest
  const userRole = user?.role || "TUTOR";

  // Filter only priority links for the mobile bar (max 5)
  const mobileLinks = NAV_LINKS[userRole]
    .filter((link) => link.priority)
    .slice(0, 5);

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 border-t border-border bg-background/80 backdrop-blur-md z-50 px-4">
      <div className="flex items-center justify-around h-full">
        {mobileLinks.map((link) => (
          <NavItem
            key={link.href}
            label={link.label}
            href={link.href}
            icon={link.icon}
            isMobile={true}
          />
        ))}
      </div>
    </nav>
  );
}
