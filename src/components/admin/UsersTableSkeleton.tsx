"use client";

export default function UsersTableSkeleton() {
  return (
    <div className="w-full bg-surface rounded-2xl border border-border overflow-hidden animate-pulse">
      <div className="h-12 bg-surface-hover/60 border-b border-border" />
      <div className="divide-y divide-border/60">
        {Array.from({ length: 5 }).map((_, idx) => (
          <div
            key={idx}
            className="p-4 flex justify-between items-center space-x-4"
          >
            <div className="space-y-2 flex-1">
              <div className="h-4 bg-surface-hover rounded w-1/4" />
              <div className="h-3 bg-surface-hover rounded w-1/3" />
            </div>
            <div className="h-6 bg-surface-hover rounded w-16" />
            <div className="h-6 bg-surface-hover rounded w-20" />
            <div className="h-9 bg-surface-hover rounded w-24" />
          </div>
        ))}
      </div>
    </div>
  );
}
