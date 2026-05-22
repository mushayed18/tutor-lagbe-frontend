"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { fetcher } from "@/lib/api-client";
import {
  AdminUserRecord,
  PaginationMeta,
  GetUsersApiResponse,
} from "@/types/admin";
import UsersTable from "@/components/admin/UsersTable";
import TablePagination from "@/components/admin/TablePagination";
import UsersTableSkeleton from "@/components/admin/UsersTableSkeleton";
import { Users, RefreshCw } from "lucide-react";
import { toast } from "sonner";

export default function AdminUsersDirectoryPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Read current page position explicitly from URL strings query fallback to 1
  const urlPage = Number(searchParams?.get("page")) || 1;

  const [users, setUsers] = useState<AdminUserRecord[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Core API loader tracking routine
  const loadUsersDirectory = useCallback(async (targetPage: number) => {
    try {
      setIsLoading(true);
      // Limits items strictly to 10 rows per page view
      const res = await fetcher(`/admin/users?page=${targetPage}&limit=10`);
      const result: GetUsersApiResponse = await res.json();

      if (result.success) {
        setUsers(result.data);
        setMeta(result.meta);
      } else {
        throw new Error(result.message || "Failed to load directory");
      }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error.message || "Network link failure loading admin data");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Sync network state whenever URL search parameters are changed by components
  useEffect(() => {
    loadUsersDirectory(urlPage);
  }, [urlPage, loadUsersDirectory]);

  // Handle page changes by modifying the URL search parameters
  const handlePageNavigationChange = (newPage: number) => {
    const params = new URLSearchParams(window.location.search);
    params.set("page", newPage.toString());

    router.push(`/admin/users?${params.toString()}`);
  };

  return (
    <div className="space-y-6 p-4 max-w-6xl mx-auto">
      {/* Dashboard Top Header Title Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-background border border-border p-5 rounded-2xl shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-primary/10 rounded-xl text-primary">
            <Users size={24} />
          </div>
          <div>
            <h1 className="text-xl font-black text-text-main tracking-tight">
              User Directory Management
            </h1>
            <p className="text-xs text-text-muted mt-0.5">
              Review platform registries, verification structures, system
              auditing, and membership bans.
            </p>
          </div>
        </div>

        {/* Refresh manual workflow tool button block */}
        <button
          disabled={isLoading}
          onClick={() => loadUsersDirectory(urlPage)}
          className="inline-flex items-center gap-2 px-4 py-2.5 border border-border hover:bg-surface-hover rounded-xl text-xs font-bold text-text-muted hover:text-text-main transition-all active:scale-95 disabled:opacity-40 shrink-0 self-start sm:self-center"
        >
          <RefreshCw size={14} className={isLoading ? "animate-spin" : ""} />{" "}
          Reload Table
        </button>
      </div>

      {/* Main Condition Interface Core Wrapper Loader View */}
      {isLoading ? (
        <UsersTableSkeleton />
      ) : users.length > 0 ? (
        <div className="space-y-4">
          <UsersTable users={users} />

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
        /* Empty status view track mapping */
        <div className="text-center py-24 bg-surface-hover/20 rounded-3xl border border-dashed border-border p-6">
          <p className="text-sm font-bold text-text-muted">
            No registry matching entry items found.
          </p>
        </div>
      )}
    </div>
  );
}
