"use client";

import { useEffect, useState } from "react";
import { Crown, Check } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/providers/AuthProvider";
import {
  fetchSubscriptionPlan,
  startSubscriptionCheckout,
  SubscriptionPlan,
} from "@/lib/subscription";
import Button from "@/components/ui/Button";

export default function SubscriptionPage() {
  const { user, isLoading: authLoading } = useAuth();
  const [plan, setPlan] = useState<SubscriptionPlan | null>(null);
  const [isLoadingPlan, setIsLoadingPlan] = useState(true);
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    if (!user) return;

    fetchSubscriptionPlan()
      .then(setPlan)
      .catch(() => toast.error("Could not load pricing. Try again."))
      .finally(() => setIsLoadingPlan(false));
  }, [user]);

  const handleSubscribe = async () => {
    setIsRedirecting(true);
    try {
      const { url } = await startSubscriptionCheckout();
      window.location.href = url; // Redirect to Stripe Checkout
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Could not start checkout";
      toast.error(message);
      setIsRedirecting(false);
    }
  };

  if (authLoading || isLoadingPlan) {
    return (
      <div className="p-20 text-center text-text-muted text-sm">
        Loading plan…
      </div>
    );
  }

  if (!user) {
    return <div className="p-20 text-center">Please log in to subscribe.</div>;
  }

  if (user.role === "ADMIN") {
    return (
      <div className="p-20 text-center text-text-muted text-sm">
        Subscriptions are only available for Tutors and Parents.
      </div>
    );
  }

  const isActive =
    user.subscriptionType === "PREMIUM" &&
    !!user.subscriptionExpiresAt &&
    new Date(user.subscriptionExpiresAt) > new Date();

  const benefits =
    user.role === "TUTOR"
      ? [
          "Apply to unlimited job posts",
          "No more 5-applications-per-day limit",
          "Priority support",
        ]
      : [
          "Your job posts are boosted to the top of the feed",
          "Get noticed by tutors first",
          "Priority support",
        ];

  const priceLabel = plan
    ? `৳${(plan.amount / 100).toLocaleString()} / month`
    : "—";

  return (
    <div className="max-w-md mx-auto px-4 py-10 pb-24">
      <div className="bg-background border border-border rounded-3xl p-8 text-center shadow-sm">
        <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
          <Crown className="text-primary" size={28} />
        </div>

        <h1 className="text-xl font-bold mb-1">TutorLagbe Premium</h1>
        <p className="text-text-muted text-sm mb-6">1-month subscription</p>

        <div className="text-3xl font-extrabold mb-6">{priceLabel}</div>

        <ul className="text-left space-y-3 mb-8">
          {benefits.map((b) => (
            <li key={b} className="flex items-start gap-2 text-sm">
              <Check size={18} className="text-primary shrink-0 mt-0.5" />
              <span>{b}</span>
            </li>
          ))}
        </ul>

        {isActive && (
          <div className="rounded-xl bg-primary/5 border border-primary/20 py-3 px-4 text-sm text-primary font-semibold mb-6">
            You&apos;re already Premium until{" "}
            {new Date(user.subscriptionExpiresAt!).toLocaleDateString()}.
            Subscribing again will extend it by 1 month.
          </div>
        )}

        <Button
          onClick={handleSubscribe}
          isLoading={isRedirecting}
          className="w-full"
          size="lg"
        >
          {isActive ? "Extend Subscription" : "Subscribe Now"}
        </Button>

        <p className="text-[11px] text-text-muted mt-4">
          Test mode — use card 4242 4242 4242 4242, any future expiry, any CVC.
        </p>
      </div>
    </div>
  );
}
