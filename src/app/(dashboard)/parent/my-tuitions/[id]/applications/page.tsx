"use client";

import { useParams } from "next/navigation";
import { useEffect, useState, useRef, useCallback } from "react";
import { fetcher } from "@/lib/api-client";
import { Applicant, ApplicationsResponse } from "@/types/application";
import ApplicationCard from "@/components/parent/ApplicationCard";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { Users } from "lucide-react";
import { toast } from "sonner";

export default function TuitionApplicationsPage() {
  const params = useParams();
  const tuitionId = params?.id as string;

  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  // Modal tracking variables state maps
  const [modalConfig, setModalConfig] = useState<{
    isOpen: boolean;
    applicationId: string | null;
    targetStatus: "HIRED" | "REJECTED" | null;
  }>({ isOpen: false, applicationId: null, targetStatus: null });

  const [isUpdating, setIsUpdating] = useState(false);
  const observer = useRef<IntersectionObserver | null>(null);

  // Check if someone in the list is already hired
  const isAnyTutorHired = applicants.some((app) => app.status === "HIRED");

  // Load applications with infinite scroll support
  const fetchApplications = useCallback(
    async (currentPage: number) => {
      if (!tuitionId) return;

      try {
        setIsLoading(true);
        const res = await fetcher(
          `/applications/tuition/${tuitionId}?page=${currentPage}&limit=10`,
        );
        const result: ApplicationsResponse = await res.json();

        if (result.success) {
          setApplicants((prev) =>
            currentPage === 1
              ? result.data.data
              : [...prev, ...result.data.data],
          );
          setHasMore(
            result.data.data.length > 0 &&
              result.data.meta.page < result.data.meta.totalPages,
          );
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        toast.error("Failed to fetch applications workflow list");
      } finally {
        setIsLoading(false);
      }
    },
    [tuitionId],
  );

  // Initial fetch trigger block
  useEffect(() => {
    fetchApplications(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tuitionId]);

  // Fetch next page when page index increments
  useEffect(() => {
    if (page > 1) {
      fetchApplications(page);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  // Infinite scroll hook element anchor observer tracking setup
  const lastElementRef = useCallback(
    (node: HTMLDivElement) => {
      if (isLoading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prev) => prev + 1);
        }
      });

      if (node) observer.current.observe(node);
    },
    [isLoading, hasMore],
  );

  // Pre-action click intercept handler configuration
  const handleOpenConfirm = (
    applicationId: string,
    status: "HIRED" | "REJECTED",
  ) => {
    setModalConfig({ isOpen: true, applicationId, targetStatus: status });
  };

  // Perform backend updates
  const handleStatusUpdateChange = async () => {
    const { applicationId, targetStatus } = modalConfig;
    if (!applicationId || !targetStatus) return;

    try {
      setIsUpdating(true);
      const res = await fetcher(`/applications/${applicationId}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status: targetStatus }),
      });

      const result = await res.json();

      if (result.success) {
        toast.success(
          targetStatus === "HIRED"
            ? "Tutor hired! Other applications have been rejected."
            : "Application rejected.",
        );

        if (targetStatus === "HIRED") {
          // If a tutor is hired, update all other pending applicants to REJECTED locally
          setApplicants((prev) =>
            prev.map((app) =>
              app.applicationId === applicationId
                ? { ...app, status: "HIRED" }
                : { ...app, status: "REJECTED" },
            ),
          );
        } else {
          // Single reject updates only the targeted application card state status
          setApplicants((prev) =>
            prev.map((app) =>
              app.applicationId === applicationId
                ? { ...app, status: "REJECTED" }
                : app,
            ),
          );
        }

        setModalConfig({
          isOpen: false,
          applicationId: null,
          targetStatus: null,
        });
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error(
        "Failed to modify target applicant resolution tracking parameters",
      );
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="space-y-6 p-4 max-w-3xl mx-auto">
      {/* Header back navigation breadcrumb section */}
      <div className="flex items-center gap-3">
        <div>
          <h2 className="text-xl font-black text-text-main flex items-center gap-2">
            <Users size={22} className="text-primary" /> Application Pipeline
          </h2>
          <p className="text-xs text-text-muted mt-0.5">
            Manage incoming tutor candidacies for this tuition request
            placement.
          </p>
        </div>
      </div>

      {/* Main Stream Stack Feed List area */}
      <div className="space-y-3 mt-4">
        {applicants.map((applicant, index) => (
          <div
            key={applicant.applicationId}
            ref={index === applicants.length - 1 ? lastElementRef : null}
          >
            <ApplicationCard
              applicant={applicant}
              onStatusChange={handleOpenConfirm}
              isActionLoading={
                isUpdating &&
                modalConfig.applicationId === applicant.applicationId
              }
              someTutorIsHired={isAnyTutorHired}
            />
          </div>
        ))}

        {/* Pulling loading item blocks skeletons stack view mapping */}
        {isLoading && (
          <div className="flex flex-col gap-4 w-full px-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex gap-4 items-center animate-pulse">
                <div className="w-14 h-14 rounded-full bg-surface-hover shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-32 bg-surface-hover rounded" />
                  <div className="h-3 w-48 bg-surface-hover rounded" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* End-of-content footer message element */}
        {!hasMore && applicants.length > 0 && (
          <p className="text-center text-text-muted text-xs font-semibold py-8">
            You have reached the end of all applicant records.
          </p>
        )}

        {/* Empty status placeholder dashboard state block */}
        {applicants.length === 0 && !isLoading && (
          <div className="text-center py-20 bg-surface-hover/30 rounded-3xl border border-dashed border-border flex flex-col items-center justify-center p-6">
            <div className="w-12 h-12 rounded-full bg-surface flex items-center justify-center text-text-muted mb-3 border border-border/50">
              <Users size={20} />
            </div>
            <h4 className="text-sm font-bold text-text-main">
              No Applicants Yet
            </h4>
            <p className="text-xs text-text-muted mt-1 max-w-xs leading-relaxed">
              Tutors haven&apos;t submitted placement entries to this listing
              dashboard yet. Open positions are searchable in the public active
              tuition boards stream.
            </p>
          </div>
        )}
      </div>

      {/* Double confirmation step protection overlay configuration modal container modal wrapper block */}
      <ConfirmModal
        isOpen={modalConfig.isOpen}
        onClose={() =>
          setModalConfig({
            isOpen: false,
            applicationId: null,
            targetStatus: null,
          })
        }
        onConfirm={handleStatusUpdateChange}
        title={
          modalConfig.targetStatus === "HIRED"
            ? "Confirm Tutor Hiring Selection"
            : "Reject Applicant Entry"
        }
        message={
          modalConfig.targetStatus === "HIRED"
            ? "Are you sure you want to hire this tutor? Confirming will automatically close this job post and reject all other applicants."
            : "Are you sure you want to dismiss this application? This candidate will receive a notification response status feedback entry update automatically."
        }
        isLoading={isUpdating}
      />
    </div>
  );
}
