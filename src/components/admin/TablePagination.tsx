"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

interface TablePaginationProps {
  currentPage: number;
  totalPages: number;
  totalRecords: number;
  currentCount: number;
  limit: number;
  onPageChange: (newPage: number) => void;
}

export default function TablePagination({
  currentPage,
  totalPages,
  totalRecords,
  currentCount,
  limit,
  onPageChange,
}: TablePaginationProps) {
  if (totalPages <= 1) return null;

  // Calculate standard diagnostic row summary items boundaries
  const startItem = (currentPage - 1) * limit + 1;
  const endItem = startItem + currentCount - 1;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-border/40 px-2">
      {/* Diagnostics Readout Summary Info Log */}
      <p className="text-xs text-text-muted font-medium">
        Showing <span className="font-bold text-text-main">{startItem}</span> to{" "}
        <span className="font-bold text-text-main">{endItem}</span> of{" "}
        <span className="font-bold text-text-main">{totalRecords}</span> entries
      </p>

      {/* Button controls wrapper tracker state */}
      <div className="flex items-center gap-2">
        <button
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
          className="p-2 border border-border text-text-muted hover:bg-surface-hover hover:text-text-main rounded-xl transition-all disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-text-muted active:scale-95"
        >
          <ChevronLeft size={16} />
        </button>

        {Array.from({ length: totalPages }).map((_, idx) => {
          const pageNumber = idx + 1;
          const isActive = pageNumber === currentPage;

          return (
            <button
              key={pageNumber}
              onClick={() => onPageChange(pageNumber)}
              className={`min-w-9 h-9 flex items-center justify-center text-xs font-bold rounded-xl transition-all active:scale-95 border ${
                isActive
                  ? "bg-primary text-white border-primary shadow-sm shadow-primary/20"
                  : "border-border text-text-muted hover:bg-surface-hover hover:text-text-main"
              }`}
            >
              {pageNumber}
            </button>
          );
        })}

        <button
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          className="p-2 border border-border text-text-muted hover:bg-surface-hover hover:text-text-main rounded-xl transition-all disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-text-muted active:scale-95"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
