"use client"

import { Crown, Zap } from "lucide-react";
import { useState } from "react";

export default function RightPanel() {
  // FUTURE: This will come from your User context/JWT (subscriptionType)
  const [subscriptionType] = useState<"FREE" | "PREMIUM">("FREE");

  return (
    <aside className="hidden lg:flex flex-col gap-6 w-80 h-screen sticky top-0 p-4 border-l border-border bg-background">
      {/* 1. Subscription Status Card */}
      <div className="p-4 rounded-2xl bg-surface border border-border">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-text-muted">Status</span>
          {subscriptionType === "PREMIUM" ? (
            <span className="flex items-center gap-1 text-xs font-bold text-yellow-500 bg-yellow-500/10 px-2 py-1 rounded-full">
              <Crown size={12} /> PREMIUM
            </span>
          ) : (
            <span className="text-xs font-bold text-text-muted bg-surface-hover px-2 py-1 rounded-full">
              FREE
            </span>
          )}
        </div>
        <p className="text-sm font-medium">
          {subscriptionType === "PREMIUM"
            ? "Enjoying full access to all features!"
            : "Limited access to tuition posts."}
        </p>
      </div>

      {/* 2. Upgrade CTA Card (Important for Business) */}
      {subscriptionType === "FREE" && (
        <div className="p-6 rounded-2xl bg-linear-to-br from-primary to-primary-hover text-white shadow-lg shadow-primary/20">
          <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center mb-4">
            <Zap size={24} className="text-white fill-white" />
          </div>
          <h3 className="text-lg font-bold mb-1">Go Premium</h3>
          <p className="text-white/80 text-sm mb-4">
            Get priority application, direct contact with parents, and 5x more
            visibility.[cite: 1]
          </p>
          <button className="w-full py-2.5 bg-white text-primary font-bold rounded-xl hover:bg-white/90 transition-colors">
            Upgrade Now
          </button>
        </div>
      )}

      {/* 3. Simple Footer Links */}
      <div className="mt-auto px-4 pb-4">
        <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-text-muted">
          <a href="/about" className="hover:underline">
            About Us
          </a>
          <a href="/contact" className="hover:underline">
            Contact
          </a>
          <a href="/privacy" className="hover:underline">
            Privacy
          </a>
          <a href="/terms" className="hover:underline">
            Terms
          </a>
        </div>
        <p className="text-[10px] text-text-muted mt-4">
          © 2026 Tutor Lagbe. All rights reserved.
        </p>
      </div>
    </aside>
  );
}
