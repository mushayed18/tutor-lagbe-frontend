export default function PortfolioSkeleton() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-8 animate-pulse">
      <div className="bg-background border border-border rounded-4xl p-8 md:p-10 shadow-sm space-y-10">
        {/* Header Skeleton */}
        <div className="border-b border-border pb-8">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-20 h-20 rounded-2xl bg-surface-hover shrink-0" />
            <div className="flex-1 pt-2 space-y-3">
              <div className="h-6 bg-surface-hover rounded-md w-1/2" />
              <div className="h-4 bg-surface-hover rounded-md w-1/3" />
            </div>
          </div>
          {/* Bio Box Skeleton */}
          <div className="bg-surface-main/30 rounded-2xl p-5 border border-border/50 space-y-2">
            <div className="h-3 bg-surface-hover rounded-md w-full" />
            <div className="h-3 bg-surface-hover rounded-md w-full" />
            <div className="h-3 bg-surface-hover rounded-md w-4/5" />
          </div>
        </div>

        {/* Section Skeletons (Repeated) */}
        {[1, 2, 3].map((section) => (
          <div key={section} className="space-y-4">
            {/* Section Title */}
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 bg-surface-hover rounded-lg" />
              <div className="h-3 bg-surface-hover rounded-md w-32" />
            </div>

            {/* List Item Skeletons */}
            <div className="space-y-5">
              {[1, 2].map((item) => (
                <div
                  key={item}
                  className="flex flex-col border-b border-border/40 pb-3 last:border-0"
                >
                  <div className="h-2 bg-surface-hover rounded-md w-16 mb-2" />
                  <div className="h-4 bg-surface-hover rounded-md w-48" />
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Action Button Skeleton */}
        <div className="h-14 bg-surface-hover rounded-2xl w-full mt-4" />
      </div>
    </div>
  );
}
