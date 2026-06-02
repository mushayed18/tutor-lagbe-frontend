"use client";

import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { useAuth } from "@/providers/AuthProvider";
import { Trophy, XCircle, Bell, Calendar, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface NotificationItemProps {
  notification: {
    id: string;
    title: string;
    message: string;
    type: string;
    tuitionId: string | null;
    createdAt: string;
    isRead?: boolean; // Built-in support for unread indicators
  };
}

export default function NotificationItem({
  notification,
}: NotificationItemProps) {
  const { user } = useAuth();

  const typeConfig: Record<
    string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    { icon: any; color: string; bg: string; border: string; label: string }
  > = {
    HIRED: {
      icon: Trophy,
      color: "text-emerald-600 dark:text-emerald-400",
      bg: "bg-emerald-50 dark:bg-emerald-950/40",
      border: "bg-emerald-500",
      label: "Success",
    },
    REJECTED: {
      icon: XCircle,
      color: "text-rose-600 dark:text-rose-400",
      bg: "bg-rose-50 dark:bg-rose-950/40",
      border: "bg-rose-500",
      label: "Update",
    },
    APPLY: {
      icon: Calendar,
      color: "text-blue-600 dark:text-blue-400",
      bg: "bg-blue-50 dark:bg-blue-950/40",
      border: "bg-blue-500",
      label: "Application",
    },
    DEFAULT: {
      icon: Bell,
      color: "text-slate-600 dark:text-slate-400",
      bg: "bg-slate-50 dark:bg-slate-800/40",
      border: "bg-slate-400",
      label: "System",
    },
  };

  const config = typeConfig[notification.type] || typeConfig.DEFAULT;
  const Icon = config.icon;

  const getRedirectUrl = () => {
    if (!notification.tuitionId) return null;
    return user?.role === "PARENT"
      ? `/parent/my-tuitions/${notification.tuitionId}`
      : `/tutor/feed/${notification.tuitionId}`;
  };

  const redirectUrl = getRedirectUrl();

  const content = (
    <div
      className={cn(
        "relative group flex items-start gap-3 p-4 md:gap-4 md:p-5 rounded-xl md:rounded-2xl border border-border bg-card transition-all duration-300",
        "hover:border-border-hover hover:shadow-md hover:shadow-slate-100/50 dark:hover:shadow-none overflow-hidden",
        !notification.isRead &&
          "bg-linear-to-r from-primary/5 via-transparent to-transparent",
      )}
    >
      {/* Interactive Status Left Border Accent */}
      <div
        className={cn(
          "absolute left-0 top-0 bottom-0 w-1 transition-all duration-300 group-hover:w-1.5",
          config.border,
        )}
      />

      {/* Modern Soft Square Icon Wrapper */}
      <div
        className={cn(
          "p-2.5 md:p-3 rounded-xl shrink-0 transition-transform duration-300 group-hover:scale-105",
          config.bg,
          config.color,
        )}
      >
        <Icon size={20} className="stroke-[2.25] md:size-5.5" />
      </div>

      {/* Main Text Content Column */}
      <div className="flex-1 min-w-0 space-y-1">
        {/* Responsive Header Wrapper */}
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between sm:gap-2">
          <div className="flex flex-wrap items-center gap-2">
            {/* Context Badge */}
            <span
              className={cn(
                "inline-flex items-center text-[9px] md:text-[10px] font-semibold tracking-wide uppercase px-2 py-0.5 rounded-md",
                config.bg,
                config.color,
              )}
            >
              {config.label}
            </span>

            {/* Mobile Timestamp (Shows inline on mobile, hidden on bigger viewports) */}
            <span className="text-[11px] font-medium text-text-muted sm:hidden">
              {formatDistanceToNow(new Date(notification.createdAt), {
                addSuffix: true,
              })}
            </span>
          </div>
        </div>

        <p className="text-xs md:text-sm text-text-muted leading-relaxed max-w-full sm:max-w-[95%] wrap-break-word">
          {notification.message}
        </p>
      </div>

      {/* 🌟 Desktop-Only Timestamp Badge (Hidden on mobile screen sizes) */}
      <span className="hidden sm:inline-block text-xs font-medium text-text-muted whitespace-nowrap bg-muted/40 px-2.5 py-1 rounded-full shrink-0 self-start">
        {formatDistanceToNow(new Date(notification.createdAt), {
          addSuffix: true,
        })}
      </span>

      {/* Animated Navigation Indicator */}
      {redirectUrl && (
        <div className="self-center ml-1 text-text-muted group-hover:text-primary transition-all duration-300 transform group-hover:translate-x-1 shrink-0">
          <ChevronRight size={18} className="stroke-[2.5] md:size-5" />
        </div>
      )}
    </div>
  );

  if (redirectUrl) {
    return (
      <Link
        href={redirectUrl}
        className="block mb-4 outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-2xl"
      >
        {content}
      </Link>
    );
  }

  return <div className="mb-4 opacity-90">{content}</div>;
}
