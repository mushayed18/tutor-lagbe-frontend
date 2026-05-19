"use client";

export default function ParentFormSkeleton() {
  return (
    <div className="max-w-2xl mx-auto py-6 px-4 pb-24 animate-pulse">
      {/* Back Button Skeleton */}
      <div className="h-5 w-16 bg-surface-hover rounded-lg mb-6" />

      {/* Main Form Container Card Skeleton */}
      <div className="bg-background border border-border rounded-2xl p-6 shadow-sm space-y-6">
        {/* Header Block */}
        <div>
          <div className="h-7 w-48 bg-surface-hover rounded-xl mb-2" />
          <div className="h-4 w-full max-w-sm bg-surface-hover/60 rounded-lg" />
        </div>

        {/* Input Field Skeletons */}
        <div className="space-y-5">
          {/* Title Input */}
          <div className="space-y-2">
            <div className="h-4 w-28 bg-surface-hover rounded-md" />
            <div className="h-12 w-full bg-surface-hover/50 rounded-2xl" />
          </div>

          {/* Description Input */}
          <div className="space-y-2">
            <div className="h-4 w-32 bg-surface-hover rounded-md" />
            <div className="h-28 w-full bg-surface-hover/50 rounded-2xl" />
          </div>

          {/* Subjects & Class Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="h-4 w-20 bg-surface-hover rounded-md" />
              <div className="h-12 w-full bg-surface-hover/50 rounded-2xl" />
            </div>
            <div className="space-y-2">
              <div className="h-4 w-24 bg-surface-hover rounded-md" />
              <div className="h-12 w-full bg-surface-hover/50 rounded-2xl" />
            </div>
          </div>

          {/* Salary & Days Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="h-4 w-36 bg-surface-hover rounded-md" />
              <div className="h-12 w-full bg-surface-hover/50 rounded-2xl" />
            </div>
            <div className="space-y-2">
              <div className="h-4 w-28 bg-surface-hover rounded-md" />
              <div className="h-12 w-full bg-surface-hover/50 rounded-2xl" />
            </div>
          </div>

          {/* Time Slot & Status Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="h-4 w-32 bg-surface-hover rounded-md" />
              <div className="h-12 w-full bg-surface-hover/50 rounded-2xl" />
            </div>
            <div className="space-y-2">
              <div className="h-4 w-40 bg-surface-hover rounded-md" />
              <div className="h-12 w-full bg-surface-hover/50 rounded-2xl" />
            </div>
          </div>

          {/* Location Input */}
          <div className="space-y-2">
            <div className="h-4 w-28 bg-surface-hover rounded-md" />
            <div className="h-12 w-full bg-surface-hover/50 rounded-2xl" />
          </div>

          {/* Actions Footer */}
          <div className="pt-4 border-t border-border flex justify-end gap-3">
            <div className="h-10 w-20 bg-surface-hover rounded-xl" />
            <div className="h-10 w-32 bg-surface-hover rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
}
