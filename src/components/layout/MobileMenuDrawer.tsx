/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Link from "next/link";
import { LogOut, Zap } from "lucide-react";
import { useAuth } from "@/providers/AuthProvider";
import { cn } from "@/lib/utils";

export default function MobileMenuDrawer({
  isOpen,
  onClose,
  user,
  allLinks,
}: any) {
  const { logout } = useAuth();
  const isPremium = user?.subscriptionType === "PREMIUM";

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          "md:hidden fixed inset-0 z-60 bg-black/40 backdrop-blur-[2px] transition-opacity duration-300",
          isOpen ? "opacity-100 visible" : "opacity-0 invisible",
        )}
        onClick={onClose}
      />

      {/* Drawer Panel */}
      <div
        className={cn(
          "md:hidden fixed bottom-0 left-0 right-0 z-65 bg-background border-t border-border rounded-t-4xl p-6 pb-24 shadow-2xl transition-transform duration-500 ease-out",
          isOpen ? "translate-y-0" : "translate-y-full",
        )}
      >
        {/* Handle bar for visual cue */}
        <div className="w-12 h-1.5 bg-border rounded-full mx-auto mb-6" />

        {/* Premium Status Card */}
        <div className="mb-6 p-4 rounded-2xl bg-surface border border-border flex items-center justify-between">
          <div>
            <p className="text-[10px] text-text-muted font-bold uppercase">
              Status
            </p>
            <p className="text-sm font-bold">
              {isPremium ? "PREMIUM" : "FREE PLAN"}
            </p>
          </div>
          {!isPremium && (
            <button className="bg-primary text-white text-xs px-4 py-2 rounded-xl font-bold flex items-center gap-2">
              <Zap size={14} fill="white" /> Upgrade
            </button>
          )}
        </div>

        {/* Full Link Grid */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {allLinks.map((link: any) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={onClose}
              className="flex items-center gap-3 p-4 rounded-2xl bg-surface border border-border/50 active:bg-surface-hover transition-colors"
            >
              <link.icon size={20} className="text-primary" />
              <span className="text-sm font-semibold">{link.label}</span>
            </Link>
          ))}
        </div>

        {/* Permanent Red Logout */}
        <button
          onClick={() => {
            logout();
            onClose();
          }}
          className="w-full flex items-center justify-center gap-2 p-4 rounded-2xl bg-red-500/10 text-red-500 font-bold active:scale-[0.98] transition-transform"
        >
          <LogOut size={20} /> Logout
        </button>
      </div>
    </>
  );
}
