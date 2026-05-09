"use client";

import Link from "next/link";
import { format } from "date-fns";
import {
  Clock,
  CheckCircle2,
  XCircle,
  Briefcase,
  CalendarDays,
  ArrowUpRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ApplicationItemProps {
  application: {
    id: string;
    tuitionId: string;
    tuitionTitle: string;
    status: string;
    createdAt: string;
  };
}

export default function ApplicationItem({ application }: ApplicationItemProps) {
  const statusConfig: Record<
    string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    { label: string; color: string; icon: any }
  > = {
    PENDING: {
      label: "Pending Review",
      color: "text-amber-600",
      icon: Clock,
    },
    ACCEPTED: {
      label: "Shortlisted",
      color: "text-blue-600",
      icon: CheckCircle2,
    },
    HIRED: {
      label: "Hired",
      color: "text-emerald-600",
      icon: Briefcase,
    },
    REJECTED: {
      label: "Rejected",
      color: "text-red-400",
      icon: XCircle,
    },
  };

  const config = statusConfig[application.status] || statusConfig.PENDING;
  const StatusIcon = config.icon;

  return (
    <Link href={`/tutor/feed/${application.tuitionId}`} className="block group">
      <div className="relative overflow-hidden bg-background border border-border rounded-2xl p-5 mb-4 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 hover:border-primary/30">
        {/* Subtle Accent Bar */}
        <div
          className={cn(
            "absolute left-0 top-0 bottom-0 w-1",
            config.color.replace("text", "bg"),
          )}
        />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2 flex-1">
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  "flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border",
                  config.color,
                  "border-current/10",
                )}
              >
                <StatusIcon size={12} />
                {config.label}
              </span>
            </div>

            <h3 className="text-lg font-bold text-text-main group-hover:text-primary transition-colors leading-snug">
              {application.tuitionTitle}
            </h3>

            <div className="flex items-center gap-4 text-sm text-text-muted">
              <div className="flex items-center gap-1.5">
                <CalendarDays size={14} />
                <span>
                  Applied{" "}
                  {format(new Date(application.createdAt), "MMM d, yyyy")}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between md:justify-end border-t md:border-t-0 pt-3 md:pt-0 border-border/50">
            <div className="md:hidden text-[10px] font-medium text-text-muted uppercase">
              Click to view details
            </div>
            <div className="h-10 w-10 rounded-full bg-surface-hover flex items-center justify-center text-text-muted group-hover:bg-primary group-hover:text-white transition-all duration-300">
              <ArrowUpRight size={20} />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
