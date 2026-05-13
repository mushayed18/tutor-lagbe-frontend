"use client";

import { useState } from "react";
import { Star, SendHorizontal, MessageSquarePlus, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import Button from "../ui/Button";

interface ReviewFormProps {
  onPost: (comment: string, rating: number) => Promise<void>;
}

export default function ReviewForm({ onPost }: ReviewFormProps) {
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const maxLength = 500;

  const handleSubmit = async () => {
    if (!comment.trim() || rating === 0) return;
    setIsSubmitting(true);
    await onPost(comment, rating);
    setComment("");
    setRating(0);
    setIsSubmitting(false);
  };

  return (
    <div className="bg-background md:border md:border-border md:rounded-4xl md:p-6 mb-10 shadow-sm relative overflow-hidden group">
      {/* Subtle Background Accent */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl rounded-full -mr-16 -mt-16" />

      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
            <MessageSquarePlus size={20} />
          </div>
          <div>
            <h4 className="text-base font-black text-text-main">
              Leave a Review
            </h4>
            <p className="text-[10px] text-text-muted font-bold uppercase tracking-wider">
              Share your verified experience
            </p>
          </div>
        </div>

        {/* Professional Star Rating */}
        <div className="flex flex-col gap-2 mb-6 bg-surface-hover/50 p-4 rounded-2xl border border-border/50">
          <span className="text-[10px] font-black text-text-muted uppercase tracking-tighter">
            Overall Rating
          </span>
          <div className="flex gap-1.5">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => setRating(star)}
                className="cursor-pointer transition-transform active:scale-90"
              >
                <Star
                  size={24}
                  className={cn(
                    "transition-all duration-200",
                    star <= (hoverRating || rating)
                      ? "fill-yellow-400 text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.3)]"
                      : "text-border fill-transparent",
                  )}
                />
              </button>
            ))}
            {rating > 0 && (
              <span className="ml-2 text-xs font-black text-yellow-600 self-center bg-yellow-500/10 px-2 py-0.5 rounded-md">
                {rating}.0
              </span>
            )}
          </div>
        </div>

        {/* Textarea with Counter */}
        <div className="relative">
          <textarea
            className="w-full bg-surface-hover/30 border border-border rounded-2xl p-4 text-sm min-h-30 outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/20 transition-all resize-none placeholder:text-text-muted/50"
            placeholder="What was it like working with this parent? (e.g., communication, punctuality, environment...)"
            value={comment}
            onChange={(e) => setComment(e.target.value.slice(0, maxLength))}
          />

          <div className="flex items-center justify-between mt-3 px-1">
            <div className="flex items-center gap-1.5 text-text-muted italic text-[11px]">
              <Info size={14} />
              <span>Visible to all tutors</span>
            </div>

            <div className="flex items-center gap-4">
              <span
                className={cn(
                  "text-[10px] font-bold",
                  comment.length >= maxLength
                    ? "text-red-500"
                    : "text-text-muted",
                )}
              >
                {comment.length} / {maxLength}
              </span>

              <Button
                onClick={handleSubmit}
                disabled={!comment.trim() || rating === 0 || isSubmitting}
                isLoading={isSubmitting}
                variant="primary"
                className="rounded-xl px-6 h-11 gap-2 font-black text-xs shadow-lg shadow-primary/20 transition-all hover:translate-y-0.5"
              >
                Post Review
                <SendHorizontal size={16} />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
