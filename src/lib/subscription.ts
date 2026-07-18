import { fetcher } from "@/lib/api-client";

export interface SubscriptionPlan {
  role: "TUTOR" | "PARENT";
  amount: number; // smallest currency unit (poisha for BDT)
  currency: string;
  durationDays: number;
}

export async function fetchSubscriptionPlan(): Promise<SubscriptionPlan> {
  const res = await fetcher("/subscriptions/plan");
  const result = await res.json();

  if (!result.success) {
    throw new Error(result.message || "Could not load pricing");
  }

  return result.data;
}

export async function startSubscriptionCheckout(): Promise<{
  url: string;
  sessionId: string;
}> {
  const res = await fetcher("/subscriptions/checkout", { method: "POST" });
  const result = await res.json();

  if (!result.success) {
    throw new Error(result.message || "Could not start checkout");
  }

  return result.data;
}
