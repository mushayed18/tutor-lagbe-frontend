"use client";

import Link from "next/link";
import { Edit3 } from "lucide-react";

interface EditProfileButtonProps {
  userRole: "TUTOR" | "PARENT" | "ADMIN";
}

export default function EditProfileButton({
  userRole,
}: EditProfileButtonProps) {
  return (
    <Link
      href={
        userRole === "PARENT"
          ? "/parent/profile/edit"
          : "/tutor/profile/edit"
      }
      className="flex items-center justify-center gap-2 w-full py-4 bg-surface-hover hover:bg-primary/10 text-text-main hover:text-primary font-bold transition-all duration-300 border-t border-border group"
    >
      <Edit3
        size={18}
        className="group-hover:rotate-12 transition-transform"
      />
      <span>Update Profile Information</span>
    </Link>
  );
}