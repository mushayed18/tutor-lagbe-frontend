"use client";

import Link from "next/link";
import { LogOut, Zap, ChevronRight, Crown } from "lucide-react";
import { useAuth } from "@/providers/AuthProvider";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface NavigationLinkItem {
  label: string;
  href: string;
  icon: LucideIcon;
  priority?: boolean;
}

interface MobileMenuDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  // Updated to accept subscriptionExpiresAt string/Date
  user: {
    name: string;
    email: string;
    subscriptionType?: "PREMIUM" | "FREE";
    subscriptionExpiresAt?: string | Date | null;
  } | null;
  allLinks: NavigationLinkItem[];
}

export default function MobileMenuDrawer({
  isOpen,
  onClose,
  user,
  allLinks,
}: MobileMenuDrawerProps) {
  const { logout } = useAuth();

  // Match the strict expiry check from RightPanel
  const isPremium =
    user?.subscriptionType === "PREMIUM" &&
    !!user.subscriptionExpiresAt &&
    new Date(user.subscriptionExpiresAt) > new Date();

  return (
    <>
      {/* Backdrop overlay */}
      <div
        className={cn(
          "md:hidden fixed inset-0 z-60 bg-black/50 backdrop-blur-[2px] transition-opacity duration-300",
          isOpen ? "opacity-100 visible" : "opacity-0 invisible",
        )}
        onClick={onClose}
      />

      {/* Drawer Panel Container */}
      <div
        className={cn(
          "md:hidden fixed bottom-12 left-0 right-0 z-65 bg-background border-t border-border rounded-t-4xl p-5 pb-8 shadow-2xl transition-transform duration-400 ease-out flex flex-col max-h-[90vh]",
          isOpen ? "translate-y-0" : "translate-y-full",
        )}
      >
        {/* Handle bar pill indicator for a native app aesthetic */}
        <div className="w-12 h-1 bg-border rounded-full mx-auto mb-5 shrink-0" />

        {/* 1. Header Segment: Premium Upgrade Alert Action Block */}
        <div className="mb-4 p-4 rounded-xl bg-surface border border-border/60 flex items-center justify-between gap-4 shrink-0">
          <div className="min-w-0">
            <p className="text-[10px] text-text-muted font-bold uppercase tracking-wider">
              Account Membership Status
            </p>
            {isPremium ? (
              <p className="text-sm font-black text-yellow-500 mt-0.5 flex items-center gap-1">
                <Crown size={14} className="fill-yellow-500/20" /> PREMIUM PLAN
              </p>
            ) : (
              <p className="text-sm font-black text-text-main mt-0.5">
                FREE BASIC PLAN
              </p>
            )}
          </div>

          {/* Turned into a functional Link navigating to your checkout panel */}
          {!isPremium && (
            <Link
              href="/subscription"
              onClick={onClose}
              className="bg-primary text-white text-xs px-3.5 py-2 rounded-xl font-bold flex items-center gap-1.5 shrink-0 active:scale-95 transition-transform shadow-sm"
            >
              <Zap size={13} fill="white" /> Upgrade
            </Link>
          )}
        </div>

        {/* 2. Scrollable Body Wrapper */}
        <div className="flex-1 overflow-y-auto no-scrollbar py-1 space-y-2 mb-4">
          <p className="text-[10px] text-text-muted font-bold uppercase tracking-wider px-1 mb-2">
            Navigation Menu
          </p>

          {allLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={onClose}
              className="flex items-center justify-between p-3.5 rounded-xl bg-surface/50 border border-border/40 active:bg-surface-hover transition-colors group"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="p-2 bg-background rounded-lg border border-border/40 text-primary group-active:text-primary">
                  <link.icon size={18} />
                </div>
                <span className="text-sm font-bold text-text-main truncate">
                  {link.label}
                </span>
              </div>
              <ChevronRight size={16} className="text-text-muted/60" />
            </Link>
          ))}
        </div>

        {/* 3. Action segment: Permanent Red Logout button */}
        <div className="pt-2 border-t border-border/60 shrink-0">
          <button
            onClick={() => {
              logout();
              onClose();
            }}
            className="w-full flex items-center justify-center gap-2 p-3.5 rounded-xl bg-red-500/10 text-red-500 text-sm font-bold active:scale-[0.98] transition-all hover:bg-red-500/15"
          >
            <LogOut size={18} /> Logout Account
          </button>
        </div>
      </div>
    </>
  );
}
