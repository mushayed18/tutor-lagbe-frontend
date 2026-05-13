"use client";

import { useAuth } from "@/providers/AuthProvider";
import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileInfoCard from "@/components/profile/ProfileInfoCard";
import ProfileSkeleton from "@/components/profile/ProfileSkeleton"; // Create this for loading
import { Mail, Phone, Calendar, ShieldCheck } from "lucide-react";
import EditProfileButton from "@/components/profile/EditProfileButton";
import ReviewList from "@/components/profile/ReviewList";

export default function ParentMyProfilePage() {
  const { user, isLoading } = useAuth();

  if (isLoading) return <ProfileSkeleton />;

  if (!user)
    return (
      <div className="p-20 text-center">Please log in to view profile.</div>
    );

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 pb-24">
      <div className="bg-background border border-border rounded-3xl overflow-hidden shadow-sm">
        <ProfileHeader
          name={user.name}
          photo={user.photo}
          location={user.location}
          role={user.role}
          isVerified={user.isVerified}
        />

        <hr className="border-border mx-8 mb-8" />

        <div className="px-8 pb-8">
          <h2 className="text-sm font-bold text-text-muted uppercase tracking-widest mb-4">
            Account Details
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ProfileInfoCard
              icon={Mail}
              label="Email Address"
              value={user.email}
            />
            <ProfileInfoCard
              icon={Phone}
              label="Phone Number"
              value={user.phone}
            />
            <ProfileInfoCard
              icon={Calendar}
              label="Member Since"
              value={new Date(user.createdAt).toLocaleDateString("en-US", {
                month: "long",
                year: "numeric",
              })}
            />
            <ProfileInfoCard
              icon={ShieldCheck}
              label="Subscription"
              value={user.subscriptionRole || "General User"}
            />
          </div>
        </div>

        <EditProfileButton userRole={user.role} />
      </div>

      <div className="bg-surface-main/30 border-t border-border mt-6">
        <ReviewList userId={user.id} />
      </div>
    </div>
  );
}
