"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { fetcher } from "@/lib/api-client";
import { TuitionDetails } from "@/types/tuition";
import {
  MapPin,
  Clock,
  Calendar,
  ChevronLeft,
  Users,
  Briefcase,
  Info,
  Crown,
  DollarSign,
  BookOpen,
  Edit2,
  Trash2,
} from "lucide-react";
import { format } from "date-fns";
import DetailsSkeleton from "@/components/tuition/TuitionDetailsSkeleton";
import { ConfirmModal } from "@/components/ui/ConfirmModal"; // Integrated your shared modal component
import Link from "next/link";
import { toast } from "sonner";
import { LucideIcon } from "lucide-react";

export default function ParentMyTuitionDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [data, setData] = useState<TuitionDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  useEffect(() => {
    const getDetails = async () => {
      try {
        const res = await fetcher(`/tuitions/${id}`);
        const result = await res.json();
        if (result.success) {
          setData(result.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    getDetails();
  }, [id]);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const res = await fetcher(`/tuitions/${id}`, {
        method: "DELETE",
      });
      const result = await res.json();

      if (result.success) {
        toast.success("Tuition post permanently removed successfully.");
        router.push("/parent/my-tuitions");
        router.refresh();
      } else {
        toast.error(result.message || "Failed to remove post.");
      }
    } catch (err) {
      console.error("Error executing parent deletion protocol:", err);
      toast.error("An error occurred while deleting this post.");
    } finally {
      setIsDeleting(false);
      setIsDeleteModalOpen(false);
    }
  };

  if (isLoading) return <DetailsSkeleton />;
  if (!data)
    return (
      <div className="p-10 text-center font-medium text-text-muted">
        Tuition not found.
      </div>
    );

  const isClosed = data.status === "CLOSED";

  return (
    <div className="max-w-3xl mx-auto py-6 px-4 pb-24">
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="flex cursor-pointer items-center gap-2 text-text-muted hover:text-primary mb-6 transition-colors font-semibold text-sm"
      >
        <ChevronLeft size={20} /> Back
      </button>

      {/* Header Section */}
      <div className="bg-background border border-border rounded-2xl p-6 mb-6 shadow-sm">
        <div className="flex justify-between items-start gap-4 mb-4">
          <h1 className="text-2xl font-black text-text-main leading-tight">
            {data.title}
          </h1>
          {data.parent.subscriptionType === "PREMIUM" && (
            <span className="bg-yellow-500/10 text-yellow-600 text-[10px] font-black px-2 py-1 rounded flex items-center gap-1 shrink-0">
              <Crown size={12} className="fill-yellow-500 text-yellow-500" />{" "}
              FEATURED
            </span>
          )}
        </div>

        <div className="flex flex-wrap gap-4 text-sm text-text-muted items-center">
          <div className="flex items-center gap-1.5">
            <Users size={16} className="text-primary" />
            <span className="font-semibold text-text-main">
              {data.applicationsCount} Applications
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <Briefcase size={16} className="text-primary" />
            <span className="font-semibold text-text-main capitalize">
              {data.status}
            </span>
          </div>
          <div className="text-text-muted text-xs">
            Posted on {format(new Date(data.createdAt), "PPP")}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 mb-6">
        <div className="space-y-6">
          {/* Job Description Card */}
          <section className="bg-background border border-border rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-bold text-text-main mb-4 flex items-center gap-2">
              <Info size={20} className="text-primary" /> Job Description
            </h2>
            <p className="text-text-muted whitespace-pre-wrap leading-relaxed text-sm">
              {data.description}
            </p>
          </section>

          {/* Requirements Box Card Group */}
          <section className="bg-background border border-border rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-bold text-text-main mb-4">
              Requirements
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InfoBox label="Subject" value={data.subject} icon={BookOpen} />
              <InfoBox label="Class" value={data.classLevel} icon={Briefcase} />
              <InfoBox
                label="Salary"
                value={`৳ ${data.salary.toLocaleString()} / month`}
                icon={DollarSign}
              />
              <InfoBox
                label="Schedule"
                value={`${data.daysPerWeek} days/week`}
                icon={Calendar}
              />
              <InfoBox label="Time Slot" value={data.timeSlot} icon={Clock} />
              <InfoBox label="Location" value={data.location} icon={MapPin} />
            </div>
          </section>
        </div>
      </div>

      {/* Action Interface Management Footer Row */}
      <div className="flex items-center justify-between gap-2 pt-4 border-t border-border mt-2">
        {/* Applications Action (Left side) */}
        <Link href={`/parent/my-tuitions/applications/${data.id}`}>
          <button className="flex cursor-pointer items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold text-primary bg-primary/5 hover:bg-primary/10 transition-all active:scale-95">
            <Users size={16} />
            <span>
              <span>Applications </span>(
              {data.applicationsCount})
            </span>
          </button>
        </Link>

        {/* Management Control Actions (Right side) */}
        <div className="flex items-center gap-2">
          {/* Edit Action */}
          {isClosed ? (
            <button
              disabled
              title="Cannot edit a closed tuition posting"
              className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold text-text-muted/40 bg-transparent opacity-50 cursor-not-allowed select-none"
            >
              <Edit2 size={16} />
              <span className="hidden sm:inline">Edit</span>
            </button>
          ) : (
            <Link href={`/parent/my-tuitions/edit/${data.id}`}>
              <button className="flex cursor-pointer items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold text-text-muted hover:bg-surface-hover transition-all active:scale-95">
                <Edit2 size={16} />
                <span className="hidden sm:inline">Edit</span>
              </button>
            </Link>
          )}

          {/* Delete Action */}
          <button
            onClick={() => setIsDeleteModalOpen(true)}
            className="flex cursor-pointer items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold text-red-600 hover:bg-red-500/5 transition-all active:scale-95"
          >
            <Trash2 size={16} />
            <span className="hidden sm:inline">Delete</span>
          </button>
        </div>
      </div>

      {/* Reusable ConfirmModal Instance */}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        title="Delete Tuition Post"
        message="Are you absolutely sure you want to delete this tuition posting? All applications associated with it will be permanently removed. This action cannot be undone."
        isLoading={isDeleting}
      />
    </div>
  );
}

interface InfoBoxProps {
  label: string;
  value: string;
  icon: LucideIcon;
}

function InfoBox({ label, value, icon: Icon }: InfoBoxProps) {
  return (
    <div className="p-3.5 rounded-xl bg-surface-hover border border-border/50">
      <div className="flex items-center gap-2 mb-1">
        <Icon size={14} className="text-primary" />
        <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider">
          {label}
        </span>
      </div>
      <p className="text-sm font-bold text-text-main">{value}</p>
    </div>
  );
}
