const SidebarSkeleton = () => {
  return (
    <aside className="hidden md:flex flex-col w-20 xl:w-64 h-screen sticky top-0 border-r border-border p-4 bg-background">
      {/* Logo Skeleton */}
      <div className="mb-10 px-4">
        <div className="h-8 w-32 bg-surface-hover animate-pulse rounded-lg hidden xl:block" />
      </div>

      {/* Nav Links Skeleton */}
      <nav className="flex flex-col gap-4 flex-1">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex items-center gap-4 px-4">
            <div className="w-6 h-6 rounded-md bg-surface-hover animate-pulse" />
            <div className="h-4 w-24 bg-surface-hover animate-pulse rounded hidden xl:block" />
          </div>
        ))}
      </nav>

      {/* Profile Skeleton */}
      <div className="pt-4 border-t border-border flex items-center gap-3 px-2">
        <div className="w-10 h-10 rounded-full bg-surface-hover animate-pulse shrink-0" />
        <div className="hidden xl:block space-y-2">
          <div className="h-3 w-20 bg-surface-hover animate-pulse rounded" />
          <div className="h-2 w-28 bg-surface-hover animate-pulse rounded" />
        </div>
      </div>
    </aside>
  );
};

export default SidebarSkeleton;
