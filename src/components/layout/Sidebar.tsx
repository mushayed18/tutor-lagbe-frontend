"use client"

import { NAV_LINKS } from "@/constants/navigation";
import NavItem from "./NavItem";

export default function Sidebar() {
  // FUTURE: We will get this from your Auth/JWT logic
  // For now, change this string to "PARENT" or "ADMIN" to see the menu change!
  const userRole: "TUTOR" | "PARENT" | "ADMIN" = "TUTOR"; 

  const links = NAV_LINKS[userRole];

  return (
    <aside className="hidden md:flex flex-col w-20 xl:w-64 h-screen sticky top-0 border-r border-border p-4 bg-background">
      {/* Brand Logo - Using your Vibrant Pink color */}
      <div className="mb-10 px-4">
        <h1 className="text-2xl font-bold text-primary hidden xl:block">
          Tutor Lagbe
        </h1>
        {/* Mobile/Tablet fallback logo */}
        <div className="xl:hidden w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-white font-bold">
          TL
        </div>
      </div>

      {/* Navigation Links - Mapping from your specific backend modules */}
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

      {/* Profile / Logout Section will be added here in a later step */}
      <div className="pt-4 border-t border-border">
         <p className="text-[10px] text-text-muted px-4 uppercase tracking-widest">
           Role: {userRole}
         </p>
      </div>
    </aside>
  );
}