"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { AdminTuitionRecord } from "@/types/admin";
import {
  Trash2,
  BookOpen,
  MapPin,
  Layers,
  Calendar,
  User,
  MessageSquare,
  Clock,
  CalendarDays,
  FileText,
} from "lucide-react";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { fetcher } from "@/lib/api-client";
import { toast } from "sonner";

interface AdminTuitionCardProps {
  tuition: AdminTuitionRecord;
  onDeleted: (id: string) => void;
}

export default function AdminTuitionCard({
  tuition,
  onDeleted,
}: AdminTuitionCardProps) {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleExecuteDelete = async () => {
    try {
      setIsDeleting(true);
      const response = await fetcher(`/admin/tuitions/${tuition.id}`, {
        method: "DELETE",
      });
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to remove post.");
      }

      toast.success("Tuition requirement successfully scrubbed.");
      onDeleted(tuition.id);
      setIsModalOpen(false);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error.message || "An infrastructure error occurred.");
    } finally {
      setIsDeleting(false);
    }
  };

  const postDate = tuition.createdAt
    ? new Date(tuition.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "Recent";

  return (
    <>
      <div className="bg-background md:border md:border-border rounded-2xl p-2 md:p-6 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between gap-4">
        {/* SECTION 1: Parent User Meta Block */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push(`/admin/users/${tuition.parent?.id}`)}
              className="cursor-pointer relative w-12 h-12 rounded-full border border-border bg-surface-hover overflow-hidden transition-transform active:scale-95 group shrink-0"
              title={`Inspect ${tuition.parent?.name || "parent"}'s logs`}
            >
              {tuition.parent?.photo ? (
                <Image
                  src={tuition.parent.photo}
                  alt={tuition.parent.name || "Profile"}
                  fill
                  sizes="48px"
                  className="object-cover group-hover:scale-105 transition-transform"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-text-muted bg-muted">
                  <User size={20} />
                </div>
              )}
            </button>

            <div>
              <h3
                onClick={() =>
                  router.push(`/admin/users/${tuition.parent?.id}`)
                }
                className="font-black text-text-main text-sm hover:underline cursor-pointer tracking-tight"
              >
                {tuition.parent?.name || "Anonymous Parent"}
              </h3>
              <p className="text-xs text-text-muted">{tuition.parent?.email}</p>
              {tuition.parent?.phone && (
                <p className="text-[11px] text-text-muted/80 font-medium mt-0.5">
                  📞 {tuition.parent.phone}
                </p>
              )}
            </div>
          </div>

          <span className="text-[10px] text-text-muted flex items-center gap-1 bg-surface-hover border border-border/60 px-2.5 py-1 rounded-full font-bold uppercase tracking-wider">
            <Calendar size={11} /> {postDate}
          </span>
        </div>

        {/* SECTION 2: Headline Titles & Core Badge Matrix */}
        <div className="space-y-3">
          <h2 className="text-base font-black text-text-main tracking-tight leading-snug">
            {tuition.title}
          </h2>

          <div className="flex flex-wrap gap-1.5 text-[11px] font-bold">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-primary/10 text-primary rounded-lg border border-primary/10">
              <Layers size={12} />
              {tuition.classLevel}
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-500/10 text-emerald-600 rounded-lg border border-emerald-500/10">
              💵{" "}
              {tuition.salary > 0
                ? `${tuition.salary.toLocaleString()} BDT`
                : "Negotiable"}
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-500/10 text-amber-600 rounded-lg border border-amber-500/10">
              ⚡ Status: {tuition.status}
            </span>
          </div>

          {/* New Item: Render Description Content Area */}
          {tuition.description && (
            <div className="bg-surface-hover/40 border border-border/50 rounded-xl p-3.5 mt-2 flex gap-2">
              <FileText size={14} className="text-text-muted shrink-0 mt-0.5" />
              <p className="text-xs text-text-muted leading-relaxed line-clamp-3">
                {tuition.description}
              </p>
            </div>
          )}
        </div>

        {/* SECTION 3: Detailed Specifications Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2 border-t border-dashed border-border text-xs text-text-muted">
          <div className="flex items-start gap-2">
            <BookOpen size={14} className="text-primary shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block text-[10px] uppercase tracking-wider text-text-muted/80">
                Subjects
              </span>
              <span className="text-text-main font-semibold">
                {tuition.subject}
              </span>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <CalendarDays size={14} className="text-primary shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block text-[10px] uppercase tracking-wider text-text-muted/80">
                Schedule Density
              </span>
              <span className="text-text-main font-semibold">
                {tuition.daysPerWeek} Days / Week
              </span>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <Clock size={14} className="text-primary shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block text-[10px] uppercase tracking-wider text-text-muted/80">
                Preferred Window
              </span>
              <span className="text-text-main font-semibold">
                {tuition.timeSlot}
              </span>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <MapPin size={14} className="text-primary shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block text-[10px] uppercase tracking-wider text-text-muted/80">
                Geographic Bounds
              </span>
              <span
                className="text-text-main font-semibold truncate block max-w-50"
                title={tuition.location}
              >
                {tuition.location || "Not configured"}
              </span>
            </div>
          </div>
        </div>

        {/* SECTION 4: Footers Operational Indicators Layout */}
        <div className="border-t border-border/60 pt-3 flex items-center justify-between mt-1">
          <div className="flex items-center gap-1.5 text-primary bg-primary/5 px-3 py-1.5 rounded-xl border border-primary/10 text-xs font-bold">
            <MessageSquare size={13} />
            <span>{tuition._count?.applications || 0} Applicants Engaged</span>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="cursor-pointer p-2 rounded-xl text-text-muted hover:text-red-500 hover:bg-red-500/10 border border-transparent hover:border-red-500/10 transition-all active:scale-95"
            title="Purge Posting Record"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      <ConfirmModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleExecuteDelete}
        title="Purge Tuition Request"
        message="Are you absolutely sure you want to drop this requirement? This will erase all parental specifications and remove the job card completely from the system."
        isLoading={isDeleting}
      />
    </>
  );
}
