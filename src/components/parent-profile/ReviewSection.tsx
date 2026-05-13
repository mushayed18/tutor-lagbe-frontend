"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { fetcher } from "@/lib/api-client";
import { Review } from "@/types/user";
import ReviewCard from "./ReviewCard";
import ReviewSkeleton from "./ReviewSkeleton";
import { toast } from "sonner";
import { useAuth } from "@/providers/AuthProvider";
import ReviewForm from "./ReviewForm";

export default function ReviewSection({
  targetUserId,
}: {
  targetUserId: string;
}) {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [canReview, setCanReview] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const observer = useRef<IntersectionObserver | null>(null);

  const loadReviews = useCallback(async () => {
    try {
      const res = await fetcher(
        `/reviews/user/${targetUserId}?page=${page}&limit=5`,
      );
      const result = await res.json();
      if (result.success) {
        setReviews((prev) =>
          page === 1 ? result.data : [...prev, ...result.data],
        );
        setHasMore(
          result.data.length > 0 && result.meta.page < result.meta.totalPage,
        );
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error("Failed to load reviews");
    } finally {
      setIsLoading(false);
    }
  }, [targetUserId, page]);

  useEffect(() => {
    loadReviews();
  }, [loadReviews]);

  // Last Element Observer for Infinite Scroll
  const lastElementRef = useCallback(
    (node: HTMLDivElement) => {
      if (isLoading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prev) => prev + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [isLoading, hasMore],
  );

  useEffect(() => {
    const checkEligibility = async () => {
      if (!user) return;
      try {
        // You'll need to create this endpoint or use a similar logic
        const res = await fetcher(`/reviews/check-eligibility/${targetUserId}`);
        const result = await res.json();
        setCanReview(result.canReview); // true if hired AND hasn't reviewed yet
      } catch (error) {
        console.error("Eligibility check failed", error);
      }
    };
    checkEligibility();
  }, [targetUserId, user]);

  const handleCreateReview = async (comment: string, rating: number) => {
    try {
      const res = await fetcher("/reviews", {
        method: "POST",
        body: JSON.stringify({ targetUserId, comment, rating }),
      });
      const result = await res.json();

      if (result.success) {
        // Add new review to the TOP of the list instantly
        setReviews((prev) => [result.data, ...prev]);
        setCanReview(false); // Hide the form after posting
        toast.success("Review posted successfully!");
      }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error("Failed to post review");
    }
  };

  const handleUpdateReview = async (
    id: string,
    comment: string,
    rating: number,
  ) => {
    try {
      const res = await fetcher(`/reviews/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ comment, rating }),
      });
      if (res.ok) {
        setReviews((prev) =>
          prev.map((r) => (r.id === id ? { ...r, comment, rating } : r)),
        );
        toast.success("Review updated");
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error("Update failed");
    }
  };

  const handleDeleteReview = async (id: string) => {
    if (!confirm("Are you sure you want to delete this review?")) return;
    try {
      const res = await fetcher(`/reviews/${id}`, { method: "DELETE" });
      if (res.ok) {
        setReviews((prev) => prev.filter((r) => r.id !== id));
        toast.success("Review deleted");
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="space-y-6 mt-10">
      <h3 className="text-xl font-black text-text-main flex items-center gap-3 px-2">
        Tutor Reviews
        <span className="text-sm font-bold text-primary bg-primary/5 px-3 py-1 rounded-full">
          {reviews.length > 0 ? reviews.length : 0}
        </span>
      </h3>

      {canReview && <ReviewForm onPost={handleCreateReview} />}

      <div className="space-y-4">
        {reviews.map((review, index) => (
          <div
            key={review.id}
            ref={index === reviews.length - 1 ? lastElementRef : null}
          >
            <ReviewCard
              review={review}
              currentUserId={user?.id}
              onUpdate={handleUpdateReview}
              onDelete={handleDeleteReview}
            />
          </div>
        ))}

        {isLoading &&
          Array.from({ length: 3 }).map((_, i) => <ReviewSkeleton key={i} />)}

        {!hasMore && reviews.length > 0 && (
          <p className="text-center text-text-muted text-xs font-medium py-6">
            You&apos;ve reached the end of the reviews.
          </p>
        )}

        {reviews.length === 0 && !isLoading && (
          <div className="text-center py-20 bg-surface-hover/50 rounded-4xl border border-dashed border-border">
            <p className="text-text-muted font-medium">
              No reviews yet for this parent.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
