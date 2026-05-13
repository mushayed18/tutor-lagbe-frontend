"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { fetcher } from "@/lib/api-client";
import { ParentProfile } from "@/types/user";
import ProfileHeader from "@/components/parent-profile/ProfileHeader";
import ReviewSection from "@/components/parent-profile/ReviewSection";
import DetailsSkeleton from "@/components/tuition/TuitionDetailsSkeleton"; // Using existing skeleton
import { ChevronLeft } from "lucide-react";

export default function ParentProfilePage() {
  const { id } = useParams();
  const router = useRouter();
  const [profile, setProfile] = useState<ParentProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getProfile = async () => {
      try {
        const res = await fetcher(`/user/${id}`);
        const result = await res.json();
        if (result.success) {
          setProfile(result.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    getProfile();
  }, [id]);

  if (isLoading)
    return (
      <div className="max-w-4xl mx-auto p-6">
        <DetailsSkeleton />
      </div>
    );
  if (!profile) return <div className="p-20 text-center">User not found.</div>;

  return (
    <div className="max-w-4xl mx-auto py-6 px-4 pb-20">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-text-muted hover:text-primary mb-6 transition-colors font-bold text-sm"
      >
        <ChevronLeft size={20} /> Back
      </button>

      <ProfileHeader user={profile} />

      {/* Passing the ID to the ReviewSection so it can handle its own data fetching */}
      <ReviewSection targetUserId={profile.id} />
    </div>
  );
}
