"use client";

import { useEffect, useState, useRef, useCallback, Suspense } from "react";
import { fetcher } from "@/lib/api-client";
import { AdminTuitionRecord, GetAdminTuitionsApiResponse } from "@/types/admin";
import AdminTuitionCard from "@/components/admin/AdminTuitionCard";
import { Briefcase, RefreshCw, Loader2 } from "lucide-react";
import { toast } from "sonner";

function AdminTuitionsFeedContent() {
  const [tuitions, setTuitions] = useState<AdminTuitionRecord[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isFetchingNextPage, setIsFetchingNextPage] = useState(false);

  // Sentinel DOM pointer track mapping element
  const observerSentinelRef = useRef<HTMLDivElement | null>(null);

  const fetchTuitionFeed = useCallback(
    async (targetPage: number, resetStream = false) => {
      try {
        if (resetStream) setIsInitialLoading(true);
        else setIsFetchingNextPage(true);

        const response = await fetcher(
          `/admin/tuitions?page=${targetPage}&limit=10`,
        );
        const result: GetAdminTuitionsApiResponse = await response.json();

        if (result.success) {
          const fetchedItems = result.data || [];

          setTuitions((prev) =>
            resetStream ? fetchedItems : [...prev, ...fetchedItems],
          );

          // Disable tracking checks if current pointer equals total server page ceilings
          setHasMore(targetPage < (result.meta?.totalPages || 1));
        } else {
          throw new Error(result.message || "Failed to load tuitions feed.");
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        toast.error(error.message || "Network layer processing failure.");
      } finally {
        setIsInitialLoading(false);
        setIsFetchingNextPage(false);
      }
    },
    [],
  );

  // Handle live card filtering out of memory state trees after successful deletion calls
  const handleItemOmittedFromFeed = useCallback((id: string) => {
    setTuitions((prev) => {
      const updated = prev.filter((item) => item.id !== id);
      return updated;
    });
  }, []);

  // Trigger base level content dump during structural mounting
  useEffect(() => {
    fetchTuitionFeed(1, true);
    setPage(1);
  }, [fetchTuitionFeed]);

  // Set up native intersection runtime tracking layers
  useEffect(() => {
    const sentinelElement = observerSentinelRef.current;
    if (!sentinelElement || !hasMore || isInitialLoading || isFetchingNextPage)
      return;

    const nativeObserver = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          const nextPage = page + 1;
          setPage(nextPage);
          fetchTuitionFeed(nextPage);
        }
      },
      { threshold: 0.1, rootMargin: "100px" }, // Pre-fetches 100px before reaching screen bounds
    );

    nativeObserver.observe(sentinelElement);

    return () => {
      if (sentinelElement) nativeObserver.unobserve(sentinelElement);
    };
  }, [
    page,
    hasMore,
    isInitialLoading,
    isFetchingNextPage,
    fetchTuitionFeed,
    handleItemOmittedFromFeed,
  ]);

  const handleManualRefreshReset = () => {
    setPage(1);
    fetchTuitionFeed(1, true);
  };

  return (
    <div className="space-y-6 md:p-4 max-w-6xl mx-auto mb-20">
      {/* Interactive Title Heading Banner Layout */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-background md:border md:border-border md:p-5 rounded-2xl shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-primary/10 rounded-xl text-primary">
            <Briefcase size={24} />
          </div>
          <div>
            <h1 className="text-xl font-black text-text-main tracking-tight">
              Tuition Requirements Stream
            </h1>
            <p className="text-xs text-text-muted mt-0.5">
              Infinite scrolling pipeline grid audit for platform placement
              validation logs.
            </p>
          </div>
        </div>

        <button
          disabled={isInitialLoading || isFetchingNextPage}
          onClick={handleManualRefreshReset}
          className="cursor-pointer inline-flex items-center gap-2 px-4 py-2.5 border border-border hover:bg-surface-hover rounded-xl text-xs font-bold text-text-muted hover:text-text-main transition-all active:scale-95 disabled:opacity-40 shrink-0 self-start sm:self-center"
        >
          <RefreshCw
            size={14}
            className={isInitialLoading ? "animate-spin" : ""}
          />
          Reset Stream View
        </button>
      </div>

      {/* Main Stream Interface Renderer */}
      {isInitialLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(4)].map((_, idx) => (
            <div
              key={idx}
              className="h-56 w-full animate-pulse bg-surface md:border md:border-border md:rounded-2xl"
            />
          ))}
        </div>
      ) : tuitions.length > 0 ? (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tuitions.map((tuition) => (
              <AdminTuitionCard
                key={tuition.id}
                tuition={tuition}
                onDeleted={handleItemOmittedFromFeed}
              />
            ))}
          </div>

          {/* Hidden Anchor Element Watcher to Trigger Next Dynamic Pages Fetching */}
          <div
            ref={observerSentinelRef}
            className="w-full flex justify-center py-6 h-10"
          >
            {isFetchingNextPage && (
              <div className="flex items-center gap-2 text-xs font-bold text-text-muted animate-pulse">
                <Loader2 size={14} className="animate-spin text-primary" />
                <span>Loading older postings data records...</span>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="text-center py-24 bg-surface-hover/20 rounded-3xl border border-dashed border-border p-6">
          <p className="text-sm font-bold text-text-muted">
            No active tuition requirements posted on file inside database
            cluster indices.
          </p>
        </div>
      )}
    </div>
  );
}

// Sealed Export entry to guarantee build compilation success
export default function AdminTuitionsDirectoryPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-6xl mx-auto p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(4)].map((_, idx) => (
            <div
              key={idx}
              className="h-56 w-full animate-pulse bg-surface md:border md:border-border md:rounded-2xl"
            />
          ))}
        </div>
      }
    >
      <AdminTuitionsFeedContent />
    </Suspense>
  );
}
