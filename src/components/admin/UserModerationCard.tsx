"use client";

import { useState } from "react";
import { fetcher } from "@/lib/api-client";
import { toast } from "sonner";
import { ShieldAlert, ShieldCheck, AlertTriangle } from "lucide-react";
import { ConfirmModal } from "@/components/ui/ConfirmModal"; // Adjust path based on your design system folders

interface UserModerationCardProps {
  userId: string;
  initialBanStatus: boolean;
  onStatusUpdated: () => void;
}

export default function UserModerationCard({
  userId,
  initialBanStatus,
  onStatusUpdated,
}: UserModerationCardProps) {
  const [isBanned, setIsBanned] = useState(initialBanStatus);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleToggleBanExecution = async () => {
    try {
      setIsSubmitting(true);

      const response = await fetcher(`/admin/users/${userId}/ban`, {
        method: "PATCH",
        body: JSON.stringify({ isBanned: !isBanned }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Failed to execute ban toggle protocol.",
        );
      }

      setIsBanned(!isBanned);
      toast.success(result.message || "User status updated successfully.");
      onStatusUpdated();
      setIsModalOpen(false); // Close modal on success
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error.message || "Network layer processing failure.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Dynamic layout texts based on the user's operational status
  const modalTitle = isBanned
    ? "Lift Account Restriction"
    : "Execute Account Suspension";
  const modalMessage = isBanned
    ? "Are you sure you want to unban this user? This will restore their profile and grant them full clearance to log back into their dashboard."
    : "CRITICAL ACTION: Are you sure you want to ban this user? Banned users are completely blocked at the gate and will be instantly unable to log into the application.";

  return (
    <>
      <div className="w-full border border-red-500/20 bg-red-500/2 rounded-2xl p-5 shadow-xs space-y-4">
        {/* Informative Informational Box */}
        <div className="flex items-start gap-3">
          <div className="p-2 bg-red-500/10 text-red-500 rounded-xl shrink-0 mt-0.5">
            <AlertTriangle size={18} />
          </div>
          <div>
            <h4 className="text-sm font-black text-text-main tracking-tight">
              Administrative Control Center
            </h4>
            <p className="text-xs text-text-muted mt-1 leading-relaxed max-w-xl">
              Suspending an account completely revokes the users access tokens.
              They will be entirely locked out from logging into the platform
              until this action is reversed.
            </p>
          </div>
        </div>

        <div className="pt-2 border-t border-red-500/10 flex items-center justify-between gap-4 flex-wrap">
          <div className="text-xs">
            <p className="font-medium text-text-muted">Account Status State:</p>
            <p
              className={`font-black mt-0.5 ${isBanned ? "text-red-500" : "text-emerald-600"}`}
            >
              {isBanned ? "RESTRICTED (LOCKED OUT)" : "ACTIVE / OPERATIONAL"}
            </p>
          </div>

          {/* Trigger Button to display your premium modal */}
          <button
            onClick={() => setIsModalOpen(true)}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all active:scale-95 flex items-center gap-2 cursor-pointer select-none shadow-sm text-white ${
              isBanned
                ? "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/10"
                : "bg-red-500 hover:bg-red-600 shadow-red-500/10"
            }`}
          >
            {isBanned ? (
              <>
                <ShieldCheck size={14} /> Lift Ban Restriction
              </>
            ) : (
              <>
                <ShieldAlert size={14} /> Ban User Account
              </>
            )}
          </button>
        </div>
      </div>

      {/* 🌟 Custom Integrated Confirmation Modal Layout */}
      <ConfirmModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleToggleBanExecution}
        title={modalTitle}
        message={modalMessage}
        isLoading={isSubmitting}
      />
    </>
  );
}
