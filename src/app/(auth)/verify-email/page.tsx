"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { MailCheck } from "lucide-react";

import { verifyEmailSchema, VerifyEmailInput } from "@/lib/validations/auth";
import { fetcher } from "@/lib/api-client";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

// We separate the form into its own component to use searchParams safely
function VerifyEmailForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<VerifyEmailInput>({
    resolver: zodResolver(verifyEmailSchema),
    defaultValues: { email },
  });

  const onSubmit = async (data: VerifyEmailInput) => {
    setIsLoading(true);
    try {
      const response = await fetcher("/auth/verify-email", {
        method: "POST",
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || "Verification failed");
      }

      toast.success("Account verified! Welcome to TutorLagbe.");
      
      // Since the cookie is set by the backend, we just redirect to dashboard
      router.push("/");
      router.refresh(); // Forces Next.js to re-check the cookie for the Navbar
      
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-surface p-8 rounded-3xl border border-gray-800 shadow-2xl">
      <div className="text-center mb-8">
        <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
          <MailCheck className="text-primary" size={32} />
        </div>
        <h1 className="text-2xl font-bold text-text-main mb-2">Check your email</h1>
        <p className="text-sm text-text-muted">
          We sent a 6-digit code to <span className="text-text-main font-medium">{email}</span>
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Input
          label="Verification Code"
          placeholder="Enter 6-digit OTP"
          maxLength={6}
          className="text-center text-2xl tracking-[1em] font-bold"
          {...register("otp")}
          error={errors.otp?.message}
        />

        <Button type="submit" className="w-full py-6" isLoading={isLoading}>
          Verify & Complete
        </Button>
      </form>
    </div>
  );
}

// Main page component
export default function VerifyEmailPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh]">
      <Suspense fallback={<div className="text-text-muted">Loading...</div>}>
        <VerifyEmailForm />
      </Suspense>
    </div>
  );
}