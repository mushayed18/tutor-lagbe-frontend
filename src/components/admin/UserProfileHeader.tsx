"use client";

import Image from "next/image";
import { AdminSingleUserDetail } from "@/types/admin";
import { cn } from "@/lib/utils";
import {
  ShieldCheck,
  ShieldAlert,
  CheckCircle,
  User,
  MapPin,
} from "lucide-react";

interface UserProfileHeaderProps {
  user: AdminSingleUserDetail;
}

export default function UserProfileHeader({ user }: UserProfileHeaderProps) {
  return (
    <div className="w-full bg-background border border-border p-6 rounded-2xl shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div className="flex items-center gap-4 min-w-0">
        {/* Dynamic Avatar Container */}
        <div className="w-16 h-16 rounded-full border border-border overflow-hidden bg-surface-hover shrink-0 relative select-none aspect-square">
          {user.photo ? (
            <Image
              src={user.photo}
              alt={user.name}
              fill
              className="object-cover"
              priority
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-primary/5 text-primary">
              <User size={28} />
            </div>
          )}
        </div>

        {/* User Identity & Info Block */}
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-xl font-black text-text-main tracking-tight truncate">
              {user.name}
            </h2>
            <span
              className={cn(
                "px-2.5 py-0.5 rounded-full font-bold border tracking-wide uppercase text-[9px]",
                user.role === "ADMIN" &&
                  "bg-purple-500/10 text-purple-500 border-purple-500/20",
                user.role === "PARENT" &&
                  "bg-blue-500/10 text-blue-500 border-blue-500/20",
                user.role === "TUTOR" &&
                  "bg-green-500/10 text-green-600 border-green-500/20",
              )}
            >
              {user.role}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-x-3 gap-y-1 mt-1.5 text-xs text-text-muted">
            <span className="truncate">{user.email}</span>
            {user.location && (
              <span className="flex items-center gap-1 text-[11px] text-text-muted/90 sm:border-l sm:border-border sm:pl-3">
                <MapPin size={12} className="text-primary/70 shrink-0" />{" "}
                {user.location}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Moderation Status Indicators Stack */}
      <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
        {user.isVerified && (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-green-500/10 text-green-600 border border-green-500/20 text-xs font-bold rounded-xl">
            <CheckCircle size={12} className="fill-green-600/5" /> Verified
          </span>
        )}

        {user.isBanned ? (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-red-500/10 text-red-500 border border-red-500/20 text-xs font-bold rounded-xl">
            <ShieldAlert size={12} /> Account Banned
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 text-xs font-bold rounded-xl">
            <ShieldCheck size={12} /> Status Active
          </span>
        )}
      </div>
    </div>
  );
}
