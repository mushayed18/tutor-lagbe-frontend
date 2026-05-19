"use client";

import Image from "next/image";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import {
  MapPin,
  Clock,
  Calendar,
  Crown,
  Edit2,
  Trash2,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { TuitionPost } from "@/types/tuition";
import { Detail } from "../tuition/card-items/Detail";

interface ParentTuitionCardProps {
  post: TuitionPost;
  onDeleteClick: (postId: string) => void;
}

export default function ParentTuitionCard({
  post,
  onDeleteClick,
}: ParentTuitionCardProps) {
  const isPremium = post.parent.subscriptionType === "PREMIUM";
  const isClosed = post.status === "CLOSED";

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
          <div className="w-12 md:w-14 h-12 md:h-14 rounded-full bg-surface-hover overflow-hidden relative border border-border">
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
              <span className="text-text-main cursor-default">
                {post.parent.name}
              </span>
              {isPremium && (
                <Crown size={14} className="text-yellow-500 fill-yellow-500" />
              )}
            </h4>
            <p className="text-[10px] text-text-muted">
              {formatDistanceToNow(new Date(post.createdAt))} ago
            </p>
          </div>
        </div>

        {/* Status Indicator Badge */}
        <span
          className={cn(
            "text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider",
            isClosed
              ? "bg-muted text-text-muted"
              : "bg-green-500/10 text-green-600 border border-green-500/20",
          )}
        >
          {post.status}
        </span>
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

      {/* Management Action Footer */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-4 border-t border-border mt-2">
        {/* Applications Action (Left side) */}
        <Link href={`/parent/my-posts/applications/${post.id}`}>
          <button className="flex cursor-pointer items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold text-primary bg-primary/5 hover:bg-primary/10 transition-all active:scale-95">
            <Users size={16} />
            <span>Applications ({post.applicationsCount})</span>
          </button>
        </Link>

        {/* Edit & Delete Actions (Right side) */}
        <div className="flex items-center gap-2">
          <Link href={`/parent/my-posts/edit/${post.id}`}>
            <button className="flex cursor-pointer items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold text-text-muted hover:bg-surface-hover transition-all active:scale-95">
              <Edit2 size={16} />
              <span>Edit</span>
            </button>
          </Link>

          <button
            onClick={() => onDeleteClick(post.id)}
            className="flex cursor-pointer items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold text-red-600 hover:bg-red-500/5 transition-all active:scale-95"
          >
            <Trash2 size={16} />
            <span>Delete</span>
          </button>
        </div>
      </div>
    </div>
  );
}
