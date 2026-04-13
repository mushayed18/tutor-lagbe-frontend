"use client";

import React, { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { ShieldCheck } from "lucide-react";

import {
  ResetPasswordInput,
  resetPasswordSchema,
} from "@/lib/validations/auth";
import { fetcher } from "@/lib/api-client";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { email, otp: "", newPassword: "" },
  });

  const onSubmit = async (data: ResetPasswordInput) => {
    setIsLoading(true);
    try {
      const response = await fetcher("/auth/reset-password", {
        method: "POST",
        body: JSON.stringify(data),
      });
      const result = await response.json();

      if (!result.success) throw new Error(result.message);

      toast.success("Password reset successfully!");
      router.push("/login");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-surface p-8 md:rounded-3xl border border-gray-800 shadow-2xl">
      <div className="text-center mb-8">
        <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
          <ShieldCheck className="text-primary" size={32} />
        </div>
        <h1 className="text-2xl font-bold text-text-main mb-2">
          Set New Password
        </h1>
        <p className="text-sm text-text-muted">
          Verification code sent to{" "}
          <span className="text-text-main">{email}</span>
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <Input
          label="Verification Code"
          placeholder="6-digit OTP"
          {...register("otp")}
          error={errors.otp?.message as string}
        />

        <Input
          label="New Password"
          isPassword={true}
          placeholder="Min 8 characters"
          {...register("newPassword")}
          error={errors.newPassword?.message as string}
        />

        <Input
          label="Confirm New Password"
          isPassword={true}
          placeholder="Repeat your password"
          {...register("confirmPassword")}
          error={errors.confirmPassword?.message as string}
        />

        <Button type="submit" className="w-full py-6" isLoading={isLoading}>
          Reset Password
        </Button>
      </form>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Suspense fallback={<div className="text-text-muted">Loading...</div>}>
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}
