"use client";

import Image from "next/image";
import { User, CheckCircle2 } from "lucide-react";

interface PortfolioHeaderProps {
  name: string;
  photo: string | null;
  headline: string;
  bio: string;
}

export default function PortfolioHeader({
  name,
  photo,
  headline,
  bio,
}: PortfolioHeaderProps) {
  return (
    <div className="border-b border-border pb-8 mb-8">
      <div className="flex items-start gap-4 mb-6">
        <div className="relative w-20 h-20 rounded-2xl bg-surface-hover overflow-hidden border border-border">
          {photo ? (
            <Image src={photo} alt={name} fill className="object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-primary bg-primary/5">
              <User size={32} />
            </div>
          )}
        </div>
        <div className="flex-1 pt-1">
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-black text-text-main">{name}</h1>
            <CheckCircle2 size={18} className="text-primary fill-primary/10" />
          </div>
        </div>
      </div>

      <div className="bg-surface-main/30 space-y-2">
        <p className="text-primary font-bold text-sm tracking-tight uppercase">
          {headline}
        </p>
        <p className="text-text-main/90 text-sm leading-relaxed whitespace-pre-wrap">
          {bio}
        </p>
      </div>
    </div>
  );
}
