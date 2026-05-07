"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItemProps {
  label: string;
  href: string;
  icon: LucideIcon;
  isMobile?: boolean;
  showLabel?: boolean; // New prop to control label visibility
}

export default function NavItem({ 
  label, 
  href, 
  icon: Icon, 
  isMobile, 
  showLabel = true // Defaults to true
}: NavItemProps) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 group",
        isActive 
          ? "text-primary bg-primary/10 font-semibold" 
          : "text-text-muted hover:bg-surface-hover hover:text-text-main",
        // Mobile specific container styles
        isMobile && "flex-col gap-1 px-2 py-1 justify-center rounded-none bg-transparent"
      )}
    >
      <div className="relative">
        <Icon size={isMobile ? 24 : 26} className={cn(
          "transition-colors",
          isActive ? "text-primary" : "text-text-muted group-hover:text-text-main"
        )} />
        
        {!isMobile && isActive && (
          <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-r-full" />
        )}
      </div>

      {/* Logic Update: Only show label if showLabel is true */}
      {showLabel && (
        <span className={cn(
          "text-lg", 
          isMobile ? "text-[10px] uppercase tracking-tighter" : "hidden xl:block"
        )}>
          {label}
        </span>
      )}
    </Link>
  );
}