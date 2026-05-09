export default function NotificationSkeleton() {
  return (
    <div className="flex items-start gap-4 p-5 rounded-2xl border border-border bg-background animate-pulse mb-3">
      {/* Icon Square */}
      <div className="w-12 h-12 bg-surface-hover rounded-xl shrink-0" />

      {/* Text Content */}
      <div className="flex-1 space-y-3">
        <div className="flex justify-between items-center">
          <div className="h-4 bg-surface-hover rounded w-1/3" />
          <div className="h-3 bg-surface-hover rounded w-16" />
        </div>
        <div className="space-y-2">
          <div className="h-3 bg-surface-hover rounded w-full" />
          <div className="h-3 bg-surface-hover rounded w-2/3" />
        </div>
      </div>
    </div>
  );
}
