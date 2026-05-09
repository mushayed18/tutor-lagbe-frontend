"use client";

import { LucideIcon, Lock } from "lucide-react";

interface ProfileInfoCardProps {
  icon: LucideIcon;
  label: string;
  value: string | null | undefined;
  isLocked?: boolean;
}

export default function ProfileInfoCard({
  icon: Icon,
  label,
  value,
  isLocked = false,
}: ProfileInfoCardProps) {
  return (
    <div className="p-5 rounded-2xl border border-border bg-surface-main/50 space-y-2 hover:border-primary/30 transition-colors">
      <div className="flex items-center gap-2 text-text-muted">
        <Icon size={18} />
        <span className="text-[10px] font-bold uppercase tracking-widest">
          {label}
        </span>
      </div>
      <div className="flex items-center justify-between">
        {isLocked || !value ? (
          <div className="flex items-center gap-2 text-text-muted/60 italic text-sm">
            <Lock size={14} />
            <span>Information Private</span>
          </div>
        ) : (
          <p className="font-semibold text-text-main">{value}</p>
        )}
      </div>
    </div>
  );
}
