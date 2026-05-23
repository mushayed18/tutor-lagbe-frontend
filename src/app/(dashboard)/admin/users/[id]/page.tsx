"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { fetcher } from "@/lib/api-client";
import { AdminSingleUserDetail, GetSingleUserApiResponse } from "@/types/admin";
import UserProfileHeader from "@/components/admin/UserProfileHeader";
import AccountDetailsCard from "@/components/admin/AccountDetailsCard";
import ProfileLoadingState from "@/components/admin/ProfileLoadingState";
import { ArrowLeftCircle, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import UserModerationCard from "@/components/admin/UserModerationCard";

export default function AdminSingleUserPage() {
  const params = useParams();
  const router = useRouter();
  const userId = params?.id as string;

  const [user, setUser] = useState<AdminSingleUserDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch individual record details parameters
  const fetchSingleUserRecord = useCallback(async () => {
    if (!userId) return;
    try {
      setIsLoading(true);
      const res = await fetcher(`/admin/users/${userId}`);

      if (!res.ok) {
        if (res.status === 404)
          throw new Error("Target user record does not exist in registry.");
        throw new Error("Failed to process profile data lookup.");
      }

      const result: GetSingleUserApiResponse = await res.json();
      if (result.success) {
        setUser(result.data);
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error.message);
      router.push("/admin/users"); // Bounce back to directory safety on broken lookups
    } finally {
      setIsLoading(false);
    }
  }, [userId, router]);

  useEffect(() => {
    fetchSingleUserRecord();
  }, [fetchSingleUserRecord]);

  return (
    <div className="space-y-6 p-4 max-w-4xl mx-auto mb-20">
      <button
        onClick={() => router.back()}
        className="p-2 hover:bg-surface-hover rounded-full transition-colors cursor-pointer"
      >
        <ArrowLeft size={24} />
      </button>

      {/* Primary Display Processing Hub Router View */}
      {isLoading ? (
        <ProfileLoadingState />
      ) : user ? (
        <div className="space-y-6">
          <UserProfileHeader user={user} />
          <AccountDetailsCard user={user} />

          <UserModerationCard
            userId={user.id}
            initialBanStatus={user.isBanned}
            onStatusUpdated={fetchSingleUserRecord} // Automatically updates header state colors on change!
          />
        </div>
      ) : (
        <div className="text-center py-20 bg-surface-hover/30 rounded-3xl border border-dashed border-border p-6 flex flex-col items-center justify-center">
          <ArrowLeftCircle size={24} className="text-text-muted mb-2" />
          <p className="text-sm font-bold text-text-muted">
            User profiles could not be resolved.
          </p>
        </div>
      )}
    </div>
  );
}
