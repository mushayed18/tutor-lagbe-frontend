"use client"

import { NAV_LINKS } from "@/constants/navigation";
import NavItem from "./NavItem";

export default function BottomNav() {
  // FUTURE: Replace with dynamic Auth/JWT logic
  const userRole: "TUTOR" | "PARENT" | "ADMIN" = "TUTOR"; 

  // Filter only priority links for the mobile bar (max 5)
  const mobileLinks = NAV_LINKS[userRole].filter(link => link.priority).slice(0, 5);

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 border-t border-border bg-background/80 backdrop-blur-md z-50 px-4">
      <div className="flex items-center justify-around h-full">
        {mobileLinks.map((link) => (
          <NavItem 
            key={link.href}
            label={link.label}
            href={link.href}
            icon={link.icon}
            isMobile={true} // This triggers the mobile-specific styling we wrote earlier
          />
        ))}
      </div>
    </nav>
  );
}