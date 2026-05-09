"use client";

import Image from "next/image";
import { User, ShieldCheck, MapPin } from "lucide-react";

interface ProfileHeaderProps {
  name: string;
  photo: string | null;
  location: string | null;
  role: string;
  isVerified: boolean;
}

export default function ProfileHeader({
  name,
  photo,
  location,
  role,
  isVerified,
}: ProfileHeaderProps) {
  return (
    <div className="relative">
      <div className="h-32 w-full bg-linear-to-r from-primary/20 via-primary/5 to-transparent rounded-t-3xl" />
      <div className="px-8 pb-6">
        <div className="relative -mt-16 mb-6 flex justify-between items-end">
          <div className="relative w-32 h-32 rounded-full border-4 border-background bg-surface-hover overflow-hidden shadow-lg">
            {photo ? (
              <Image src={photo} alt={name} fill className="object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-primary bg-primary/5">
                <User size={48} />
              </div>
            )}
          </div>

          <div className="hidden md:flex gap-2 mb-2">
            {isVerified && (
              <div className="flex items-center gap-1 bg-emerald-500/10 text-emerald-600 px-3 py-1.5 rounded-full text-xs font-bold border border-emerald-500/20">
                <ShieldCheck size={14} />
                Verified
              </div>
            )}
            <div className="bg-primary/10 text-primary px-3 py-1.5 rounded-full text-xs font-bold border border-primary/20 uppercase tracking-wider">
              {role}
            </div>
          </div>
        </div>

        <h1 className="text-3xl font-bold text-text-main mb-1">{name}</h1>
        <div className="flex items-center gap-2 text-text-muted">
          <MapPin size={16} />
          <span className="text-sm">{location || "Location not set"}</span>
        </div>

        <div className="flex md:hidden gap-2 mt-4">
          {isVerified && (
            <div className="flex items-center gap-1 bg-emerald-500/10 text-emerald-600 px-3 py-1.5 rounded-full text-xs font-bold border border-emerald-500/20">
              <ShieldCheck size={14} />
              Verified
            </div>
          )}
          <div className="bg-primary/10 text-primary px-3 py-1.5 rounded-full text-xs font-bold border border-primary/20 uppercase tracking-wider">
            {role}
          </div>
        </div>
      </div>
    </div>
  );
}
