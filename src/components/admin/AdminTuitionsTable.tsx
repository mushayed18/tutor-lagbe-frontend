"use client";

import { useState } from "react";
import { AdminTuitionRecord } from "@/types/admin";
import { Trash2, BookOpen, User, Layers } from "lucide-react";
import { ConfirmModal } from "@/components/ui/ConfirmModal"; // Adjust path dynamically based on your folders
import { fetcher } from "@/lib/api-client";
import { toast } from "sonner";

interface AdminTuitionsTableProps {
  tuitions: AdminTuitionRecord[];
  onTuitionDeleted: () => void;
}

export default function AdminTuitionsTable({
  tuitions,
  onTuitionDeleted,
}: AdminTuitionsTableProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTuitionId, setSelectedTuitionId] = useState<string | null>(
    null,
  );
  const [isDeleting, setIsDeleting] = useState(false);

  const handleOpenDeleteModal = (id: string) => {
    setSelectedTuitionId(id);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedTuitionId(null);
    setIsModalOpen(false);
  };

  const handleExecuteDelete = async () => {
    if (!selectedTuitionId) return;

    try {
      setIsDeleting(true);
      const response = await fetcher(`/admin/tuitions/${selectedTuitionId}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to delete tuition request.");
      }

      toast.success(result.message || "Tuition job removed completely.");
      onTuitionDeleted(); // Force parent dashboard to re-pull rows
      handleCloseModal();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error.message || "Network layout exception occurred.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <div className="w-full overflow-x-auto rounded-2xl border border-border bg-surface shadow-xs">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-border bg-surface-hover/50 text-[11px] font-bold text-text-muted uppercase tracking-wider select-none">
              <th className="p-4 font-black">Parent Detail</th>
              <th className="p-4 font-black">Class & Subjects</th>
              <th className="p-4 font-black">Salary (BDT)</th>
              <th className="p-4 font-black text-center">Applications</th>
              <th className="p-4 font-black text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60 text-xs">
            {tuitions.map((tuition) => (
              <tr
                key={tuition.id}
                className="hover:bg-surface-hover/30 transition-colors"
              >
                {/* Column 1: Parent Metadata */}
                <td className="p-4">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 bg-secondary/10 text-secondary rounded-lg shrink-0">
                      <User size={14} />
                    </div>
                    <div>
                      <p className="font-bold text-text-main">
                        {tuition.parent?.name || "Unknown Parent"}
                      </p>
                      <p className="text-[10px] text-text-muted mt-0.5">
                        {tuition.parent?.email}
                      </p>
                    </div>
                  </div>
                </td>

                {/* Column 2: Class and Requirements */}
                <td className="p-4">
                  <div className="space-y-1 max-w-xs">
                    <div className="flex items-center gap-1.5 font-bold text-text-main">
                      <Layers size={12} className="text-primary" />
                      <span>{tuition.class}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-text-muted text-[11px]">
                      <BookOpen size={11} />
                      <span className="truncate">{tuition.subjects}</span>
                    </div>
                  </div>
                </td>

                {/* Column 3: Compensation rate */}
                <td className="p-4 font-bold text-text-main">
                  {tuition.salary > 0
                    ? `${tuition.salary.toLocaleString()} BDT`
                    : "Negotiable"}
                </td>

                {/* Column 4: Application metrics aggregate counter */}
                <td className="p-4 text-center">
                  <span className="inline-flex items-center justify-center px-2.5 py-1 font-bold text-[11px] rounded-full bg-primary/10 text-primary">
                    {tuition._count?.applications || 0} Apps
                  </span>
                </td>

                {/* Column 5: Destruction controls tool button */}
                <td className="p-4 text-center">
                  <button
                    onClick={() => handleOpenDeleteModal(tuition.id)}
                    className="cursor-pointer p-2 rounded-xl text-text-muted hover:text-red-500 hover:bg-red-500/10 transition-all active:scale-95"
                    title="Delete Tuition Job Requirement"
                  >
                    <Trash2 size={15} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Reusable Confirm Modal Integrated cleanly into layout state tree */}
      <ConfirmModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onConfirm={handleExecuteDelete}
        title="Delete Tuition Post"
        message="Are you absolutely sure you want to permanently delete this tuition requirement post? All associated applications submitted by tutors will be permanently removed. This action cannot be undone."
        isLoading={isDeleting}
      />
    </>
  );
}
