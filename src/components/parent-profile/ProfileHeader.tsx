"use client";

import Image from "next/image";
import { Mail, Phone, MapPin, Calendar, CheckCircle2, Crown } from "lucide-react";
import { ParentProfile } from "@/types/user";
import { format } from "date-fns";
import ContactItem from "./ContactItem";


export default function ProfileHeader({ user }: { user: ParentProfile }) {
  return (
    <div className="bg-background border border-border rounded-4xl overflow-hidden mb-6">
      {/* Banner / Cover Gradient */}
      <div className="h-32 bg-linear-to-r from-primary/20 via-primary/10 to-background" />

      <div className="px-8 pb-8">
        <div className="relative flex flex-col md:flex-row gap-6 -mt-12 items-end md:items-center">
          {/* Avatar */}
          <div className="w-32 h-32 rounded-4xl bg-surface-hover border-4 border-background overflow-hidden relative shadow-xl">
            {user.photo ? (
              <Image src={user.photo} alt={user.name} fill className="object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-4xl font-black text-primary">
                {user.name[0]}
              </div>
            )}
          </div>

          {/* Name & Badges */}
          <div className="flex-1 space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-3xl font-black text-text-main">{user.name}</h1>
              {user.isVerified && (
                <CheckCircle2 size={24} className="text-blue-500 fill-blue-500/10" />
              )}
              {user.subscriptionType === "PREMIUM" && (
                <span className="bg-yellow-500/10 text-yellow-600 text-[10px] font-black px-2 py-1 rounded-lg flex items-center gap-1">
                  <Crown size={12} /> PREMIUM PARENT
                </span>
              )}
            </div>
            
            <div className="flex flex-wrap items-center gap-4 text-sm text-text-muted font-medium">
              <div className="flex items-center gap-1.5">
                <MapPin size={16} className="text-primary" />
                {user.location}
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar size={16} className="text-primary" />
                Joined {format(new Date(user.createdAt), "MMMM yyyy")}
              </div>
            </div>
          </div>
        </div>

        {/* Contact Info Section (The "Privacy Lock" UI) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8 pt-8 border-t border-border/50">
          <ContactItem 
            icon={Mail} 
            label="Email Address" 
            value={user.email} 
            placeholder="email••••@example.com" 
          />
          <ContactItem 
            icon={Phone} 
            label="Phone Number" 
            value={user.phone} 
            placeholder="+880 •••••-••••••" 
          />
        </div>
      </div>
    </div>
  );
}

