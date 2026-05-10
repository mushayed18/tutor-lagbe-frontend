"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { fetcher } from "@/lib/api-client";
import { toast } from "sonner";
import { ArrowLeft, Loader2, Check } from "lucide-react";
import PortfolioFormInput from "@/components/portfolio/PortfolioFormInput";
import Button from "@/components/ui/Button";

// Sync with your backend Zod schema
const portfolioSchema = z.object({
  headline: z.string().min(5, "Headline is too short"),
  bio: z.string().min(10, "Bio is too short"),
  university: z.string().min(2, "University name is required"),
  department: z.string().min(2, "Department is required"),
  experience: z.string().min(2, "Experience is required"),
  subjects: z.string().min(2, "Subjects are required"),
  preferredClasses: z.string().min(2, "Classes are required"),
  expectedSalary: z.number().positive("Salary must be a positive number"),
  availability: z.string().min(2, "Availability is required"),
});

type PortfolioFormData = z.infer<typeof portfolioSchema>;

export default function CreatePortfolioPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PortfolioFormData>({
    resolver: zodResolver(portfolioSchema),
  });

  const onSubmit = async (data: PortfolioFormData) => {
    setIsSubmitting(true);
    try {
      const res = await fetcher("/portfolio", {
        method: "POST",
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (result.success) {
        toast.success("Portfolio created successfully!");
        router.push("/tutor/portfolio");
        router.refresh();
      } else {
        toast.error(result.message || "Failed to create portfolio");
      }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 pb-24">
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => router.back()}
          className="cursor-pointer p-2 hover:bg-surface-hover rounded-full transition-colors"
        >
          <ArrowLeft size={24} />
        </button>
        <div>
          <h1 className="text-2xl font-black">Create Portfolio</h1>
          <p className="text-text-muted text-sm">
            Fill in the details to showcase your expertise.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="bg-background md:border md:border-border rounded-4xl md:p-8 space-y-6 shadow-sm">
          <PortfolioFormInput
            label="Professional Headline"
            name="headline"
            placeholder="e.g. Expert Mathematics & Physics Tutor"
            register={register}
            error={errors.headline?.message}
          />

          <PortfolioFormInput
            label="Short Bio"
            name="bio"
            placeholder="Tell parents about your teaching style and background..."
            register={register}
            error={errors.bio?.message}
            isTextArea={true}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <PortfolioFormInput
              label="University"
              name="university"
              placeholder="e.g. University of Dhaka"
              register={register}
              error={errors.university?.message}
            />
            <PortfolioFormInput
              label="Department"
              name="department"
              placeholder="e.g. CSE"
              register={register}
              error={errors.department?.message}
            />
          </div>

          <PortfolioFormInput
            label="Tutoring Experience"
            name="experience"
            placeholder="e.g. 3 years of home tutoring"
            register={register}
            error={errors.experience?.message}
          />

          <PortfolioFormInput
            label="Expertise Subjects"
            name="subjects"
            placeholder="e.g. Math, Higher Math, Physics"
            register={register}
            error={errors.subjects?.message}
          />

          <PortfolioFormInput
            label="Preferred Classes"
            name="preferredClasses"
            placeholder="e.g. Class 9-12, O Levels"
            register={register}
            error={errors.preferredClasses?.message}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <PortfolioFormInput
              label="Expected Salary (Monthly)"
              name="expectedSalary"
              type="number"
              placeholder="e.g. 8000"
              register={register}
              error={errors.expectedSalary?.message}
            />
            <PortfolioFormInput
              label="Weekly Availability"
              name="availability"
              placeholder="e.g. 3 days/week, Evening"
              register={register}
              error={errors.availability?.message}
            />
          </div>
        </div>

        <Button
          type="submit"
          className="w-full py-4 rounded-2xl text-lg font-bold flex items-center justify-center gap-2"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <Loader2 className="animate-spin" size={20} />
          ) : (
            <>
              <Check size={20} />
              Publish Portfolio
            </>
          )}
        </Button>
      </form>
    </div>
  );
}
