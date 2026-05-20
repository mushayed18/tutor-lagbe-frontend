"use client";

export default function TutorPortfolioSkeleton() {
  return (
    <div className="w-full bg-background border border-border rounded-2xl p-6 shadow-sm space-y-6 animate-pulse">
      {/* Title & Headline Badge Skeleton */}
      <div className="space-y-3">
        <div className="h-6 w-48 bg-surface-hover rounded-xl" />
        <div className="h-8 w-44 bg-surface-hover/60 rounded-xl" />
      </div>

      {/* About / Bio Card Skeleton */}
      <div className="space-y-2">
        <div className="h-3 w-28 bg-surface-hover rounded-md ml-0.5" />
        <div className="h-24 w-full bg-surface-hover/30 border border-border/40 rounded-xl" />
      </div>

      {/* Qualifications & Preferences Grid Skeletons */}
      <div className="space-y-3">
        <div className="h-3 w-48 bg-surface-hover rounded-md ml-0.5" />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Create 6 placeholder cards to match our metrics layout */}
          {[...Array(6)].map((_, index) => (
            <div
              key={index}
              className="p-3.5 rounded-xl bg-surface-hover border border-border/50 flex items-start gap-3"
            >
              {/* Icon bounding box container skeleton */}
              <div className="w-8 h-8 bg-background border border-border/50 rounded-lg shrink-0" />

              <div className="space-y-2 w-full pt-0.5">
                {/* Field Label element */}
                <div className="h-2.5 w-24 bg-surface-hover-dashed rounded-md" />
                {/* Field Value element */}
                <div className="h-4 w-3/4 bg-surface-hover-dashed/80 rounded-md" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
