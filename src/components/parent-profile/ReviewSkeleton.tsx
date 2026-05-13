export default function ReviewSkeleton() {
  return (
    <div className="bg-background border border-border rounded-3xl p-5 animate-pulse">
      <div className="flex gap-4">
        <div className="w-12 h-12 rounded-2xl bg-surface-hover" />
        <div className="flex-1 space-y-3">
          <div className="flex justify-between">
            <div className="h-4 w-32 bg-surface-hover rounded" />
            <div className="h-4 w-4 bg-surface-hover rounded" />
          </div>
          <div className="h-3 w-20 bg-surface-hover rounded" />
          <div className="space-y-2">
            <div className="h-4 w-full bg-surface-hover rounded" />
            <div className="h-4 w-2/3 bg-surface-hover rounded" />
          </div>
        </div>
      </div>
    </div>
  );
}
