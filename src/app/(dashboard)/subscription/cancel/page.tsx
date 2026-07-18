"use client";

import Link from "next/link";
import { XCircle } from "lucide-react";
import Button from "@/components/ui/Button";

export default function SubscriptionCancelPage() {
  return (
    <div className="max-w-md mx-auto px-4 py-16 text-center pb-24">
      <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4">
        <XCircle className="text-red-400" size={32} />
      </div>
      <h1 className="text-xl font-bold mb-2">Checkout cancelled</h1>
      <p className="text-text-muted text-sm">
        No payment was made. You can try again anytime.
      </p>
      <Link href="/subscription">
        <Button className="mt-8">Try again</Button>
      </Link>
    </div>
  );
}
