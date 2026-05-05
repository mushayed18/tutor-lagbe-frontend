"use client";

import { useAuth } from "@/providers/AuthProvider";
import { Crown, Zap } from "lucide-react";
import Link from "next/link";

export default function RightPanel() {
  const { user, isLoading } = useAuth();

  if (isLoading)
    return (
      <div className="w-80 h-screen border-l border-border animate-pulse" />
    );

  const isPremium = user?.subscriptionType === "PREMIUM";

  return (
    <aside className="hidden lg:flex flex-col gap-6 w-80 h-screen sticky top-0 p-4 border-l border-border bg-background">
      {/* 1. Account Status Card */}
      <div className="p-4 rounded-2xl bg-surface border border-border">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-text-muted font-medium">
            Account Status
          </span>
          {isPremium ? (
            <span className="text-xs font-bold text-yellow-500 bg-yellow-500/10 px-2 py-1 rounded-full flex items-center gap-1">
              <Crown size={12} /> PREMIUM
            </span>
          ) : (
            <span className="text-xs font-bold text-text-muted bg-surface-hover px-2 py-1 rounded-full">
              FREE
            </span>
          )}
        </div>
        <p className="text-sm text-text-main">
          {isPremium
            ? "Full access unlocked."
            : "Upgrade to apply to more tuitions."}
        </p>
      </div>

      {/* 2. Premium CTA (Only for Free Users) */}
      {!isPremium && (
        <div className="p-6 rounded-2xl bg-linear-to-br from-primary to-primary-hover text-white shadow-lg shadow-primary/20">
          <Zap size={24} className="mb-4 fill-white" />
          <h3 className="text-lg font-bold">Boost Your Profile</h3>
          <p className="text-sm mb-4 opacity-90">
            Premium tutors get 5x more responses from parents.
          </p>
          <button className="w-full py-2.5 bg-white text-primary font-bold rounded-xl shadow-md hover:bg-gray-50 transition-colors">
            Upgrade Now
          </button>
        </div>
      )}

      {/* 3. FOOTER LINKS (The missing part) */}
      <div className="mt-auto pb-4 px-2">
        <nav className="flex flex-wrap gap-x-4 gap-y-2">
          <Link
            href="/about"
            className="text-xs text-text-muted hover:underline"
          >
            About
          </Link>
          <Link
            href="/help"
            className="text-xs text-text-muted hover:underline"
          >
            Help Center
          </Link>
          <Link
            href="/terms"
            className="text-xs text-text-muted hover:underline"
          >
            Terms of Service
          </Link>
          <Link
            href="/privacy"
            className="text-xs text-text-muted hover:underline"
          >
            Privacy Policy
          </Link>
          <Link
            href="/cookies"
            className="text-xs text-text-muted hover:underline"
          >
            Cookie Policy
          </Link>
        </nav>
        <p className="text-xs text-text-muted mt-4">
          © {new Date().getFullYear()} Tutor Lagbe, Inc.
        </p>
      </div>
    </aside>
  );
}
