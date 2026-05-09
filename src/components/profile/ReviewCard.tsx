"use client";

import Image from "next/image";
import { User, Star } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface ReviewCardProps {
  review: {
    id: string;
    rating: number;
    comment: string;
    createdAt: string;
    reviewer: {
      name: string;
      photo: string | null;
    };
  };
}

export default function ReviewCard({ review }: ReviewCardProps) {
  return (
    <div className="py-5 border-b border-border last:border-0 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="flex gap-4">
        {/* Reviewer Avatar */}
        <div className="relative w-10 h-10 rounded-full bg-surface-hover overflow-hidden shrink-0">
          {review.reviewer.photo ? (
            <Image
              src={review.reviewer.photo}
              alt={review.reviewer.name}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-text-muted">
              <User size={20} />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 space-y-1">
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-bold text-text-main">
              {review.reviewer.name}
            </h4>
            <span className="text-[11px] text-text-muted">
              ( {formatDistanceToNow(new Date(review.createdAt), {
                addSuffix: true,
              })} )
            </span>
          </div>

          {/* Star Rating */}
          <div className="flex gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={12}
                className={
                  i < review.rating
                    ? "fill-amber-400 text-amber-400"
                    : "text-border fill-border"
                }
              />
            ))}
          </div>

          <p className="text-sm text-text-main/90 leading-relaxed pt-1">
            {review.comment}
          </p>
        </div>
      </div>
    </div>
  );
}
