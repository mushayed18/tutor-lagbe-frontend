"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { fetcher } from "@/lib/api-client";
import { TuitionDetails } from "@/types/tuition";
import {
  MapPin,
  Clock,
  Calendar,
  Bookmark,
  Send,
  ChevronLeft,
  Users,
  Briefcase,
  Info,
  Crown,
  DollarSign,
  BookOpen,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import Button from "@/components/ui/Button";
import Image from "next/image";
import { format } from "date-fns";
import DetailsSkeleton from "@/components/tuition/TuitionDetailsSkeleton";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { ConfirmModal } from "@/components/ui/ConfirmModal"; // Import your new modal

export default function TuitionDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [data, setData] = useState<TuitionDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // States for Bookmark & Application
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);
  const [isPending, setIsPending] = useState(false); // for bookmark
  const [isApplying, setIsApplying] = useState(false); // for API call
  const [isModalOpen, setIsModalOpen] = useState(false); // for confirmation

  useEffect(() => {
    const getDetails = async () => {
      try {
        const res = await fetcher(`/tuitions/${id}`);
        const result = await res.json();
        if (result.success) {
          setData(result.data);
          setIsBookmarked(result.data.isBookmarked);
          setHasApplied(result.data.hasApplied); // Set initial application status
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    getDetails();
  }, [id]);

  const handleApply = async () => {
    if (!data) return;
    setIsApplying(true);
    try {
      const res = await fetcher("/applications", {
        method: "POST",
        body: JSON.stringify({ tuitionId: data.id }),
      });
      const result = await res.json();

      if (result.success) {
        setHasApplied(true);
        toast.success("Applied successfully!");
        setIsModalOpen(false);
      } else {
        toast.error(result.message || "Failed to apply");
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsApplying(false);
    }
  };

  const handleBookmark = async () => {
    if (isPending || !data) return;
    setIsPending(true);
    try {
      if (isBookmarked) {
        const res = await fetcher(`/bookmarks/${data.id}`, {
          method: "DELETE",
        });
        if (res.ok) {
          setIsBookmarked(false);
          toast.success("Removed from bookmarks");
        }
      } else {
        const res = await fetcher("/bookmarks", {
          method: "POST",
          body: JSON.stringify({ tuitionId: data.id }),
        });
        if (res.ok) {
          setIsBookmarked(true);
          toast.success("Saved to bookmarks");
        }
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsPending(false);
    }
  };

  if (isLoading) return <DetailsSkeleton />;
  if (!data) return <div className="p-10 text-center">Tuition not found.</div>;

  const isClosed = data.status === "CLOSED";

  return (
    <div className="max-w-3xl mx-auto py-6 px-4 pb-24">
      {/* Confirm Modal */}
      <ConfirmModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleApply}
        isLoading={isApplying}
        title="Confirm Application"
        message={`Are you sure you want to apply for "${data.title}"? This action cannot be undone.`}
      />

      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="flex cursor-pointer items-center gap-2 text-text-muted hover:text-primary mb-6 transition-colors"
      >
        <ChevronLeft size={20} /> Back
      </button>

      {/* Header Section */}
      <div className="bg-background border border-border rounded-2xl p-6 mb-6">
        <div className="flex justify-between items-start mb-4">
          <h1 className="text-2xl font-bold text-text-main leading-tight">
            {data.title}
          </h1>
          {data.parent.subscriptionType === "PREMIUM" && (
            <span className="bg-yellow-500/10 text-yellow-600 text-[10px] font-black px-2 py-1 rounded flex items-center gap-1 shrink-0">
              <Crown size={12} /> FEATURED
            </span>
          )}
        </div>

        <div className="flex flex-wrap gap-4 text-sm text-text-muted">
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
          <div className="text-text-muted">
            Posted on {format(new Date(data.createdAt), "PPP")}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div className="space-y-6">
          <section className="bg-background border border-border rounded-2xl p-6">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Info size={20} className="text-primary" /> Job Description
            </h2>
            <p className="text-text-muted whitespace-pre-wrap leading-relaxed">
              {data.description}
            </p>
          </section>

          <section className="bg-background border border-border rounded-2xl p-6">
            <h2 className="text-lg font-bold mb-4">Requirements</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InfoBox label="Subject" value={data.subject} icon={BookOpen} />
              <InfoBox label="Class" value={data.classLevel} icon={Briefcase} />
              <InfoBox
                label="Salary"
                value={`৳${data.salary.toLocaleString()}/month`}
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

        <div className="space-y-6">
          <div className="bg-background border border-border rounded-2xl p-6 sticky top-24">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-full bg-surface-hover relative overflow-hidden border-2 border-primary/20">
                {data.parent.photo ? (
                  <Image
                    src={data.parent.photo}
                    alt={data.parent.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xl font-bold text-primary">
                    {data.parent.name[0]}
                  </div>
                )}
              </div>
              <div>
                <h3 className="font-bold text-text-main">{data.parent.name}</h3>
                <p className="text-xs text-text-muted">Parent / Job Poster</p>
              </div>
            </div>

            <div className="space-y-3">
              {hasApplied ? (
                <div className="w-full py-4 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center gap-2 text-green-600 font-bold">
                  <CheckCircle2 size={20} />
                  Already Applied
                </div>
              ) : (
                <Button
                  variant="primary"
                  className="w-full gap-2 py-6 text-lg"
                  disabled={isClosed}
                  onClick={() => setIsModalOpen(true)}
                >
                  <Send size={20} />{" "}
                  {isClosed ? "Position Filled" : "Apply Now"}
                </Button>
              )}

              <Button
                variant="outline"
                className={cn(
                  "w-full gap-2 py-6 transition-all",
                  isBookmarked && "text-primary border-primary bg-primary/5",
                )}
                onClick={handleBookmark}
                disabled={isPending}
              >
                {isPending ? (
                  <Loader2 size={20} className="animate-spin" />
                ) : (
                  <Bookmark
                    size={20}
                    className={cn(isBookmarked && "fill-primary")}
                  />
                )}
                {isBookmarked ? "Saved" : "Bookmark"}
              </Button>
            </div>

            <p className="text-[10px] text-text-muted text-center mt-4 italic">
              Your contact info will only be shared after the parent accepts
              your application.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function InfoBox({ label, value, icon: Icon }: any) {
  return (
    <div className="p-3 rounded-xl bg-surface-hover border border-border/50">
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
