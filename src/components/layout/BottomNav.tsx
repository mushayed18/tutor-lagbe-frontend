"use client";

import { useState } from "react";
import { useAuth } from "@/providers/AuthProvider";
import { NAV_LINKS } from "@/constants/navigation";
import NavItem from "./NavItem";
import { Menu, X } from "lucide-react";
import MobileMenuDrawer from "./MobileMenuDrawer";
import { cn } from "@/lib/utils";

export default function BottomNav() {
  const { user, isLoading } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  if (isLoading) return null;

  const userRole = user?.role || "TUTOR";
  const allLinks = NAV_LINKS[userRole];

  // Logic: Take the top 4 priority links for the main bar
  const barLinks = allLinks.filter((l) => l.priority).slice(0, 4);

  return (
    <>
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 border-t border-border bg-background/90 backdrop-blur-md z-70 px-4">
        {/* Using grid-cols-5 ensures 5 perfectly equal columns */}
        <div className="grid grid-cols-5 h-full items-center justify-items-center">
          {barLinks.map((link) => (
            <NavItem
              key={link.href}
              label={link.label}
              href={link.href}
              icon={link.icon}
              isMobile={true}
              showLabel={false}
            />
          ))}

          {/* The 5th Slot: More Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="flex flex-col items-center justify-center w-full h-full transition-all active:scale-95 text-text-muted"
          >
            <div
              className={cn(
                "p-2 rounded-xl transition-colors",
                isMenuOpen ? "bg-primary/10 text-primary" : "bg-transparent",
              )}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </div>
          </button>
        </div>
      </nav>

      {/* Slide-up Drawer */}
      <MobileMenuDrawer
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        user={user}
        allLinks={allLinks}
      />
    </>
  );
}
