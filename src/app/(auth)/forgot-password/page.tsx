"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { KeyRound, ArrowLeft } from "lucide-react";

import { ForgotPasswordInput, forgotPasswordSchema } from "@/lib/validations/auth";
import { fetcher } from "@/lib/api-client";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordInput) => {
    setIsLoading(true);
    try {
      const response = await fetcher("/auth/forgot-password", {
        method: "POST",
        body: JSON.stringify(data),
      });
      const result = await response.json();

      if (!result.success) throw new Error(result.message);

      toast.success(result.message);
      // Pass email to next step via URL
      router.push(`/reset-password?email=${encodeURIComponent(data.email)}`);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="w-full max-w-md bg-surface p-8 rounded-3xl border border-gray-800 shadow-2xl">
        <div className="text-center mb-8">
          <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <KeyRound className="text-primary" size={32} />
          </div>
          <h1 className="text-2xl font-bold text-text-main mb-2">Forgot Password?</h1>
          <p className="text-sm text-text-muted">Enter your email and we&apos;ll send you a 6-digit code.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <Input
            label="Email Address"
            placeholder="john@example.com"
            {...register("email")}
            error={errors.email?.message as string}
          />
          <Button type="submit" className="w-full py-6" isLoading={isLoading}>
            Send Reset Code
          </Button>
        </form>

        <button 
          onClick={() => router.push("/login")}
          className="w-full mt-6 flex items-center justify-center gap-2 text-sm text-text-muted hover:text-primary transition-colors font-medium"
        >
          <ArrowLeft size={16} /> Back to Login
        </button>
      </div>
    </div>
  );
}