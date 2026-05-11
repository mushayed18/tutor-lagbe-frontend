"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { fetcher } from "@/lib/api-client";
import { toast } from "sonner";
import { PencilLine, Loader2, SendHorizontal, ArrowLeft } from "lucide-react";
import FormInput from "@/components/ui/FormInput";
import Button from "@/components/ui/Button";

// Syncing with your backend Zod schema
const createTuitionSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  subject: z.string().min(2, "Subject is required"),
  classLevel: z.string().min(1, "Class level is required"),
  salary: z.number().min(1000, "Minimum salary should be 1000 BDT"),
  location: z.string().min(3, "Location is required"),
  daysPerWeek: z.number().min(1).max(7),
  timeSlot: z.string().min(3, "Time slot is required"),
});

type TuitionFormData = z.infer<typeof createTuitionSchema>;

export default function CreateJobPostPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TuitionFormData>({
    resolver: zodResolver(createTuitionSchema),
  });

  const onSubmit = async (data: TuitionFormData) => {
    setIsSubmitting(true);
    try {
      const res = await fetcher("/tuitions", {
        method: "POST",
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (result.success) {
        toast.success("Job post published successfully!");
        router.push("/parent/my-tuitions");
        router.refresh();
      } else {
        toast.error(result.message || "Failed to create job post");
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 pb-24">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => router.back()}
          className="cursor-pointer p-2 hover:bg-surface-hover rounded-full transition-colors"
        >
          <ArrowLeft size={24} />
        </button>
        <div>
          <h1 className="text-2xl font-black text-text-main flex items-center gap-2">
            Post a Tuition Job <PencilLine size={24} className="text-primary" />
          </h1>
          <p className="text-text-muted text-sm font-medium">
            Provide details to find the best tutor for your child.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="bg-background md:border md:border-border rounded-4xl md:p-8 space-y-6 shadow-sm">
          {/* Basic Info */}
          <FormInput
            label="Job Title"
            name="title"
            placeholder="e.g. Need experienced Math tutor for Class 9"
            register={register}
            error={errors.title?.message}
          />

          <FormInput
            label="Detailed Description"
            name="description"
            placeholder="Mention specific requirements, student weak points, etc."
            register={register}
            error={errors.description?.message}
            isTextArea={true}
          />

          {/* Academic Requirements */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormInput
              label="Subject"
              name="subject"
              placeholder="e.g. Physics & Chemistry"
              register={register}
              error={errors.subject?.message}
            />
            <FormInput
              label="Class / Level"
              name="classLevel"
              placeholder="e.g. Class 10 (English Version)"
              register={register}
              error={errors.classLevel?.message}
            />
          </div>

          {/* Logistics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormInput
              label="Salary (BDT)"
              name="salary"
              type="number"
              placeholder="e.g. 7000"
              register={register}
              error={errors.salary?.message}
            />
            <FormInput
              label="Days Per Week"
              name="daysPerWeek"
              type="number"
              placeholder="e.g. 3"
              register={register}
              error={errors.daysPerWeek?.message}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormInput
              label="Preferred Time Slot"
              name="timeSlot"
              placeholder="e.g. 5:00 PM - 7:00 PM"
              register={register}
              error={errors.timeSlot?.message}
            />
            <FormInput
              label="Location"
              name="location"
              placeholder="e.g. Dhanmondi, Dhaka"
              register={register}
              error={errors.location?.message}
            />
          </div>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          className="w-full py-4 rounded-2xl text-lg font-bold flex items-center justify-center gap-2"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <Loader2 className="animate-spin" size={20} />
          ) : (
            <>
              <SendHorizontal size={20} />
              Post Job Now
            </>
          )}
        </Button>
      </form>
    </div>
  );
}
