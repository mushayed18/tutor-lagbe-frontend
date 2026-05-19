"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { fetcher } from "@/lib/api-client";
import ParentFormInput from "@/components/parent/ParentFormInput";
import ParentFormTextarea from "@/components/parent/ParentFormTextarea";
import { ChevronLeft, Loader2, Save } from "lucide-react";
import { toast } from "sonner";
import ParentFormSkeleton from "@/components/parent/ParentFormSkeleton";

interface FormDataState {
  title: string;
  description: string;
  subject: string;
  classLevel: string;
  salary: string | number;
  location: string;
  daysPerWeek: string | number;
  timeSlot: string;
  status: string;
}

export default function EditTuitionPage() {
  const { id } = useParams();
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  const [formData, setFormData] = useState<FormDataState>({
    title: "",
    description: "",
    subject: "",
    classLevel: "",
    salary: "",
    location: "",
    daysPerWeek: "",
    timeSlot: "",
    status: "OPEN",
  });

  // Fetch data to fill form states cleanly on page load
  useEffect(() => {
    const fetchExistingTuition = async () => {
      try {
        const response = await fetcher(`/tuitions/${id}`);
        const result = await response.json();

        if (result.success) {
          const tuition = result.data;

          // If job state is closed, route parent away immediately as per backend constraints
          if (tuition.status === "CLOSED") {
            toast.error("Cannot update closed tuition postings.");
            router.push("/parent/my-tuitions");
            return;
          }

          setFormData({
            title: tuition.title || "",
            description: tuition.description || "",
            subject: tuition.subject || "",
            classLevel: tuition.classLevel || "",
            salary: tuition.salary ?? "",
            location: tuition.location || "",
            daysPerWeek: tuition.daysPerWeek ?? "",
            timeSlot: tuition.timeSlot || "",
            status: tuition.status || "OPEN",
          });
        } else {
          toast.error("Failed to load tuition data.");
        }
      } catch (error) {
        console.error(
          "Error loading original tuition job posting data:",
          error,
        );
        toast.error("Something went wrong fetching post details.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchExistingTuition();
  }, [id, router]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);

    // Transform form fields to exact types expected by Prisma schema layer
    const patchPayload = {
      ...formData,
      salary: Number(formData.salary) || 0,
      daysPerWeek: Number(formData.daysPerWeek) || 0,
    };

    try {
      const response = await fetcher(`/tuitions/${id}`, {
        method: "PATCH",
        body: JSON.stringify(patchPayload),
      });

      const result = await response.json();

      if (result.success) {
        toast.success("Tuition post updated successfully! 🎉");
        router.push("/parent/my-tuitions");
        router.refresh();
      } else {
        toast.error(result.message || "Failed to update record details.");
      }
    } catch (error) {
      console.error("Error patching dynamic update data stack:", error);
      toast.error("An error occurred. Please check values and try again.");
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return <ParentFormSkeleton />;
  }

  return (
    <div className="max-w-2xl mx-auto py-6 px-4 pb-24">
      {/* Back Button navigation hook link trigger */}
      <button
        onClick={() => router.back()}
        className="flex cursor-pointer items-center gap-2 text-text-muted hover:text-primary mb-6 transition-colors font-semibold text-sm"
      >
        <ChevronLeft size={18} /> Back
      </button>

      <div className="bg-background md:border md:border-border rounded-2xl md:p-6 shadow-sm">
        <div className="mb-6">
          <h1 className="text-xl font-black text-text-main">
            Edit Tuition Post
          </h1>
          <p className="text-xs text-text-muted mt-1">
            Update your posting requirements. Changes reflect instantly on the
            student feed.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <ParentFormInput
            label="Job Posting Title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="e.g., English Medium Math Tutor Needed"
            required
          />

          <ParentFormTextarea
            label="Detailed Description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Describe the qualifications, schedules, and specific requirements expected..."
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <ParentFormInput
              label="Subjects"
              name="subject"
              value={formData.subject}
              onChange={handleInputChange}
              placeholder="e.g., Physics, Math"
              required
            />

            <ParentFormInput
              label="Class / Level"
              name="classLevel"
              value={formData.classLevel}
              onChange={handleInputChange}
              placeholder="e.g., Class 9 / O-Levels"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <ParentFormInput
              label="Monthly Salary (৳)"
              name="salary"
              type="number"
              value={formData.salary}
              onChange={handleInputChange}
              placeholder="e.g., 8000"
              required
            />

            <ParentFormInput
              label="Days Per Week"
              name="daysPerWeek"
              type="number"
              value={formData.daysPerWeek}
              onChange={handleInputChange}
              placeholder="e.g., 3"
              max={7}
              min={1}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <ParentFormInput
              label="Preferred Time Slot"
              name="timeSlot"
              value={formData.timeSlot}
              onChange={handleInputChange}
              placeholder="e.g., 4:00 PM - 6:00 PM"
              required
            />

            <ParentFormInput
              label="Location Address"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              placeholder="e.g., Dhanmondi, Dhaka"
              required
            />
          </div>

          <div className="pt-4 border-t border-border flex justify-end gap-3">
            <button
              type="button"
              onClick={() => router.back()}
              disabled={isUpdating}
              className="cursor-pointer px-5 py-2.5 rounded-xl font-bold text-sm border border-border hover:bg-surface-hover transition-colors disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isUpdating}
              className="cursor-pointer px-5 py-2.5 rounded-xl bg-primary text-white font-bold text-sm hover:opacity-95 transition-all flex items-center gap-2 shadow-sm shadow-primary/10 disabled:opacity-70"
            >
              {isUpdating ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save size={16} />
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
