"use client";

import { AdminSingleUserDetail } from "@/types/admin";
import { Calendar, Phone, Mail, Crown, ZapOff } from "lucide-react";

interface AccountDetailsCardProps {
  user: AdminSingleUserDetail;
}

export default function AccountDetailsCard({ user }: AccountDetailsCardProps) {
  // Format standard dynamic date string
  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "N/A";
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
      {/* Section 1: Core Credentials Contact Information */}
      <div className="bg-background border border-border p-5 rounded-2xl shadow-sm space-y-4">
        <h3 className="text-sm font-black uppercase tracking-wider text-text-muted/80 mb-2">
          Contact & Core Metadata
        </h3>

        <div className="space-y-3.5">
          <div className="flex items-center gap-3 text-sm">
            <Mail size={16} className="text-text-muted shrink-0" />
            <div className="min-w-0">
              <p className="text-[11px] text-text-muted font-medium">
                Email Identifier
              </p>
              <p className="text-text-main font-semibold truncate mt-0.5">
                {user.email}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-sm">
            <Phone size={16} className="text-text-muted shrink-0" />
            <div className="min-w-0">
              <p className="text-[11px] text-text-muted font-medium">
                Phone Number
              </p>
              <p className="text-text-main font-semibold mt-0.5">
                {user.phone || (
                  <span className="text-text-muted font-normal italic">
                    Not Registered
                  </span>
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-sm">
            <Calendar size={16} className="text-text-muted shrink-0" />
            <div className="min-w-0">
              <p className="text-[11px] text-text-muted font-medium">
                Registration Date
              </p>
              <p className="text-text-main font-semibold mt-0.5">
                {formatDate(user.createdAt)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Section 2: Platform Commercial Rights & Subscriptions */}
      <div className="bg-background border border-border p-5 rounded-2xl shadow-sm space-y-4">
        <h3 className="text-sm font-black uppercase tracking-wider text-text-muted/80 mb-2">
          Subscription Ecosystem Status
        </h3>

        <div className="space-y-3.5">
          <div className="flex items-center gap-3 text-sm">
            {user.subscriptionType === "PREMIUM" ? (
              <Crown size={18} className="text-yellow-500 shrink-0" />
            ) : (
              <ZapOff size={18} className="text-text-muted shrink-0" />
            )}
            <div className="min-w-0">
              <p className="text-[11px] text-text-muted font-medium">
                Current Plan Tier
              </p>
              <p
                className={`font-black uppercase text-sm mt-0.5 ${
                  user.subscriptionType === "PREMIUM"
                    ? "text-yellow-500"
                    : "text-text-main"
                }`}
              >
                {user.subscriptionType} TIER
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-sm">
            <Calendar size={16} className="text-text-muted shrink-0" />
            <div className="min-w-0">
              <p className="text-[11px] text-text-muted font-medium">
                Subscription Expiry
              </p>
              <p className="text-text-main font-semibold mt-0.5">
                {user.subscriptionType === "PREMIUM" &&
                user.subscriptionExpiresAt ? (
                  formatDate(user.subscriptionExpiresAt)
                ) : (
                  <span className="text-text-muted font-normal text-xs">
                    No active plan deadlines
                  </span>
                )}
              </p>
            </div>
          </div>

          {/* Diagnostic Database ID String Row */}
          <div className="pt-2 border-t border-border/40 text-[10px] font-mono text-text-muted/70 truncate">
            UID: {user.id}
          </div>
        </div>
      </div>
    </div>
  );
}
