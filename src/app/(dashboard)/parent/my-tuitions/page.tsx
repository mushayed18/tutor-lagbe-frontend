"use client";

import { useEffect, useState } from "react";
import { fetcher } from "@/lib/api-client";
import { TuitionPost } from "@/types/tuition";
import ParentTuitionCard from "@/components/parent/ParentTuitionCard";
import { useInView } from "react-intersection-observer";
import TuitionSkeletonCard from "@/components/tuition/TuitionSkeleton";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { toast } from "sonner";

export default function MyTuitionsPage() {
  const [posts, setPosts] = useState<TuitionPost[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  // Modal deletion lifecycle state variables
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const { ref, inView } = useInView();

  const fetchMyPosts = async () => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    try {
      // API call targeting the custom response structures
      const response = await fetcher(`/tuitions/my-posts?page=${page}&limit=5`);
      const result = await response.json();

      if (result.success) {
        const newPosts = result.data.data; // Reading array out from data.data context wrapper

        if (newPosts.length < 5) {
          setHasMore(false);
        }

        setPosts((prev) => [...prev, ...newPosts]);
        setPage((prev) => prev + 1);
      }
    } catch (error) {
      console.error("Failed to fetch personal tuition posts:", error);
      toast.error("Could not load your posts.");
    } finally {
      setIsLoading(false);
    }
  };

  // Infinite Scroll Trigger Hook setup
  useEffect(() => {
    if (inView) {
      fetchMyPosts();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView]);

  // Handles initializing modal intent
  const handleDeleteClick = (postId: string) => {
    setSelectedPostId(postId);
    setIsModalOpen(true);
  };

  // Execution call targeting the endpoint deletion process
  const handleConfirmDelete = async () => {
    if (!selectedPostId) return;
    setIsDeleting(true);

    try {
      const response = await fetcher(`/tuitions/${selectedPostId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        // Optimistically clean the internal post stack view instance arrays
        setPosts((prev) => prev.filter((post) => post.id !== selectedPostId));
        toast.success("Tuition post deleted successfully");
        setIsModalOpen(false);
      } else {
        toast.error("Failed to delete the post");
      }
    } catch (error) {
      console.error("Deletion error occurred:", error);
      toast.error("Something went wrong. Try again.");
    } finally {
      setIsDeleting(false);
      setSelectedPostId(null);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-6 px-4 pb-24">
      <h1 className="text-xl font-bold mb-6">My Posted Tuitions</h1>

      <div className="flex flex-col">
        {posts.map((post) => (
          <ParentTuitionCard
            key={post.id}
            post={post}
            onDeleteClick={handleDeleteClick}
          />
        ))}
      </div>

      {/* Fallback layout context states for clear operational visibility */}
      {!isLoading && posts.length === 0 && (
        <div className="text-center py-12 border border-dashed border-border rounded-xl bg-background">
          <p className="text-text-muted text-sm">
            You haven&apos;t posted any tuition jobs yet.
          </p>
        </div>
      )}

      {/* Loading & Infinite Scroll Trigger Observer target panel */}
      <div ref={ref} className="py-10 flex flex-col gap-4">
        {isLoading && (
          <>
            <TuitionSkeletonCard />
            <TuitionSkeletonCard />
          </>
        )}
        {!hasMore && posts.length > 0 && (
          <p className="text-center text-text-muted text-sm">
            End of your posted listings! 🎉
          </p>
        )}
      </div>

      {/* Confirmation Modal layout insertion */}
      <ConfirmModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedPostId(null);
        }}
        onConfirm={handleConfirmDelete}
        isLoading={isDeleting}
        title="Delete Tuition Post"
        message="Are you absolutely sure you want to delete this tuition posting? All applications associated with it will be permanently removed. This action cannot be undone."
      />
    </div>
  );
}
