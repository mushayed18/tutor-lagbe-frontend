"use client";

import Image from "next/image";
import Link from "next/link";
import { User, Check, X, Loader2 } from "lucide-react";
import { Applicant } from "@/types/application";
import { cn } from "@/lib/utils";

interface ApplicationCardProps {
  applicant: Applicant;
  onStatusChange: (applicationId: string, status: "HIRED" | "REJECTED") => void;
  isActionLoading: boolean;
  someTutorIsHired: boolean;
}

export default function ApplicationCard({
  applicant,
  onStatusChange,
  isActionLoading,
  someTutorIsHired,
}: ApplicationCardProps) {
  // Profile url points to your parent-facing tutor page route structure
  const tutorProfileUrl = `/parent/tutor-profile/${applicant.tutorId}`;

  return (
    <div className="flex items-center justify-between py-4 bg-background border-b border-border shadow-sm transition-all hover:border-border/80 gap-4">
      {/* Left side: Avatar and Tutor info */}
      <div className="flex items-center gap-3 min-w-0">
        <Link
          href={tutorProfileUrl}
          className="relative shrink-0 select-none group"
        >
          <div className="w-12 h-12 rounded-full border-2 border-primary/10 overflow-hidden bg-surface-hover aspect-square relative transition-transform group-active:scale-95">
            {applicant.photo ? (
              <Image
                src={applicant.photo}
                alt={applicant.name}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-primary/5 text-primary">
                <User size={20} />
              </div>
            )}
          </div>
        </Link>

        <div className="min-w-0">
          <Link href={tutorProfileUrl}>
            <h4 className="font-bold text-sm text-text-main truncate hover:text-primary transition-colors">
              {applicant.name}
            </h4>
          </Link>
          <p className="text-[11px] text-text-muted mt-0.5">
            Applied to your job post
          </p>
        </div>
      </div>

      {/* Right side: Actions / Status badges */}
      <div className="shrink-0 flex items-center gap-2">
        {applicant.status === "PENDING" ? (
          // Render Action Control Triggers only if no tutor has been hired yet
          !someTutorIsHired ? (
            <div className="flex items-center gap-2">
              <button
                disabled={isActionLoading}
                onClick={() =>
                  onStatusChange(applicant.applicationId, "REJECTED")
                }
                className="cursor-pointer p-2 border border-border text-text-muted hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/20 rounded-xl transition-all disabled:opacity-50 active:scale-95"
                title="Reject Application"
              >
                <X size={16} />
              </button>
              <button
                disabled={isActionLoading}
                onClick={() => onStatusChange(applicant.applicationId, "HIRED")}
                className="cursor-pointer flex items-center gap-1.5 px-3.5 py-2 bg-primary/10 text-primary hover:bg-primary hover:text-white rounded-xl text-xs font-bold transition-all disabled:opacity-50 active:scale-95"
              >
                <Check size={14} /> Hire
              </button>
            </div>
          ) : (
            // If another applicant is selected, pending applications display as closed/expired
            <span className="text-xs font-medium text-text-muted bg-surface-hover px-2.5 py-1.5 rounded-lg border border-border/40">
              Closed
            </span>
          )
        ) : (
          // Highlighting fixed results states (HIRED or REJECTED)
          <span
            className={cn(
              "text-xs font-bold px-3 py-1.5 rounded-xl border tracking-wide uppercase text-[10px]",
              applicant.status === "HIRED"
                ? "bg-green-500/10 text-green-600 border-green-500/20"
                : "bg-red-500/10 text-red-500 border-red-500/20",
            )}
          >
            {applicant.status}
          </span>
        )}

        {/* Individual Row Network Locking Indicator */}
        {isActionLoading && (
          <div className="ml-1 text-primary animate-spin">
            <Loader2 size={16} />
          </div>
        )}
      </div>
    </div>
  );
}
