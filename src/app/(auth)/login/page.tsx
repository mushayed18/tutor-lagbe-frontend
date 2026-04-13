"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { LogIn, ArrowRight } from "lucide-react";

import { loginSchema, LoginInput } from "@/lib/validations/auth";
import { fetcher } from "@/lib/api-client";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginInput) => {
    setIsLoading(true);
    try {
      const response = await fetcher("/auth/login", {
        method: "POST",
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || "Login failed");
      }

      toast.success("Welcome back!");
      
      // The browser now has the 'token' cookie. 
      // We refresh to update the Server Components and redirect.
      router.push("/");
      router.refresh(); 
      
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
          <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <LogIn className="text-primary" size={32} />
          </div>
          <h1 className="text-3xl font-bold text-text-main mb-2">Welcome Back</h1>
          <p className="text-text-muted">Enter your details to access your account</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <Input
            label="Email Address"
            type="email"
            placeholder="john@example.com"
            {...register("email")}
            error={errors.email?.message}
          />

          <div className="space-y-1">
            <Input
              label="Password"
              isPassword={true}
              placeholder="••••••••"
              {...register("password")}
              error={errors.password?.message}
            />
            <div className="flex justify-end px-1">
              <button 
                type="button"
                onClick={() => router.push("/forgot-password")}
                className="cursor-pointer text-xs text-primary hover:underline font-medium"
              >
                Forgot Password?
              </button>
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full mt-4 py-6" 
            isLoading={isLoading}
          >
            Sign In <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </form>

        <p className="text-center mt-8 text-sm text-text-muted">
          Don&apos;t have an account?{" "}
          <button 
            onClick={() => router.push("/register")}
            className="cursor-pointer text-primary font-semibold hover:underline"
          >
            Create Account
          </button>
        </p>
      </div>
    </div>
  );
}