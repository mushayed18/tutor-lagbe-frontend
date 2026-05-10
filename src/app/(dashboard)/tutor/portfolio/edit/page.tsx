"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { fetcher } from "@/lib/api-client";
import { toast } from "sonner";
import { ArrowLeft, Loader2, Save } from "lucide-react";
import PortfolioFormInput from "@/components/portfolio/PortfolioFormInput";
import Button from "@/components/ui/Button";
import EditPortfolioSkeleton from "@/components/portfolio/EditPortfolioSkeleton";

// Same schema as create
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

export default function EditPortfolioPage() {
  const router = useRouter();
  const [isUpdating, setIsUpdating] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PortfolioFormData>({
    resolver: zodResolver(portfolioSchema),
  });

  // 1. Fetch existing data to fill the form
  useEffect(() => {
    const loadPortfolio = async () => {
      try {
        const res = await fetcher("/portfolio/me");
        const result = await res.json();
        if (result.success && result.data) {
          // Pre-fill the form with existing data
          reset(result.data);
        } else {
          toast.error("Could not load portfolio data");
          router.push("/tutor/portfolio");
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        toast.error("Failed to fetch portfolio");
      } finally {
        setIsPageLoading(false);
      }
    };
    loadPortfolio();
  }, [reset, router]);

  const onSubmit = async (data: PortfolioFormData) => {
    setIsUpdating(true);
    try {
      const res = await fetcher("/portfolio", {
        method: "PATCH",
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (result.success) {
        toast.success("Portfolio updated successfully!");
        router.push("/tutor/portfolio");
        router.refresh();
      } else {
        toast.error(result.message || "Update failed");
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsUpdating(false);
    }
  };

  if (isPageLoading) return <EditPortfolioSkeleton />;

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
          <h1 className="text-2xl font-black text-text-main">Edit Portfolio</h1>
          <p className="text-text-muted text-sm tracking-tight">
            Keep your tutoring information up to date.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="bg-background md:border md:border-border rounded-4xl md:p-8 space-y-6 shadow-sm">
          <PortfolioFormInput
            label="Professional Headline"
            name="headline"
            placeholder="e.g. Senior Science Specialist"
            register={register}
            error={errors.headline?.message}
          />

          <PortfolioFormInput
            label="Bio / Teaching Philosophy"
            name="bio"
            placeholder="Update your teaching approach..."
            register={register}
            error={errors.bio?.message}
            isTextArea={true}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <PortfolioFormInput
              label="University"
              name="university"
              register={register}
              placeholder="University"
              error={errors.university?.message}
            />
            <PortfolioFormInput
              label="Department"
              name="department"
              register={register}
              placeholder="Department"
              error={errors.department?.message}
            />
          </div>

          <PortfolioFormInput
            label="Tutoring Experience"
            name="experience"
            placeholder="How many years?"
            register={register}
            error={errors.experience?.message}
          />

          <PortfolioFormInput
            label="Expertise Subjects"
            name="subjects"
            placeholder="Math, Physics, etc."
            register={register}
            error={errors.subjects?.message}
          />

          <PortfolioFormInput
            label="Preferred Classes"
            name="preferredClasses"
            placeholder="Class 9-10, O Levels"
            register={register}
            error={errors.preferredClasses?.message}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <PortfolioFormInput
              label="Expected Salary"
              name="expectedSalary"
              type="number"
              placeholder="Monthly salary"
              register={register}
              error={errors.expectedSalary?.message}
            />
            <PortfolioFormInput
              label="Availability"
              name="availability"
              placeholder="e.g. Weekends, 4PM - 8PM"
              register={register}
              error={errors.availability?.message}
            />
          </div>
        </div>

        <Button
          type="submit"
          className="w-full py-4 rounded-2xl text-lg font-bold flex items-center justify-center gap-2"
          disabled={isUpdating}
        >
          {isUpdating ? (
            <Loader2 className="animate-spin" size={20} />
          ) : (
            <>
              <Save size={20} />
              Save Changes
            </>
          )}
        </Button>
      </form>
    </div>
  );
}
