export default function EditPortfolioSkeleton() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-8 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex items-center gap-4 mb-8">
        <div className="w-10 h-10 bg-surface-hover rounded-full" />
        <div className="space-y-2">
          <div className="h-6 bg-surface-hover rounded-md w-40" />
          <div className="h-3 bg-surface-hover rounded-md w-60" />
        </div>
      </div>

      {/* Form Container Skeleton */}
      <div className="bg-background border border-border rounded-4xl p-6 md:p-8 space-y-8 shadow-sm">
        {/* Large Input (Headline/Bio) */}
        <div className="space-y-3">
          <div className="h-3 bg-surface-hover rounded-md w-24" />
          <div className="h-12 bg-surface-hover rounded-2xl w-full" />
        </div>

        <div className="space-y-3">
          <div className="h-3 bg-surface-hover rounded-md w-20" />
          <div className="h-32 bg-surface-hover rounded-2xl w-full" />
        </div>

        {/* Grid Inputs (University/Department) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div className="h-3 bg-surface-hover rounded-md w-20" />
            <div className="h-12 bg-surface-hover rounded-2xl w-full" />
          </div>
          <div className="space-y-3">
            <div className="h-3 bg-surface-hover rounded-md w-20" />
            <div className="h-12 bg-surface-hover rounded-2xl w-full" />
          </div>
        </div>

        {/* Regular Inputs */}
        <div className="space-y-3">
          <div className="h-3 bg-surface-hover rounded-md w-28" />
          <div className="h-12 bg-surface-hover rounded-2xl w-full" />
        </div>

        <div className="space-y-3">
          <div className="h-3 bg-surface-hover rounded-md w-32" />
          <div className="h-12 bg-surface-hover rounded-2xl w-full" />
        </div>

        {/* Bottom Grid (Salary/Availability) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div className="h-3 bg-surface-hover rounded-md w-24" />
            <div className="h-12 bg-surface-hover rounded-2xl w-full" />
          </div>
          <div className="space-y-3">
            <div className="h-3 bg-surface-hover rounded-md w-24" />
            <div className="h-12 bg-surface-hover rounded-2xl w-full" />
          </div>
        </div>
      </div>

      {/* Button Skeleton */}
      <div className="mt-6 h-14 bg-surface-hover rounded-2xl w-full" />
    </div>
  );
}
