"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FileQuestion, ChevronLeft } from "lucide-react";
import Button from "@/components/ui/Button";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* Illustration Area */}
        <div className="relative mb-8 flex justify-center">
          <div className="absolute inset-0 bg-primary/5 blur-3xl rounded-full" />
          <div className="relative bg-surface-hover border border-border w-24 h-24 rounded-3xl flex items-center justify-center rotate-3 hover:rotate-0 transition-transform duration-500">
            <FileQuestion size={48} className="text-primary" />
          </div>
        </div>

        {/* Text Content */}
        <h1 className="text-4xl font-black text-text-main mb-3">404</h1>
        <h2 className="text-xl font-bold text-text-main mb-4">
          Oops! Page not found
        </h2>
        <p className="text-text-muted mb-10 leading-relaxed">
          The page you are looking for doesn&apos;t exist or has been moved.
          Don&apos;t worry, you can head back to safety below.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4 justify-center">
          <Button
            variant="outline"
            className="w-full sm:w-auto gap-2 py-6 px-8"
            onClick={() => router.back()}
          >
            <ChevronLeft size={20} />
            Go Back
          </Button>
        </div>

        {/* Brand/Footer Link */}
        <p className="mt-12 text-sm text-text-muted">
          Need help?{" "}
          <Link
            href="/contact"
            className="text-primary font-bold hover:underline"
          >
            Contact Support
          </Link>
        </p>
      </div>
    </div>
  );
}
