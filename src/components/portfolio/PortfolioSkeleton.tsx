export default function PortfolioSkeleton() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-pulse">
      <div className="bg-background border border-border rounded-3xl p-8 space-y-8">
        <div className="space-y-3">
          <div className="h-8 bg-surface-hover rounded-md w-1/3" />
          <div className="h-4 bg-surface-hover rounded-md w-full" />
          <div className="h-4 bg-surface-hover rounded-md w-2/3" />
        </div>
        <div className="grid grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-16 bg-surface-hover rounded-2xl" />
          ))}
        </div>
      </div>
    </div>
  );
}
