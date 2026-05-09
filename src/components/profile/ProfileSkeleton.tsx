export default function ProfileSkeleton() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-20 animate-pulse">
      <div className="h-32 bg-surface-hover rounded-t-3xl" />
      <div className="p-8 bg-background border border-border rounded-b-3xl">
        <div className="w-32 h-32 bg-surface-hover rounded-full -mt-24 border-4 border-background mb-6" />
        <div className="h-8 w-64 bg-surface-hover rounded mb-4" />
        <div className="grid grid-cols-2 gap-4">
          <div className="h-20 bg-surface-hover rounded-2xl" />
          <div className="h-20 bg-surface-hover rounded-2xl" />
        </div>
      </div>
    </div>
  );
}
