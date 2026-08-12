export function SubscriptionSkeleton() {
  return (
    <div className="max-w-md mx-auto px-4 py-10 pb-24">
      {/* Main Card Shell */}
      <div className="bg-background border border-border rounded-3xl p-8 text-center shadow-sm animate-pulse">
        {/* Crown Icon Container Placeholder */}
        <div className="w-14 h-14 rounded-full bg-muted mx-auto mb-4" />

        {/* Title Placeholder */}
        <div className="h-6 bg-muted rounded-md w-48 mx-auto mb-2" />

        {/* Subtitle Placeholder */}
        <div className="h-4 bg-muted/60 rounded-md w-32 mx-auto mb-6" />

        {/* Pricing Label Placeholder */}
        <div className="h-9 bg-muted rounded-md w-40 mx-auto mb-8" />

        {/* Benefits List Placeholder */}
        <div className="space-y-4 mb-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-3">
              {/* Checkmark placeholder */}
              <div className="w-4 h-4 bg-muted rounded-full shrink-0" />
              {/* Line text placeholder */}
              <div className="h-4 bg-muted/70 rounded-md w-full" />
            </div>
          ))}
        </div>

        {/* Action Button Placeholder */}
        <div className="w-full h-11 bg-muted rounded-xl" />

        {/* Footer Hint Placeholder */}
        <div className="h-3 bg-muted/40 rounded-md w-56 mx-auto mt-5" />
      </div>
    </div>
  );
}
