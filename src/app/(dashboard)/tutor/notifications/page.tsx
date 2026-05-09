"use client";

import { useEffect, useState } from "react";
import { fetcher } from "@/lib/api-client";
import { useInView } from "react-intersection-observer";
import { BellOff } from "lucide-react";
import NotificationItem from "@/components/notifications/NotificationItem";
import NotificationSkeleton from "@/components/notifications/NotificationSkeleton";
import { useNotifications } from "@/providers/NotificationProvider";

export default function NotificationsPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [notifications, setNotifications] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  // 1. Get the refresh function from our provider
  const { refreshCount } = useNotifications();

  const { ref, inView } = useInView();

  useEffect(() => {
    const markAsRead = async () => {
      try {
        // This hits the PATCH route we created in the backend
        await fetcher("/notifications/mark-as-read", { method: "PATCH" });

        // This tells the Sidebar and BottomNav to hide the red badge
        refreshCount();
      } catch (error) {
        console.error("Failed to mark notifications as read:", error);
      }
    };

    markAsRead();
  }, [refreshCount]); // This runs once when the page opens

  const loadNotifications = async () => {
    if (isLoading || !hasMore) return;
    setIsLoading(true);

    try {
      const response = await fetcher(`/notifications?page=${page}&limit=10`);
      const result = await response.json();

      if (result.success) {
        const newData = result.data.data;
        if (newData.length < 10) setHasMore(false);

        setNotifications((prev) => [...prev, ...newData]);
        setPage((prev) => prev + 1);
      }
    } catch (error) {
      console.error("Error loading notifications:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (inView) loadNotifications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView]);

  return (
    <div className="max-w-2xl mx-auto py-8 px-4 pb-20">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-text-main flex items-center gap-2">
          Notifications
        </h1>
        <p className="text-text-muted text-sm">
          Stay updated with your latest activities.
        </p>
      </div>

      <div className="flex flex-col">
        {notifications.map((n) => (
          <NotificationItem key={n.id} notification={n} />
        ))}
      </div>

      {/* Empty State */}
      {!isLoading && notifications.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-20 h-20 bg-surface-hover rounded-full flex items-center justify-center mb-4">
            <BellOff size={32} className="text-text-muted" />
          </div>
          <h3 className="text-lg font-bold text-text-main">All caught up!</h3>
          <p className="text-text-muted text-sm">
            No notifications found at the moment.
          </p>
        </div>
      )}

      {/* Intersection Observer Trigger */}
      <div ref={ref} className="w-full">
        {" "}
        {/* Remove flex-center from the wrapper */}
        {isLoading && (
          <div className="flex flex-col gap-1 w-full">
            {" "}
            {/* Add a column container */}
            <NotificationSkeleton />
            <NotificationSkeleton />
            <NotificationSkeleton />
          </div>
        )}
        {!hasMore && notifications.length > 0 && (
          <div className="py-10 text-center">
            {" "}
            {/* Center the text specifically */}
            <p className="text-xs text-text-muted italic underline decoration-primary/20 underline-offset-4">
              You&apos;ve reached the end of your notifications.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
