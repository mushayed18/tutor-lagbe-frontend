"use client";

export default function ProfileLoadingState() {
  return (
    <div className="w-full space-y-6 animate-pulse">
      {/* Header Skeleton */}
      <div className="p-6 bg-surface rounded-2xl border border-border flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-surface-hover" />
        <div className="space-y-2 flex-1">
          <div className="h-5 bg-surface-hover rounded w-1/4" />
          <div className="h-3 bg-surface-hover rounded w-1/3" />
        </div>
      </div>
      {/* Matrix Detail Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="h-48 bg-surface rounded-2xl border border-border" />
        <div className="h-48 bg-surface rounded-2xl border border-border" />
      </div>
    </div>
  );
}
