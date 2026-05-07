"use client";

import { useEffect, useState } from "react";
import { fetcher } from "@/lib/api-client";
import { TuitionPost } from "@/types/tuition";
import TuitionCard from "@/components/tuition/TuitionCard";
import { useInView } from "react-intersection-observer"; 
import TuitionSkeletonCard from "@/components/tuition/TuitionSkeleton";

export default function FeedPage() {
  const [posts, setPosts] = useState<TuitionPost[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  
  const { ref, inView } = useInView();

  const fetchPosts = async () => {
    if (isLoading || !hasMore) return;
    
    setIsLoading(true);
    try {
      const response = await fetcher(`/tuitions?page=${page}&limit=5`);
      const result = await response.json();
      
      if (result.success) {
        const newPosts = result.data;
        if (newPosts.length < 5) setHasMore(false);
        
        setPosts(prev => [...prev, ...newPosts]);
        setPage(prev => prev + 1);
      }
    } catch (error) {
      console.error("Failed to fetch tuitions", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Trigger fetch when user reaches the bottom
  useEffect(() => {
    if (inView) {
      fetchPosts();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView]);

  return (
    <div className="max-w-2xl mx-auto py-6 px-4 pb-24">
      <h1 className="text-xl font-bold mb-6">Tuition Feed</h1>

      <div className="flex flex-col">
        {posts.map((post) => (
          <TuitionCard key={post.id} post={post} />
        ))}
      </div>

      {/* Loading & Infinite Scroll Trigger */}
      <div ref={ref} className="py-10 flex flex-col gap-4">
        {isLoading && (
          <>
            <TuitionSkeletonCard />
            <TuitionSkeletonCard />
          </>
        )}
        {!hasMore && posts.length > 0 && (
          <p className="text-center text-text-muted text-sm">
            You&apos;ve caught up with everything! 🎉
          </p>
        )}
      </div>
    </div>
  );
}

