import Skeleton from "../ui/Skeleton";

export default function DetailsSkeleton() {
  return (
    <div className="max-w-3xl mx-auto py-6 px-4 space-y-6">
      <Skeleton className="h-6 w-32" />
      <Skeleton className="h-40 w-full rounded-2xl" />
      <div className="grid grid-cols-1 gap-6">
        <Skeleton className="md:col-span-2 h-96 rounded-2xl" />
        <Skeleton className="h-80 rounded-2xl" />
      </div>
    </div>
  );
}