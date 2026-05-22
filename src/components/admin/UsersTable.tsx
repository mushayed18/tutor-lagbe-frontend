"use client";

import { AdminUserRecord } from "@/types/admin";
import { cn } from "@/lib/utils";
import {
  ShieldCheck,
  ShieldAlert,
  CheckCircle,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";

interface UsersTableProps {
  users: AdminUserRecord[];
}

export default function UsersTable({ users }: UsersTableProps) {
  return (
    <div className="w-full bg-background md:border md:border-border md:rounded-2xl shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface/50 border-b border-border text-xs font-bold text-text-muted uppercase tracking-wider">
              <th className="p-4 select-none">User Info</th>
              <th className="p-4 select-none">Role</th>
              <th className="p-4 select-none">Verification</th>
              <th className="p-4 select-none">Status</th>
              <th className="p-4 text-right select-none">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60 text-sm font-medium text-text-main">
            {users.map((user) => (
              <tr
                key={user.id}
                className="hover:bg-surface-hover/30 transition-colors duration-150 group"
              >
                {/* 1. Name and Email */}
                <td className="p-4 max-w-xs">
                  <div className="truncate font-bold text-text-main">
                    {user.name}
                  </div>
                </td>

                {/* 2. Role Badges */}
                <td className="p-4">
                  <span
                    className={cn(
                      "px-2.5 py-1 rounded-full text-xs font-bold border tracking-wide uppercase text-[10px]",
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
                </td>

                {/* 3. Verification Tracking Flag */}
                <td className="p-4">
                  {user.isVerified ? (
                    <div className="flex items-center gap-1 text-green-600 text-xs font-semibold">
                      <CheckCircle size={14} className="fill-green-600/10" />{" "}
                      Verified
                    </div>
                  ) : (
                    <div className="text-text-muted text-xs font-normal">
                      Unverified
                    </div>
                  )}
                </td>

                {/* 4. Active/Banned Status Status Marker */}
                <td className="p-4">
                  {user.isBanned ? (
                    <div className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-red-500/10 text-red-500 text-xs font-bold border border-red-500/20">
                      <ShieldAlert size={12} /> Banned
                    </div>
                  ) : (
                    <div className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-emerald-500/10 text-emerald-600 text-xs font-bold border border-emerald-500/20">
                      <ShieldCheck size={12} /> Active
                    </div>
                  )}
                </td>

                {/* 5. Target View/Details Link Action Row Controller */}
                <td className="p-4 text-right">
                  <Link
                    href={`/admin/users/${user.id}`}
                    className="inline-flex items-center gap-1.5 px-3 py-2 bg-surface border border-border hover:bg-primary/5 hover:text-primary hover:border-primary/20 rounded-xl text-xs font-bold transition-all active:scale-95 group-hover:shadow-sm"
                  >
                    View Profile <ExternalLink size={12} />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
