"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/providers/AuthProvider";
import { fetcher } from "@/lib/api-client";
import { ArrowLeft, Check, Loader2 } from "lucide-react";
import ProfileImageUpload from "@/components/profile/ProfileImageUpload";
import EditInput from "@/components/profile/EditInput";
import Button from "@/components/ui/Button";
import { toast } from "sonner"; // Fix 1: Sonner

export default function EditProfilePage() {
  const router = useRouter();
  const { user, refreshUser } = useAuth(); // Fix 2: Use refreshUser
  const [isSaving, setIsSaving] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [formData, setFormData] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    location: user?.location || "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    const data = new FormData();
    data.append("name", formData.name);
    data.append("phone", formData.phone);
    data.append("location", formData.location);
    if (selectedFile) {
      data.append("photo", selectedFile);
    }

    try {
      // Fix 3: Handle FormData properly
      const res = await fetcher("/user/me", {
        method: "PATCH",
        body: data,
      });

      const result = await res.json();

      if (result.success) {
        await refreshUser(); // Update global auth state
        toast.success("Profile updated successfully");
        router.push("/tutor/profile");
      } else {
        toast.error(result.message || "Failed to update profile");
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error("An error occurred while saving");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 pb-24">
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={() => router.back()}
          className="p-2 hover:bg-surface-hover rounded-full transition-colors cursor-pointer"
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-xl font-bold">Edit Profile</h1>
        <div className="w-10" />
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="bg-background border border-border rounded-3xl p-6 shadow-sm">
          <ProfileImageUpload
            currentPhoto={user?.photo ?? null} // Fix 4: Fallback to null
            onFileSelect={(file) => setSelectedFile(file)}
          />

          <div className="space-y-6 mt-4">
            <EditInput
              label="Full Name"
              name="name"
              placeholder="Enter your name"
              value={formData.name}
              onChange={handleInputChange}
            />

            <EditInput
              label="Phone Number"
              name="phone"
              placeholder="e.g. +88017..."
              value={formData.phone}
              onChange={handleInputChange}
            />

            <EditInput
              label="Location"
              name="location"
              placeholder="e.g. Dhaka, Bangladesh"
              value={formData.location}
              onChange={handleInputChange}
            />
          </div>
        </div>

        <Button
          type="submit"
          className="w-full py-4 rounded-2xl text-lg font-bold flex items-center justify-center gap-2"
          disabled={isSaving}
        >
          {isSaving ? (
            <Loader2 className="animate-spin" size={20} />
          ) : (
            <>
              <Check size={20} />
              Save Changes
            </>
          )}
        </Button>
      </form>
    </div>
  );
}
