"use client";

import { TuitionPost } from "@/types/tuition";
import Image from "next/image";
import {
  MapPin,
  Clock,
  Calendar,
  Bookmark,
  Send,
  Eye,
  Crown,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function TuitionCard({ post }: { post: TuitionPost }) {
  const isPremium = post.parent.subscriptionType === "PREMIUM";
  const isClosed = post.status === "CLOSED";

  return (
    <div
      className={cn(
        "bg-background lg:border border-border rounded-xl lg:p-4 mb-4 transition-all hover:border-primary/50",
        isPremium && "border-primary/20 bg-primary/2",
      )}
    >
      {/* Header: User Info & Featured Badge */}
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
        {isPremium && (
          <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-1 rounded-full uppercase">
            Featured
          </span>
        )}
      </div>

      {/* Content */}
      <div className={cn(isClosed && "opacity-60")}>
        <h3 className="text-lg font-bold text-text-main mb-2 leading-tight">
          {post.title}
        </h3>

        <p className="text-text-muted text-sm mb-4 leading-relaxed">
          {post.description}
        </p>

        {/* Quick Details Grid */}
        <div className="grid grid-cols-2 gap-y-2 gap-x-4 mb-4">
          <Detail icon={MapPin} label={post.location} />
          <Detail icon={Calendar} label={`${post.daysPerWeek} days/week`} />
          <Detail icon={Clock} label={post.timeSlot} />
          <div className="flex items-center gap-2 text-primary font-bold text-sm">
            ৳ {post.salary.toLocaleString()} / month
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between pt-4 border-t border-border">
        <ActionButton icon={Bookmark} label="Save" />
        <ActionButton
          icon={Send}
          label={isClosed ? "Closed" : "Apply"}
          primary
          disabled={isClosed}
        />
        <Link href={`/tutor/feed/${post.id}`} className="block">
          <ActionButton icon={Eye} label="Details" />
        </Link>
      </div>
    </div>
  );
}

// Sub-components for cleaner code
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function Detail({ icon: Icon, label }: { icon: any; label: string }) {
  return (
    <div className="flex items-center gap-2 text-text-muted text-sm truncate">
      <Icon size={16} />
      <span className="truncate">{label}</span>
    </div>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function ActionButton({ icon: Icon, label, primary, disabled }: any) {
  return (
    <button
      disabled={disabled}
      className={cn(
        "cursor-pointer flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold transition-all active:scale-95",
        primary
          ? "text-primary hover:bg-primary/10"
          : "text-text-muted hover:bg-surface-hover",
        disabled && "opacity-50 grayscale cursor-not-allowed",
      )}
    >
      <Icon size={18} />
      <span>{label}</span>
    </button>
  );
}
