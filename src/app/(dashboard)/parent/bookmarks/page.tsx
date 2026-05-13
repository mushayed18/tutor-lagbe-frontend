"use client";

import { useEffect, useState } from "react";
import { fetcher } from "@/lib/api-client";
import TuitionCard from "@/components/tuition/TuitionCard";
import { TuitionPost } from "@/types/tuition";
import { BookmarkX, Bookmark } from "lucide-react";
import { useInView } from "react-intersection-observer";
import TuitionSkeletonCard from "@/components/tuition/TuitionSkeleton";

interface BookmarkItem {
  id: string;
  tuition: TuitionPost;
}

export default function ParentBookmarksPage() {
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const { ref, inView } = useInView({ threshold: 0 });

  const fetchBookmarks = async () => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    try {
      const response = await fetcher(`/bookmarks?page=${page}&limit=5`);
      const result = await response.json();

      if (result.success) {
        const newBookmarks = result.data.data;
        if (newBookmarks.length < 5) setHasMore(false);

        setBookmarks((prev) => [...prev, ...newBookmarks]);
        setPage((prev) => prev + 1);
      }
    } catch (error) {
      console.error("Failed to fetch bookmarks", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (inView) fetchBookmarks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView]);

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 pb-24">
      <div className="mb-8">
        <h1 className="text-2xl font-black text-text-main flex items-center gap-2">
          Saved Tuitions{" "}
          <Bookmark className="text-primary fill-primary" size={24} />
        </h1>
        <p className="text-text-muted text-sm font-medium">
          Posts from other parents you&apos;ve saved for reference.
        </p>
      </div>

      {/* Bookmark List */}
      <div className="flex flex-col">
        {bookmarks.map((item) => (
          <TuitionCard
            key={item.id}
            // Smart Card will hide 'Apply' button because user is a Parent
            post={{ ...item.tuition, isBookmarked: true }}
          />
        ))}
      </div>

      {/* Empty State */}
      {!isLoading && bookmarks.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 bg-background border-2 border-dashed border-border rounded-4xl">
          <div className="w-16 h-16 bg-surface-hover rounded-full flex items-center justify-center mb-4">
            <BookmarkX size={32} className="text-text-muted opacity-30" />
          </div>
          <h3 className="text-lg font-bold text-text-main">
            Your bookmark list is empty
          </h3>
          <p className="text-text-muted text-sm max-w-50 text-center font-medium">
            Save interesting posts from the marketplace to see them here.
          </p>
        </div>
      )}

      {/* Infinite Scroll Trigger */}
      <div ref={ref} className="py-10 flex flex-col gap-4">
        {isLoading && (
          <>
            <TuitionSkeletonCard />
            <TuitionSkeletonCard />
          </>
        )}
        {!hasMore && bookmarks.length > 0 && (
          <p className="text-center text-text-muted text-sm py-4">
            You&apos;ve reached the end of your saved posts.
          </p>
        )}
      </div>
    </div>
  );
}
