"use client";

import { useEffect, useState } from "react";
import { fetcher } from "@/lib/api-client";
import { TutorPortfolio } from "@/types/portfolio"; // Clean externalized type import
import {
  GraduationCap,
  Briefcase,
  BookOpen,
  DollarSign,
  Calendar,
  Layers,
  FileText,
  User,
} from "lucide-react";
import { PortfolioItemBox } from "./PortfolioItemBox";
import TutorPortfolioSkeleton from "./TutorPortfolioSkeleton";

interface TutorPortfolioViewProps {
  userId: string;
}

export default function TutorPortfolioView({
  userId,
}: TutorPortfolioViewProps) {
  const [portfolio, setPortfolio] = useState<TutorPortfolio | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPortfolioData = async () => {
      try {
        const response = await fetcher(`/portfolio/${userId}`);
        const result = await response.json();

        if (result.success) {
          setPortfolio(result.data);
        }
      } catch (error) {
        console.error(
          "Error fetching target tutor portfolio context mapping:",
          error,
        );
      } finally {
        setIsLoading(false);
      }
    };

    if (userId) {
      fetchPortfolioData();
    }
  }, [userId]);

  if (isLoading) {
    return <TutorPortfolioSkeleton />;
  }

  if (!portfolio) {
    return (
      <div className="w-full p-8 text-center bg-background border border-border rounded-2xl shadow-sm">
        <div className="w-12 h-12 rounded-full bg-surface-hover flex items-center justify-center mx-auto mb-3">
          <User className="text-text-muted/60" size={20} />
        </div>
        <h4 className="text-sm font-bold text-text-main">
          No Portfolio Available
        </h4>
        <p className="text-xs text-text-muted mt-1 max-w-xs mx-auto">
          This tutor hasn&apos;t created or customized their professional
          credentials profile workspace yet.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full bg-background border border-border rounded-2xl p-6 shadow-sm space-y-6">
      {/* Title & Headline Block */}
      <div>
        <h3 className="text-lg font-black text-text-main flex items-center gap-2">
          <FileText size={20} className="text-primary" /> Portfolio
        </h3>
        {portfolio.headline && (
          <p className="text-sm font-bold text-primary mt-2 bg-primary/5 px-3 py-1.5 rounded-xl inline-block">
            {portfolio.headline}
          </p>
        )}
      </div>

      {/* Bio / About Section */}
      {portfolio.bio && (
        <div className="space-y-1.5">
          <h4 className="text-xs font-bold text-text-muted uppercase tracking-wider ml-0.5">
            About the Tutor
          </h4>
          <p className="text-sm font-medium text-text-muted leading-relaxed p-4 border border-border/40 rounded-xl whitespace-pre-wrap">
            {portfolio.bio}
          </p>
        </div>
      )}

      {/* Grid Properties Dataset Overview Section */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold text-text-muted uppercase tracking-wider ml-0.5">
          Qualifications & Preferences
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <PortfolioItemBox
            icon={GraduationCap}
            label="Education background"
            value={`${portfolio.university} (${portfolio.department})`}
          />

          <PortfolioItemBox
            icon={Briefcase}
            label="Teaching Experience"
            value={portfolio.experience}
          />

          <PortfolioItemBox
            icon={BookOpen}
            label="Expertise Subjects"
            value={portfolio.subjects}
          />

          <PortfolioItemBox
            icon={Layers}
            label="Preferred Classes"
            value={portfolio.preferredClasses}
          />

          <PortfolioItemBox
            icon={DollarSign}
            label="Expected Monthly Salary"
            value={`৳ ${portfolio.expectedSalary.toLocaleString()} / month`}
            highlightValue
          />

          <PortfolioItemBox
            icon={Calendar}
            label="Weekly Availability"
            value={portfolio.availability}
          />
        </div>
      </div>
    </div>
  );
}
