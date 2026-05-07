"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import {
  MapPin,
  Clock,
  Calendar,
  Bookmark,
  Send,
  Eye,
  Crown,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { TuitionPost } from "@/types/tuition";
import { fetcher } from "@/lib/api-client";
import { toast } from "sonner";

// Import our sub-components
import { Detail } from "./card-items/Detail";
import { ActionButton } from "./card-items/ActionButton";

export default function TuitionCard({ post }: { post: TuitionPost }) {
  const [isBookmarked, setIsBookmarked] = useState(post.isBookmarked);
  const [isPending, setIsPending] = useState(false);

  const isPremium = post.parent.subscriptionType === "PREMIUM";
  const isClosed = post.status === "CLOSED";

  const handleBookmark = async () => {
    if (isPending) return;
    setIsPending(true);

    try {
      if (isBookmarked) {
        // DELETE Route: /bookmarks/:tuitionId
        const res = await fetcher(`/bookmarks/${post.id}`, {
          method: "DELETE",
        });
        if (res.ok) {
          setIsBookmarked(false);
          toast.success("Bookmark removed");
        }
      } else {
        // POST Route: /bookmarks (Body: { tuitionId })
        const res = await fetcher("/bookmarks", {
          method: "POST",
          body: JSON.stringify({ tuitionId: post.id }),
        });
        if (res.ok) {
          setIsBookmarked(true);
          toast.success("Saved to bookmarks");
        }
      }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error("Action failed. Try again.");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div
      className={cn(
        "bg-background lg:border border-border rounded-xl lg:p-4 mb-4 transition-all hover:border-primary/50",
        isPremium && "border-primary/20 bg-primary/2",
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-surface-hover overflow-hidden relative border border-border">
            {post.parent.photo ? (
              <Image
                src={post.parent.photo}
                alt={post.parent.name}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center font-bold text-primary">
                {post.parent.name[0]}
              </div>
            )}
          </div>
          <div>
            <h4 className="text-sm font-bold flex items-center gap-1">
              {post.parent.name}
              {isPremium && (
                <Crown size={14} className="text-yellow-500 fill-yellow-500" />
              )}
            </h4>
            <p className="text-[10px] text-text-muted">
              {formatDistanceToNow(new Date(post.createdAt))} ago
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className={cn(isClosed && "opacity-60")}>
        <h3 className="text-lg font-bold text-text-main mb-2 leading-tight">
          {post.title}
        </h3>
        <p className="text-text-muted text-sm mb-4 leading-relaxed line-clamp-2">
          {post.description}
        </p>

        <div className="grid grid-cols-2 gap-y-2 gap-x-4 mb-4">
          <Detail icon={MapPin} label={post.location} />
          <Detail icon={Calendar} label={`${post.daysPerWeek} days/week`} />
          <Detail icon={Clock} label={post.timeSlot} />
          <div className="flex items-center gap-2 text-primary font-bold text-sm">
            ৳ {post.salary.toLocaleString()} / month
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-border">
        {/* Custom Toggle for Bookmark */}
        <button
          onClick={handleBookmark}
          disabled={isPending}
          className={cn(
            "flex cursor-pointer items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold transition-all active:scale-95",
            isBookmarked
              ? "text-primary bg-primary/5"
              : "text-text-muted hover:bg-surface-hover",
          )}
        >
          {isPending ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            <Bookmark
              size={18}
              className={cn(isBookmarked && "fill-primary")}
            />
          )}
          <span>{isBookmarked ? "Saved" : "Save"}</span>
        </button>

        <ActionButton
          icon={Send}
          label={isClosed ? "Closed" : "Apply"}
          primary
          disabled={isClosed}
        />

        <Link href={`/tutor/feed/${post.id}`}>
          <ActionButton icon={Eye} label="Details" />
        </Link>
      </div>
    </div>
  );
}
