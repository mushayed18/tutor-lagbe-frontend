"use client";

import { useEffect, useState, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { fetcher } from "@/lib/api-client";
import {
  AdminTuitionRecord,
  AdminPaginationMeta,
  GetAdminTuitionsApiResponse,
} from "@/types/admin";
import AdminTuitionsTable from "@/components/admin/AdminTuitionsTable";
import TablePagination from "@/components/admin/TablePagination"; // Using your existing shared layout pagination
import UsersTableSkeleton from "@/components/admin/UsersTableSkeleton"; // Fallback loading rows layout
import { Briefcase, RefreshCw } from "lucide-react";
import { toast } from "sonner";

function AdminTuitionsDirectoryContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Parse page location integer seamlessly directly out of browser url bars parameter
  const urlPage = Number(searchParams?.get("page")) || 1;

  const [tuitions, setTuitions] = useState<AdminTuitionRecord[]>([]);
  const [meta, setMeta] = useState<AdminPaginationMeta | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchTuitionsRegistry = useCallback(async (targetPage: number) => {
    try {
      setIsLoading(true);
      const response = await fetcher(
        `/admin/tuitions?page=${targetPage}&limit=10`,
      );
      const result: GetAdminTuitionsApiResponse = await response.json();

      if (result.success) {
        setTuitions(result.data);
        setMeta(result.meta);
      } else {
        throw new Error(
          result.message || "Failed to pull tuition records registry.",
        );
      }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(
        error.message || "Data link failure encountered loading tuitions.",
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTuitionsRegistry(urlPage);
  }, [urlPage, fetchTuitionsRegistry]);

  const handlePageNavigationChange = (newPage: number) => {
    const params = new URLSearchParams(window.location.search);
    params.set("page", newPage.toString());
    router.push(`/admin/tuitions?${params.toString()}`);
  };

  return (
    <div className="space-y-6 md:p-4 max-w-6xl mx-auto mb-20">
      {/* Title Header Toolbar Block view layouts */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-background md:border md:border-border md:p-5 rounded-2xl shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-primary/10 rounded-xl text-primary">
            <Briefcase size={24} />
          </div>
          <div>
            <h1 className="text-xl font-black text-text-main tracking-tight">
              Tuition Post Requirements Directory
            </h1>
            <p className="text-xs text-text-muted mt-0.5">
              Review, audit, verify incoming postings, and remove obsolete
              tuition matching advertisements.
            </p>
          </div>
        </div>

        <button
          disabled={isLoading}
          onClick={() => fetchTuitionsRegistry(urlPage)}
          className="cursor-pointer inline-flex items-center gap-2 px-4 py-2.5 border border-border hover:bg-surface-hover rounded-xl text-xs font-bold text-text-muted hover:text-text-main transition-all active:scale-95 disabled:opacity-40 shrink-0 self-start sm:self-center"
        >
          <RefreshCw size={14} className={isLoading ? "animate-spin" : ""} />
          Reload Database
        </button>
      </div>

      {/* Loading conditional matching layout logic container arrays */}
      {isLoading ? (
        <UsersTableSkeleton />
      ) : tuitions.length > 0 ? (
        <div className="space-y-4">
          <AdminTuitionsTable
            tuitions={tuitions}
            onTuitionDeleted={() => fetchTuitionsRegistry(urlPage)}
          />

          {meta && (
            <TablePagination
              currentPage={meta.page}
              totalPages={meta.totalPages}
              totalRecords={meta.total}
              currentCount={meta.count}
              limit={meta.limit}
              onPageChange={handlePageNavigationChange}
            />
          )}
        </div>
      ) : (
        <div className="text-center py-24 bg-surface-hover/20 rounded-3xl border border-dashed border-border p-6">
          <p className="text-sm font-bold text-text-muted">
            No tuition requirement post records matched in this registry frame.
          </p>
        </div>
      )}
    </div>
  );
}

// Export default wrapper sealed cleanly to pass standard server component build passes
export default function AdminTuitionsDirectoryPage() {
  return (
    <Suspense fallback={<UsersTableSkeleton />}>
      <AdminTuitionsDirectoryContent />
    </Suspense>
  );
}
