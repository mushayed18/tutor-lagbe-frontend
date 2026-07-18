"use client";

import { useEffect, useState, Suspense } from "react"; // 👈 Added Suspense here
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, Loader2 } from "lucide-react";
import { useAuth } from "@/providers/AuthProvider";
import Button from "@/components/ui/Button";

// 1. Rename this main function to SuccessContent
function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const { refreshUser, user } = useAuth();
  const [isConfirming, setIsConfirming] = useState(true);

  useEffect(() => {
    let attempts = 0;
    const interval = setInterval(async () => {
      attempts += 1;
      await refreshUser();
      if (attempts >= 5) clearInterval(interval);
    }, 1500);

    const stopSpinner = setTimeout(() => setIsConfirming(false), 2000);

    return () => {
      clearInterval(interval);
      clearTimeout(stopSpinner);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isActive =
    user?.subscriptionType === "PREMIUM" &&
    !!user.subscriptionExpiresAt &&
    new Date(user.subscriptionExpiresAt) > new Date();

  return (
    <div className="max-w-md mx-auto px-4 py-16 text-center pb-24">
      <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-4">
        <CheckCircle2 className="text-green-500" size={32} />
      </div>

      <h1 className="text-xl font-bold mb-2">Payment successful!</h1>

      {isConfirming ? (
        <p className="text-text-muted text-sm flex items-center justify-center gap-2">
          <Loader2 className="animate-spin" size={16} /> Activating your premium
          plan…
        </p>
      ) : isActive ? (
        <p className="text-text-muted text-sm">
          Your Premium plan is now active until{" "}
          {new Date(user!.subscriptionExpiresAt!).toLocaleDateString()}.
        </p>
      ) : (
        <p className="text-text-muted text-sm">
          Payment received. It can take a few seconds to reflect — refresh the
          page if it doesn&apos;t update shortly.
        </p>
      )}

      {sessionId && (
        <p className="text-[11px] text-text-muted mt-2">
          Ref: {sessionId.slice(0, 24)}…
        </p>
      )}

      <Link href={user?.role === "PARENT" ? "/parent/feed" : "/tutor/feed"}>
        <Button className="mt-8">Back to feed</Button>
      </Link>
    </div>
  );
}

// 2. This is the new default export that Next.js expects.
// Wrapping SuccessContent inside <Suspense> tells Next.js to compile it safely.
export default function SubscriptionSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="flex max-w-md mx-auto h-64 items-center justify-center text-sm text-text-muted">
          <Loader2 className="animate-spin mr-2" size={16} /> Loading
          confirmation...
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
