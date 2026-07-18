"use client";

import { useAuth } from "@/providers/AuthProvider";
import { Crown, Zap } from "lucide-react";
import Link from "next/link";

export default function RightPanel() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <aside className="hidden lg:flex flex-col gap-6 w-80 h-screen sticky top-0 p-4 border-l border-border bg-background">
        {/* Status Card Skeleton */}
        <div className="p-4 rounded-2xl border border-border space-y-4">
          <div className="flex justify-between">
            <div className="h-3 w-20 bg-surface-hover animate-pulse rounded" />
            <div className="h-5 w-14 bg-surface-hover animate-pulse rounded-full" />
          </div>
          <div className="h-4 w-full bg-surface-hover animate-pulse rounded" />
        </div>

        {/* Premium CTA Skeleton */}
        <div className="p-6 rounded-2xl border border-border space-y-4">
          <div className="w-10 h-10 bg-surface-hover animate-pulse rounded-lg" />
          <div className="h-5 w-32 bg-surface-hover animate-pulse rounded" />
          <div className="space-y-2">
            <div className="h-3 w-full bg-surface-hover animate-pulse rounded" />
            <div className="h-3 w-2/3 bg-surface-hover animate-pulse rounded" />
          </div>
          <div className="h-10 w-full bg-surface-hover animate-pulse rounded-xl" />
        </div>
      </aside>
    );
  }

  const isTutor = user?.role === "TUTOR";
  const isParent = user?.role === "PARENT";

  // Match the same "is it actually still active" check used everywhere else in
  // the app (subscriptionType alone isn't enough — it can be stale past expiry).
  const isPremium =
    user?.subscriptionType === "PREMIUM" &&
    !!user.subscriptionExpiresAt &&
    new Date(user.subscriptionExpiresAt) > new Date();

  const statusMessage = isPremium
    ? isTutor
      ? "Unlimited job applications unlocked."
      : "Your posts are boosted to the top of the feed."
    : isTutor
      ? "Upgrade to apply to unlimited tuitions."
      : "Upgrade to boost your posts to the top.";

  const ctaTitle = isTutor ? "Apply Without Limits" : "Get Noticed First";
  const ctaDescription = isTutor
    ? "Free tutors are capped at 5 applications a day. Go Premium for unlimited applications."
    : "Premium job posts are boosted to the top of the tutor feed and get more applicants, faster.";

  return (
    <aside className="hidden lg:flex flex-col gap-6 w-80 h-screen sticky top-0 p-4 border-l border-border bg-background">
      {/* 1. Account Status Card */}
      {(isTutor || isParent) && (
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
          <p className="text-sm text-text-main">{statusMessage}</p>
        </div>
      )}

      {/* 2. Premium CTA (Only for Free Tutors/Parents) */}
      {!isPremium && (isTutor || isParent) && (
        <Link
          href="/subscription"
          className="block p-6 rounded-2xl bg-linear-to-br from-primary to-primary-hover text-white shadow-lg shadow-primary/20 hover:opacity-95 transition-opacity"
        >
          <Zap size={24} className="mb-4 fill-white" />
          <h3 className="text-lg font-bold">{ctaTitle}</h3>
          <p className="text-sm mb-4 opacity-90">{ctaDescription}</p>
          <span className="block w-full text-center py-2.5 bg-white text-primary font-bold rounded-xl shadow-md hover:bg-gray-50 transition-colors">
            Upgrade Now
          </span>
        </Link>
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
