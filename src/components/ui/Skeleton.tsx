import { cn } from "@/lib/utils";

export default function Skeleton({ className }: { className?: string }) {
  return (
    <div className={cn("bg-surface-hover animate-pulse rounded-md", className)} />
  );
}