"use client";

import { useEffect, useState } from "react";
import { fetcher } from "@/lib/api-client";
import TuitionCard from "@/components/tuition/TuitionCard";
import { TuitionPost } from "@/types/tuition";
import { BookmarkX } from "lucide-react";
import { useInView } from "react-intersection-observer"; 
import TuitionSkeletonCard from "@/components/tuition/TuitionSkeleton";

interface BookmarkItem {
  id: string;
  tuition: TuitionPost;
}

export default function MyBookmarksPage() {
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  
  // Intersection Observer hook
  const { ref, inView } = useInView({
    threshold: 0,
  });

  const fetchBookmarks = async () => {
    // Prevent duplicate calls if already loading or no more data
    if (isLoading || !hasMore) return;
    
    setIsLoading(true);
    try {
      const response = await fetcher(`/bookmarks?page=${page}&limit=5`);
      const result = await response.json();
      
      if (result.success) {
        const newBookmarks = result.data.data;
        
        // If we received fewer than 5 items, we've reached the end
        if (newBookmarks.length < 5) {
          setHasMore(false);
        }
        
        setBookmarks((prev) => [...prev, ...newBookmarks]);
        setPage((prev) => prev + 1);
      }
    } catch (error) {
      console.error("Failed to fetch bookmarks", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Trigger whenever the "ref" element enters the viewport
  useEffect(() => {
    if (inView) {
      fetchBookmarks();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView]);

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 pb-24">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-text-main">My Bookmarks</h1>
        <p className="text-text-muted text-sm">
          Tuition posts you have saved for later.
        </p>
      </div>

      {/* Bookmark List */}
      <div className="flex flex-col">
        {bookmarks.map((item) => (
          <TuitionCard
            key={item.id}
            // Spread tuition data and force isBookmarked to true
            post={{ ...item.tuition, isBookmarked: true }}
          />
        ))}
      </div>

      {/* Empty State */}
      {!isLoading && bookmarks.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 bg-background border border-dashed border-border rounded-2xl">
          <BookmarkX size={48} className="text-text-muted mb-4" />
          <h3 className="text-lg font-semibold text-text-main">
            No bookmarks yet
          </h3>
          <p className="text-text-muted text-sm">
            Save interesting posts to see them here.
          </p>
        </div>
      )}

      {/* Loading & Infinite Scroll Trigger */}
      <div ref={ref} className="py-6 flex flex-col gap-4">
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