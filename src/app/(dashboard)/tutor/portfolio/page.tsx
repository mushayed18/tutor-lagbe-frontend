"use client";

import { useEffect, useState } from "react";
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
import { useAuth } from "@/providers/AuthProvider";

export default function PortfolioPage() {
  // 🌟 eslint-disable-next-line @typescript-eslint/no-explicit-any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [portfolio, setPortfolio] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const { user } = useAuth();

  useEffect(() => {
    const getPortfolio = async () => {
      try {
        setLoading(true);

        // 🌟 Changed from /portfolio/${user.id} to /portfolio/me
        const res = await fetcher("/portfolio/me");
        const result = await res.json();

        if (result.success) {
          setPortfolio(result.data);
        }
      } catch (error) {
        console.error("Failed to fetch portfolio:", error);
      } finally {
        setLoading(false);
      }
    };

    getPortfolio();
  }, []); // 🌟 Clean empty dependency array! Fires exactly once when the page loads.

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
              name={user?.name || "Tutor Profile"}
              photo={user?.photo || null}
              headline={portfolio.headline || "No Headline Provided"}
              bio={portfolio.bio || "No biography added yet."}
            />

            <PortfolioSection
              title="Educational Background"
              icon={GraduationCap}
            >
              <ListItem
                label="University"
                value={portfolio.university || "Not Provided"}
              />
              <ListItem
                label="Department"
                value={portfolio.department || "Not Provided"}
              />
            </PortfolioSection>

            <PortfolioSection title="Tutoring Experience" icon={Briefcase}>
              <ListItem
                label="Professional Experience"
                value={portfolio.experience || "No experience declared"}
              />
            </PortfolioSection>

            <PortfolioSection title="Teaching Preferences" icon={BookOpen}>
              <ListItem
                label="Expertise Subjects"
                value={portfolio.subjects || "Not Specified"}
              />
              <ListItem
                label="Preferred Classes"
                value={portfolio.preferredClasses || "Not Specified"}
              />
            </PortfolioSection>

            <PortfolioSection title="Financials & Time" icon={CircleDollarSign}>
              <ListItem
                label="Expected Salary"
                value={
                  portfolio.expectedSalary
                    ? `${portfolio.expectedSalary} BDT / Month`
                    : "Negotiable"
                }
              />
              <ListItem
                label="Weekly Availability"
                value={portfolio.availability || "Not Configured"}
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
