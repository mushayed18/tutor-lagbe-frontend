"use client";

import { useEffect, useState } from "react";
import { fetcher } from "@/lib/api-client";
import { useInView } from "react-intersection-observer";
import { Inbox } from "lucide-react";
import ApplicationItem from "@/components/applications/ApplicationItem";

interface Application {
  id: string;
  tuitionId: string;
  tuitionTitle: string;
  status: string;
  createdAt: string;
}

export default function MyApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const { ref, inView } = useInView();

  const fetchApplications = async () => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    try {
      // Your backend returns { data: { data: [...], meta: {...} } }
      const response = await fetcher(`/applications/my?page=${page}&limit=10`);
      const result = await response.json();

      if (result.success) {
        const newApps = result.data.data;

        if (newApps.length < 10) {
          setHasMore(false);
        }

        setApplications((prev) => [...prev, ...newApps]);
        setPage((prev) => prev + 1);
      }
    } catch (error) {
      console.error("Failed to fetch applications", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (inView) {
      fetchApplications();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView]);

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 pb-20">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-text-main">My Applications</h1>
        <p className="text-text-muted text-sm">
          Track the status of your sent tuition requests.
        </p>
      </div>

      {/* List Container */}
      <div className="flex flex-col">
        {applications.map((app) => (
          <ApplicationItem key={app.id} application={app} />
        ))}
      </div>

      {/* Empty State */}
      {!isLoading && applications.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 bg-background border border-dashed border-border rounded-2xl text-center">
          <div className="bg-surface-hover p-4 rounded-full mb-4">
            <Inbox size={40} className="text-text-muted" />
          </div>
          <h3 className="text-lg font-semibold text-text-main">
            No applications yet
          </h3>
          <p className="text-text-muted text-sm max-w-62.5">
            Apply to tuition posts from the feed to see them tracked here.
          </p>
        </div>
      )}

      {/* Loading & Observer Trigger */}
      <div ref={ref} className="py-8">
        {isLoading && (
          <div className="flex flex-col gap-3">
            {/* Using a simpler skeleton loader here */}
            <div className="w-full h-20 bg-surface-hover animate-pulse rounded-xl" />
            <div className="w-full h-20 bg-surface-hover animate-pulse rounded-xl" />
          </div>
        )}

        {!hasMore && applications.length > 0 && (
          <p className="text-center text-text-muted text-xs pt-4 italic">
            Showing all applications
          </p>
        )}
      </div>
    </div>
  );
}
