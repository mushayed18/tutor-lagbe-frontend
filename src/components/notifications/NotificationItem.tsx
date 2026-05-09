"use client";

import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import {
  Trophy,
  XCircle,
  Bell,
  Calendar,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NotificationItemProps {
  notification: {
    id: true;
    title: string;
    message: string;
    type: string;
    tuitionId: string | null;
    createdAt: string;
  };
}

export default function NotificationItem({
  notification,
}: NotificationItemProps) {
  // Map notification types to specific styles
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const typeConfig: Record<string, { icon: any; color: string; bg: string }> = {
    HIRED: { icon: Trophy, color: "text-emerald-600", bg: "bg-emerald-50" },
    REJECTED: { icon: XCircle, color: "text-red-600", bg: "bg-red-50" },
    APPLY: { icon: Calendar, color: "text-blue-600", bg: "bg-blue-50" },
    DEFAULT: { icon: Bell, color: "text-slate-600", bg: "bg-slate-50" },
  };

  const config = typeConfig[notification.type] || typeConfig.DEFAULT;
  const Icon = config.icon;

  // If there's a tuitionId, wrap in a Link, otherwise it's a static div
  const content = (
    <div className="relative group flex items-start gap-4 p-5 rounded-2xl border border-border bg-background transition-all duration-300 hover:border-primary/30 hover:shadow-sm">
      <div className={cn("p-3 rounded-xl shrink-0", config.bg, config.color)}>
        <Icon size={24} />
      </div>

      <div className="flex-1 space-y-1">
        <div className="flex items-center justify-between">
          <h4 className="font-bold text-text-main group-hover:text-primary transition-colors">
            {notification.title}
          </h4>
          <span className="text-[10px] font-medium text-text-muted whitespace-nowrap ml-2">
            {formatDistanceToNow(new Date(notification.createdAt), {
              addSuffix: true,
            })}
          </span>
        </div>
        <p className="text-sm text-text-muted leading-relaxed">
          {notification.message}
        </p>
      </div>

      {notification.tuitionId && (
        <div className="self-center ml-2 text-text-muted group-hover:text-primary transition-colors">
          <ChevronRight size={18} />
        </div>
      )}
    </div>
  );

  if (notification.tuitionId) {
    return (
      <Link
        href={`/tutor/feed/${notification.tuitionId}`}
        className="block mb-3"
      >
        {content}
      </Link>
    );
  }

  return <div className="mb-3 opacity-80">{content}</div>;
}
