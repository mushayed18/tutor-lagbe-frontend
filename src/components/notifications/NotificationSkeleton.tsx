export default function NotificationSkeleton() {
  return (
    <div className="relative flex items-start gap-4 p-4 md:p-5 rounded-xl md:rounded-2xl border border-border bg-card animate-pulse mb-4 overflow-hidden">
      {/* Shimmer Left Accent Block */}
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-muted" />

      {/* Shimmer Icon Square */}
      <div className="w-11.5 h-11.5 bg-muted rounded-xl shrink-0" />

      {/* Shimmer Content Wrapper */}
      <div className="flex-1 space-y-2.5">
        <div className="flex justify-between items-start gap-4">
          <div className="space-y-2 w-full">
            {/* Shimmer Micro Badge */}
            <div className="h-4 bg-muted rounded-md w-16" />
            {/* Shimmer Title text */}
            <div className="h-5 bg-muted rounded-md w-2/3 md:w-1/3" />
          </div>
          {/* Shimmer Timestamp badge */}
          <div className="h-6 bg-muted rounded-full w-20 shrink-0" />
        </div>

        {/* Shimmer Message text blocks */}
        <div className="space-y-2 pt-0.5">
          <div className="h-3.5 bg-muted rounded w-full" />
          <div className="h-3.5 bg-muted rounded w-4/5" />
        </div>
      </div>
    </div>
  );
}
