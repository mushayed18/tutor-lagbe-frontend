"use client";

import { useEffect, useState } from "react";
import { fetcher } from "@/lib/api-client";
import { useInView } from "react-intersection-observer";
import { BellOff } from "lucide-react";
// Reusing your existing components
import NotificationItem from "@/components/notifications/NotificationItem";
import NotificationSkeleton from "@/components/notifications/NotificationSkeleton";
import { useNotifications } from "@/providers/NotificationProvider";

export default function ParentNotificationsPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [notifications, setNotifications] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const { refreshCount } = useNotifications();
  const { ref, inView } = useInView();

  // 1. Mark as read when Parent visits the page
  useEffect(() => {
    const markAsRead = async () => {
      try {
        await fetcher("/notifications/mark-as-read", { method: "PATCH" });
        refreshCount();
      } catch (error) {
        console.error("Failed to mark notifications as read:", error);
      }
    };

    markAsRead();
  }, [refreshCount]);

  // 2. Infinite Scroll Loading Logic
  const loadNotifications = async () => {
    if (isLoading || !hasMore) return;
    setIsLoading(true);

    try {
      const response = await fetcher(`/notifications?page=${page}&limit=10`);
      const result = await response.json();

      if (result.success) {
        const newData = result.data.data;
        // If we get fewer items than the limit, it means there are no more pages
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
        <h1 className="text-2xl font-black text-text-main flex items-center gap-2">
          Notifications
        </h1>
        <p className="text-text-muted text-sm font-medium">
          Manage your job applications and system updates.
        </p>
      </div>

      {/* Notifications List */}
      <div className="flex flex-col bg-background rounded-4xl overflow-hidden shadow-sm">
        {notifications.map((n) => (
          <NotificationItem key={n.id} notification={n} />
        ))}

        {/* Empty State */}
        {!isLoading && notifications.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 bg-surface-hover rounded-full flex items-center justify-center mb-4">
              <BellOff size={28} className="text-text-muted/50" />
            </div>
            <h3 className="text-lg font-bold text-text-main">All caught up!</h3>
            <p className="text-text-muted text-sm px-10">
              No new updates for your tuition posts right now.
            </p>
          </div>
        )}
      </div>

      {/* Loading & End of Content States */}
      <div ref={ref} className="mt-6">
        {isLoading && (
          <div className="flex flex-col gap-2">
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
