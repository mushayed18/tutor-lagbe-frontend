"use client";

import Image from "next/image";
import Link from "next/link";
import { User, Briefcase, ChevronRight } from "lucide-react";
import { useAuth } from "@/providers/AuthProvider";

interface ConnectionItemProps {
  connection: {
    userId: string;
    name: string;
    photo: string | null;
    tuitionId: string;
    tuitionTitle: string;
  };
}

export default function ConnectionItem({ connection }: ConnectionItemProps) {
  const { user } = useAuth();

  const tuitionLink =
    user?.role === "PARENT"
      ? `/parent/my-tuitions/${connection.tuitionId}`
      : `/tutor/feed/${connection.tuitionId}`;

  return (
    <div className="group relative flex items-center gap-4 p-4 hover:bg-surface-hover/50 transition-all duration-200 border-b border-border/40">
      {/* 1. Avatar - Fixed for perfect circle */}
      <Link
        href={`/profile/${connection.userId}`}
        className="relative shrink-0"
      >
        <div className="w-14 h-14 rounded-full border-2 border-primary/10 overflow-hidden bg-surface-hover aspect-square relative">
          {connection.photo ? (
            <Image
              src={connection.photo}
              alt={connection.name}
              fill
              className="object-cover rounded-full" // Added rounded-full here too
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-primary/5 text-primary">
              <User size={24} />
            </div>
          )}
        </div>
      </Link>

      {/* 2. Middle Content */}
      <div className="flex-1 min-w-0 flex flex-col gap-0.5">
        <Link href={`/profile/${connection.userId}`}>
          <h3 className="font-bold text-text-main truncate hover:text-primary transition-colors">
            {connection.name}
          </h3>
        </Link>

        <Link
          href={tuitionLink}
          className="flex items-center gap-2 text-xs text-text-muted hover:text-primary transition-colors group/link"
        >
          <Briefcase size={14} className="shrink-0 text-primary/60" />
          <span className="truncate italic">
            Job: {connection.tuitionTitle}
          </span>
          <ChevronRight
            size={12}
            className="opacity-0 group-hover/link:opacity-100 transition-all -translate-x-1 group-hover/link:translate-x-0"
          />
        </Link>
      </div>

      <Link
        href={`/profile/${connection.userId}`}
        className="px-5 py-2 bg-primary/10 text-primary rounded-full text-xs font-bold hover:bg-primary hover:text-white transition-all"
      >
        Review
      </Link>
    </div>
  );
}
