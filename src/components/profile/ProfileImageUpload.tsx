"use client";

import { Camera, User } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

interface ProfileImageUploadProps {
  currentPhoto: string | null;
  onFileSelect: (file: File) => void;
}

export default function ProfileImageUpload({
  currentPhoto,
  onFileSelect,
}: ProfileImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(currentPhoto);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileSelect(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 py-6">
      <div className="relative group">
        <div className="w-28 h-28 rounded-full border-4 border-background bg-surface-hover overflow-hidden shadow-md relative">
          {preview ? (
            <Image src={preview} alt="Preview" fill className="object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-primary bg-primary/5">
              <User size={40} />
            </div>
          )}
        </div>

        <label className="absolute bottom-0 right-0 p-2 bg-primary text-white rounded-full cursor-pointer hover:scale-110 transition-transform shadow-lg border-2 border-background">
          <Camera size={18} />
          <input
            type="file"
            className="hidden"
            accept="image/*"
            onChange={handleChange}
          />
        </label>
      </div>
      <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">
        Change Profile Photo
      </p>
    </div>
  );
}
