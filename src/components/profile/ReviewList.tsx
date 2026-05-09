"use client";

import { useEffect, useState, useRef } from "react";
import { fetcher } from "@/lib/api-client";
import ReviewCard from "./ReviewCard";
import { Loader2, MessageSquareText } from "lucide-react";

interface ReviewListProps {
  userId: string;
}

export default function ReviewList({ userId }: ReviewListProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [reviews, setReviews] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  // Ref for the "bottom of the list" element
  const observerTarget = useRef(null);

  const fetchReviews = async () => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    try {
      const res = await fetcher(`/reviews/user/${userId}?page=${page}&limit=5`);
      const result = await res.json();

      if (result.success) {
        setReviews((prev) => [...prev, ...result.data]);
        setHasMore(
          result.data.length > 0 && result.meta.page < result.meta.totalPage,
        );
        setPage((prev) => prev + 1);
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) {
          fetchReviews();
        }
      },
      { threshold: 1.0 },
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasMore, page]);

  return (
    <div className="mt-8">
      <div className="flex items-center gap-2 mb-6">
        <MessageSquareText size={20} className="text-primary" />
        <h2 className="text-lg font-bold text-text-main">User Reviews</h2>
      </div>

      {reviews.length === 0 && !isLoading ? (
        <div className="text-center py-10 border border-dashed border-border rounded-2xl text-text-muted text-sm">
          No reviews yet.
        </div>
      ) : (
        <div className="flex flex-col">
          {reviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      )}

      {/* Observer Target & Loading State */}
      <div
        ref={observerTarget}
        className="h-10 flex justify-center items-center mt-4"
      >
        {isLoading && (
          <div className="flex items-center gap-2 text-primary font-medium text-sm">
            <Loader2 size={18} className="animate-spin" />
            <span>Loading more...</span>
          </div>
        )}
        {!hasMore && reviews.length > 0 && (
          <p className="text-xs text-text-muted">
            You&apos;ve reached the end of reviews.
          </p>
        )}
      </div>
    </div>
  );
}
