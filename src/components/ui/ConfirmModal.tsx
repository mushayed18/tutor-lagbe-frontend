"use client";

import { Loader2 } from "lucide-react";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  isLoading?: boolean;
}

export function ConfirmModal({ isOpen, onClose, onConfirm, title, message, isLoading }: ConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-background border border-border w-full max-w-md rounded-2xl p-6 shadow-xl animate-in fade-in zoom-in duration-200">
        <h3 className="text-xl font-bold text-text-main mb-2">{title}</h3>
        <p className="text-text-muted text-sm mb-6">{message}</p>
        
        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="cursor-pointer px-4 py-2 rounded-lg font-semibold text-sm hover:bg-surface-hover transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="cursor-pointer px-4 py-2 rounded-lg bg-primary text-white font-semibold text-sm hover:opacity-90 transition-all flex items-center gap-2"
          >
            {isLoading && <Loader2 size={16} className="animate-spin" />}
            Confirm Apply
          </button>
        </div>
      </div>
    </div>
  );
}