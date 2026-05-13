"use client";

import { useState } from "react";
import Image from "next/image";
import { MoreHorizontal, Star, Edit2, Trash2, X, Check } from "lucide-react";
import { Review } from "@/types/user";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import Button from "@/components/ui/Button";

interface ReviewCardProps {
  review: Review;
  currentUserId?: string;
  onUpdate: (id: string, comment: string, rating: number) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export default function ReviewCard({
  review,
  currentUserId,
  onUpdate,
  onDelete,
}: ReviewCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [showOptions, setShowOptions] = useState(false);

  // Edit States
  const [editComment, setEditComment] = useState(review.comment);
  const [editRating, setEditRating] = useState(review.rating);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isOwner = currentUserId === review.reviewerId;

  const handleSave = async () => {
    setIsSubmitting(true);
    await onUpdate(review.id, editComment, editRating);
    setIsSubmitting(false);
    setIsEditing(false);
  };

  return (
    <div className="group relative bg-background border border-border rounded-3xl p-5 transition-all hover:border-primary/20">
      <div className="flex gap-4">
        {/* Reviewer Avatar */}
        <div className="shrink-0 w-12 h-12 rounded-2xl bg-surface-hover overflow-hidden relative">
          {review?.reviewer?.photo ? (
            <Image
              src={review.reviewer.photo}
              alt={review.reviewer.name}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center font-bold text-primary">
              {review.reviewer.name[0]}
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-1">
            <div>
              <h4 className="font-bold text-text-main truncate">
                {review.reviewer.name}
              </h4>
              <p className="text-[10px] text-text-muted font-medium">
                {formatDistanceToNow(new Date(review.createdAt), {
                  addSuffix: true,
                })}
              </p>
            </div>

            {/* Facebook-style Ellipsis Menu */}
            {isOwner && !isEditing && (
              <div className="relative">
                <button
                  onClick={() => setShowOptions(!showOptions)}
                  className="p-1 hover:bg-surface-hover rounded-lg transition-colors text-text-muted hover:text-text-main"
                >
                  <MoreHorizontal size={20} />
                </button>

                {showOptions && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setShowOptions(false)}
                    />
                    <div className="absolute right-0 mt-1 w-32 bg-background border border-border rounded-xl shadow-xl z-20 overflow-hidden">
                      <button
                        onClick={() => {
                          setIsEditing(true);
                          setShowOptions(false);
                        }}
                        className="w-full px-4 py-2 text-xs font-bold text-left hover:bg-surface-hover flex items-center gap-2"
                      >
                        <Edit2 size={14} /> Edit
                      </button>
                      <button
                        onClick={() => {
                          onDelete(review.id);
                          setShowOptions(false);
                        }}
                        className="w-full px-4 py-2 text-xs font-bold text-left hover:bg-surface-hover text-red-500 flex items-center gap-2"
                      >
                        <Trash2 size={14} /> Delete
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Rating Stars */}
          <div className="flex items-center gap-0.5 mb-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                size={14}
                className={cn(
                  "transition-colors",
                  star <= (isEditing ? editRating : review.rating)
                    ? "fill-yellow-500 text-yellow-500"
                    : "text-border fill-transparent",
                  isEditing && "cursor-pointer hover:scale-110",
                )}
                onClick={() => isEditing && setEditRating(star)}
              />
            ))}
          </div>

          {/* Comment Area */}
          {isEditing ? (
            <div className="space-y-3 mt-2">
              <textarea
                value={editComment}
                onChange={(e) => setEditComment(e.target.value)}
                className="w-full bg-surface-hover border border-border rounded-2xl p-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none min-h-25 resize-none"
                placeholder="Write your update..."
              />
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  className="py-2 px-4 text-xs h-9"
                  onClick={() => setIsEditing(false)}
                  disabled={isSubmitting}
                >
                  <X size={14} className="mr-1" /> Cancel
                </Button>
                <Button
                  variant="primary"
                  className="py-2 px-4 text-xs h-9"
                  onClick={handleSave}
                  isLoading={isSubmitting}
                >
                  <Check size={14} className="mr-1" /> Save
                </Button>
              </div>
            </div>
          ) : (
            <p className="text-sm text-text-muted leading-relaxed whitespace-pre-wrap">
              {review.comment}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
