"use client";

import { useEffect, useState } from "react";
import { fetcher } from "@/lib/api-client";
import { useInView } from "react-intersection-observer";
import { Users } from "lucide-react";
import ConnectionItem from "@/components/connections/ConnectionItem";

export default function MyConnectionsPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [connections, setConnections] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const { ref, inView } = useInView();

  const loadData = async () => {
    if (isLoading || !hasMore) return;
    setIsLoading(true);

    try {
      const response = await fetcher(
        `/hire-relations/my-connections?page=${page}&limit=12`,
      );
      const result = await response.json();

      if (result.success) {
        const newData = result.data.data;
        if (newData.length < 12) setHasMore(false);

        setConnections((prev) => [...prev, ...newData]);
        setPage((prev) => prev + 1);
      }
    } catch (error) {
      console.error("Error loading connections:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (inView) loadData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView]);

  return (
    <div className="max-w-3xl mx-auto min-h-screen pb-24">
      {/* Header Area */}
      <div className="p-6 bg-background/80 backdrop-blur-md sticky top-0 z-10">
        <h1 className="text-2xl font-bold text-text-main flex items-center gap-3">
          <Users className="text-primary" />
          My Jobs
        </h1>
      </div>

      {/* List Area */}
      <div className="flex flex-col">
        {connections.map((item, index) => (
          <ConnectionItem
            key={`${item.userId}-${item.tuitionId}-${index}`}
            connection={item}
          />
        ))}
      </div>

      {/* Empty State */}
      {!isLoading && connections.length === 0 && (
        <div className="flex flex-col items-center justify-center py-32 text-center px-4">
          <div className="w-20 h-20 bg-surface-hover rounded-full flex items-center justify-center mb-4">
            <Users size={32} className="text-text-muted opacity-20" />
          </div>
          <h3 className="text-lg font-bold text-text-main">
            No connections yet
          </h3>
          <p className="text-text-muted text-sm max-w-xs mx-auto">
            Apply to tuition posts to start connecting with parents.
          </p>
        </div>
      )}

      {/* Infinite Scroll Trigger */}
      <div ref={ref} className="p-8 flex justify-center">
        {isLoading && (
          <div className="flex flex-col gap-4 w-full px-4">
            {/* Simple skeleton animation */}
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex gap-4 items-center animate-pulse">
                <div className="w-14 h-14 rounded-full bg-surface-hover" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-32 bg-surface-hover rounded" />
                  <div className="h-3 w-48 bg-surface-hover rounded" />
                </div>
              </div>
            ))}
          </div>
        )}
        {!hasMore && connections.length > 0 && (
          <p className="text-xs text-text-muted italic">
            No more connections to show.
          </p>
        )}
      </div>
    </div>
  );
}
