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
} from "lucide-react";
import Button from "@/components/ui/Button";
import Image from "next/image";
import { format } from "date-fns";
import DetailsSkeleton from "@/components/tuition/TuitionDetailsSkeleton";

export default function TuitionDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [data, setData] = useState<TuitionDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getDetails = async () => {
      try {
        const res = await fetcher(`/tuitions/${id}`);
        const result = await res.json();
        if (result.success) setData(result.data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    getDetails();
  }, [id]);

  if (isLoading) return <DetailsSkeleton />;
  if (!data) return <div className="p-10 text-center">Tuition not found.</div>;

  const isClosed = data.status === "CLOSED";

  return (
    <div className="max-w-3xl mx-auto py-6 px-4 pb-24">
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="flex cursor-pointer items-center gap-2 text-text-muted hover:text-primary mb-6 transition-colors"
      >
        <ChevronLeft size={20} /> Back to Feed
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

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 gap-6">
        {/* Left Column: Details */}
        <div className="md:col-span-2 space-y-6">
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
              <InfoBox label="Subject" value={data.subject} icon={Briefcase} />
              <InfoBox label="Class" value={data.classLevel} icon={Briefcase} />
              <InfoBox
                label="Salary"
                value={`৳${data.salary}/month`}
                icon={Briefcase}
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

        {/* Right Column: Parent Info & Actions */}
        <div className="space-y-6">
          <div className="bg-background border border-border rounded-2xl p-6 sticky top-24">
            <div className="text-center mb-6">
              <div className="w-20 h-20 rounded-full bg-surface-hover mx-auto mb-3 relative overflow-hidden border-2 border-primary/20">
                {data.parent.photo ? (
                  <Image
                    src={data.parent.photo}
                    alt={data.parent.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-primary">
                    {data.parent.name[0]}
                  </div>
                )}
              </div>
              <h3 className="font-bold text-text-main">{data.parent.name}</h3>
              <p className="text-xs text-text-muted">Parent / Job Poster</p>
            </div>

            <div className="space-y-3">
              <Button
                variant="primary"
                className="w-full gap-2 py-6 text-lg"
                disabled={isClosed}
              >
                <Send size={20} /> {isClosed ? "Position Filled" : "Apply Now"}
              </Button>
              <Button variant="outline" className="w-full gap-2 py-6">
                <Bookmark size={20} /> Bookmark
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


