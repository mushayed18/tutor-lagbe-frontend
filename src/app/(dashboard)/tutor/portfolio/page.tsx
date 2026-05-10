"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/providers/AuthProvider";
import { fetcher } from "@/lib/api-client";
import {
  GraduationCap,
  BookOpen,
  CircleDollarSign,
  CalendarDays,
  Briefcase,
  Award,
} from "lucide-react";

import PortfolioHeader from "@/components/portfolio/PortfolioHeader";
import PortfolioSection from "@/components/portfolio/PortfolioSection";
import PortfolioSkeleton from "@/components/portfolio/PortfolioSkeleton";
import PortfolioAction from "@/components/portfolio/PortfolioAction";

export default function PortfolioPage() {
  const { user } = useAuth();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [portfolio, setPortfolio] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;

    const getPortfolio = async () => {
      try {
        // Calling the API that includes User details
        const res = await fetcher(`/portfolio/${user.id}`);
        const result = await res.json();
        if (result.success) setPortfolio(result.data);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        console.error("Failed to fetch portfolio");
      } finally {
        setLoading(false);
      }
    };
    getPortfolio();
  }, [user?.id]);

  if (loading) return <PortfolioSkeleton />;

  return (
    <div className="max-w-2xl mx-auto md:px-4 py-8 pb-24">
      <div className="bg-background md:border md:border-border rounded-4xl p-2 md:p-10 shadow-sm">
        {!portfolio ? (
          <div className="md:p-12 text-center space-y-4">
            <div className="w-20 h-20 bg-primary/5 text-primary rounded-full flex items-center justify-center mx-auto mb-6">
              <Award size={40} />
            </div>
            <h1 className="text-2xl font-bold">No Portfolio Yet</h1>
            <p className="text-text-muted max-w-sm mx-auto">
              Create a professional portfolio to showcase your skills and start
              getting hired by parents.
            </p>
            <PortfolioAction exists={false} />
          </div>
        ) : (
          <>
            <PortfolioHeader
              name={portfolio.user.name}
              photo={portfolio.user.photo}
              headline={portfolio.headline}
              bio={portfolio.bio}
            />

            <PortfolioSection
              title="Educational Background"
              icon={GraduationCap}
            >
              <ListItem label="University" value={portfolio.university} />
              <ListItem label="Department" value={portfolio.department} />
            </PortfolioSection>

            <PortfolioSection title="Tutoring Experience" icon={Briefcase}>
              <ListItem
                label="Professional Experience"
                value={portfolio.experience}
              />
            </PortfolioSection>

            <PortfolioSection title="Teaching Preferences" icon={BookOpen}>
              <ListItem label="Expertise Subjects" value={portfolio.subjects} />
              <ListItem
                label="Preferred Classes"
                value={portfolio.preferredClasses}
              />
            </PortfolioSection>

            <PortfolioSection title="Financials & Time" icon={CircleDollarSign}>
              <ListItem
                label="Expected Salary"
                value={`${portfolio.expectedSalary} BDT / Month`}
              />
              <ListItem
                label="Weekly Availability"
                value={portfolio.availability}
                icon={CalendarDays}
              />
            </PortfolioSection>

            <PortfolioAction exists={true} />
          </>
        )}
      </div>
    </div>
  );
}

// Single-column list item with a clean, minimal design
function ListItem({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon?: any;
}) {
  return (
    <div className="flex flex-col border-b border-border/40 pb-3 last:border-0 last:pb-0">
      <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-1">
        {label}
      </span>
      <div className="flex items-center gap-2">
        {Icon && <Icon size={14} className="text-primary" />}
        <span className="text-text-main font-semibold">{value}</span>
      </div>
    </div>
  );
}
