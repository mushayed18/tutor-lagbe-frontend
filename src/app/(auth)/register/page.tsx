"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { User, Users, ArrowRight } from "lucide-react";

import { registerSchema, RegisterInput } from "@/lib/validations/auth";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { fetcher } from "@/lib/api-client";

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  // 1. Initialize Form with Zod
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: "TUTOR", // Default role
    },
  });

  const selectedRole = watch("role");

  // 2. Submit Handler
  const onSubmit = async (data: RegisterInput) => {
    setIsLoading(true);
    try {
      const response = await fetcher("/auth/register", {
        method: "POST",
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || "Registration failed");
      }

      toast.success(result.message);

      // Redirect to Verify Email page, passing the email in the URL
      router.push(`/verify-email?email=${encodeURIComponent(data.email)}`);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="w-full max-w-md bg-surface p-8 md:rounded-3xl border border-gray-800 shadow-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">
            Join TutorLagbe
          </h1>
          <p className="text-text-muted">Create an account to get started</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Role Selection (The Social Vibe) */}
          <div className="flex gap-4 mb-6">
            <button
              type="button"
              onClick={() => setValue("role", "TUTOR")}
              className={`cursor-pointer flex-1 flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all ${
                selectedRole === "TUTOR"
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-gray-800 text-text-muted hover:border-gray-700"
              }`}
            >
              <User size={24} />
              <span className="text-xs font-semibold">Tutor</span>
            </button>
            <button
              type="button"
              onClick={() => setValue("role", "PARENT")}
              className={`cursor-pointer flex-1 flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all ${
                selectedRole === "PARENT"
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-gray-800 text-text-muted hover:border-gray-700"
              }`}
            >
              <Users size={24} />
              <span className="text-xs font-semibold">Parent</span>
            </button>
          </div>

          <Input
            label="Full Name"
            placeholder="John Doe"
            {...register("name")}
            error={errors.name?.message}
          />

          <Input
            label="Email Address"
            type="email"
            placeholder="john@example.com"
            {...register("email")}
            error={errors.email?.message}
          />

          <Input
            label="Phone Number"
            placeholder="01XXXXXXXXX"
            {...register("phone")}
            error={errors.phone?.message}
          />

          <Input
            label="Password"
            isPassword={true}
            type="password"
            placeholder="••••••••"
            {...register("password")}
            error={errors.password?.message}
          />

          <Button
            type="submit"
            className="w-full mt-4 py-6"
            isLoading={isLoading}
          >
            Create Account <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </form>

        <p className="text-center mt-6 text-sm text-text-muted">
          Already have an account?{" "}
          <button
            onClick={() => router.push("/login")}
            className="cursor-pointer text-primary font-semibold hover:underline"
          >
            Sign In
          </button>
        </p>
      </div>
    </div>
  );
}
