import Skeleton from "../ui/Skeleton";

export default function TuitionSkeletonCard() {
  return (
    <div className="bg-background border border-border rounded-xl p-4 mb-4">
      <div className="flex items-center gap-3 mb-4">
        <Skeleton className="w-10 h-10 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-2 w-16" />
        </div>
      </div>
      <Skeleton className="h-5 w-3/4 mb-4" />
      <div className="grid grid-cols-2 gap-4">
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-full" />
      </div>
    </div>
  );
}