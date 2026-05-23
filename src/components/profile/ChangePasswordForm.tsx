"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { fetcher } from "@/lib/api-client";
import { KeyRound, Eye, EyeOff, Loader2, Lock } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

// 1. Client-side Form Validation Schema
const clientPasswordSchema = z
  .object({
    currentPassword: z
      .string()
      .min(6, { message: "Current password must be at least 6 characters." }),
    newPassword: z
      .string()
      .min(8, { message: "New password must be at least 8 characters." }),
    confirmPassword: z
      .string()
      .min(1, { message: "Please confirm your new password." }),
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: "New password must be different from your current password.",
    path: ["newPassword"], // Attaches error indicator to newPassword field
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Confirmed password does not match your new password.",
    path: ["confirmPassword"], // Attaches error indicator to confirmPassword field
  });

type ChangePasswordFormData = z.infer<typeof clientPasswordSchema>;

export default function ChangePasswordForm() {
  const router = useRouter();  
  const [isOpen, setIsOpen] = useState(false);

  // Toggle input field visibility layers
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // 2. React Hook Form Configuration Hooks
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(clientPasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const handleResetForm = () => {
    reset();
    setIsOpen(false);
  };

  const onFormSubmit = async (values: ChangePasswordFormData) => {
    try {
      const response = await fetcher("/auth/change-password", {
        method: "PATCH",
        body: JSON.stringify({
          currentPassword: values.currentPassword,
          newPassword: values.newPassword,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to update your password.");
      }

      toast.success(
        `${result.message || "Password updated successfully!"} Logging out...`,
      );
      handleResetForm();

      // Enforce systemic session purge redirect because backend drops tokens
      setTimeout(() => {
        router.push("/login");
        window.location.reload();
      }, 1500);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(
        error.message || "An error occurred while changing password.",
      );
    }
  };

  // State A: Form Hidden - Render the horizontally centered button layout
  if (!isOpen) {
    return (
      <div className="pt-4 flex justify-center w-full">
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="cursor-pointer inline-flex items-center justify-center gap-2 px-4 py-2.5 border border-border bg-background hover:bg-surface-hover rounded-xl text-xs font-bold text-text-main transition-all active:scale-95"
        >
          <KeyRound size={14} className="text-primary" />
          Change Account Password
        </button>
      </div>
    );
  }

  // State B: Form Visible - Render form field configurations with live validation listeners
  return (
    <div className="pt-6 space-y-4 animate-in fade-in-50 duration-200 mx-auto">
      <div className="flex items-center gap-2 text-text-main">
        <Lock size={16} className="text-primary" />
        <h3 className="text-sm font-black tracking-tight">
          Security Credentials Update
        </h3>
      </div>

      <p className="text-xs text-text-muted leading-relaxed">
        Updating your security password will immediately invalidate all other
        active sessions. You will be logged out and required to re-authenticate.
      </p>

      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
        {/* Input 1: Current Password */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider">
            Current Password
          </label>
          <div className="relative">
            <input
              type={showCurrent ? "text" : "password"}
              placeholder="Enter existing password"
              disabled={isSubmitting}
              className={`w-full text-xs font-semibold px-3.5 py-2.5 bg-background border rounded-xl focus:outline-hidden focus:border-primary transition-colors disabled:opacity-50 pr-10 ${
                errors.currentPassword
                  ? "border-red-500 focus:border-red-500"
                  : "border-border"
              }`}
              {...register("currentPassword")}
            />
            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => setShowCurrent(!showCurrent)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-main cursor-pointer disabled:opacity-30"
            >
              {showCurrent ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
          </div>
          {errors.currentPassword && (
            <p className="text-[11px] text-red-500 font-medium tracking-tight pl-1">
              {errors.currentPassword.message}
            </p>
          )}
        </div>

        {/* Input 2: New Password */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider">
            New Password
          </label>
          <div className="relative">
            <input
              type={showNew ? "text" : "password"}
              placeholder="Minimum 8 characters"
              disabled={isSubmitting}
              className={`w-full text-xs font-semibold px-3.5 py-2.5 bg-background border rounded-xl focus:outline-hidden focus:border-primary transition-colors disabled:opacity-50 pr-10 ${
                errors.newPassword
                  ? "border-red-500 focus:border-red-500"
                  : "border-border"
              }`}
              {...register("newPassword")}
            />
            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => setShowNew(!showNew)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-main cursor-pointer disabled:opacity-30"
            >
              {showNew ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
          </div>
          {errors.newPassword && (
            <p className="text-[11px] text-red-500 font-medium tracking-tight pl-1">
              {errors.newPassword.message}
            </p>
          )}
        </div>

        {/* Input 3: Confirm New Password */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider">
            Confirm New Password
          </label>
          <div className="relative">
            <input
              type={showConfirm ? "text" : "password"}
              placeholder="Retype new password"
              disabled={isSubmitting}
              className={`w-full text-xs font-semibold px-3.5 py-2.5 bg-background border rounded-xl focus:outline-hidden focus:border-primary transition-colors disabled:opacity-50 pr-10 ${
                errors.confirmPassword
                  ? "border-red-500 focus:border-red-500"
                  : "border-border"
              }`}
              {...register("confirmPassword")}
            />
            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-main cursor-pointer disabled:opacity-30"
            >
              {showConfirm ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-[11px] text-red-500 font-medium tracking-tight pl-1">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        {/* Form Actions Toolbar */}
        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="cursor-pointer inline-flex items-center gap-2 px-4 py-2.5 bg-primary hover:bg-primary-hover disabled:bg-primary/50 text-white text-xs font-bold rounded-xl transition-all active:scale-95 disabled:scale-100 shadow-xs"
          >
            {isSubmitting ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                Updating Credentials...
              </>
            ) : (
              "Save New Password"
            )}
          </button>

          <button
            type="button"
            disabled={isSubmitting}
            onClick={handleResetForm}
            className="cursor-pointer px-4 py-2.5 border border-transparent hover:bg-surface-hover rounded-xl text-xs font-bold text-text-muted hover:text-text-main transition-colors disabled:opacity-40"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
