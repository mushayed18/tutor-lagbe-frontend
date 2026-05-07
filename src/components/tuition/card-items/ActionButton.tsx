import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface ActionButtonProps {
  icon: LucideIcon;
  label: string;
  primary?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
}

export function ActionButton({ icon: Icon, label, primary, disabled, onClick, className }: ActionButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "cursor-pointer flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold transition-all active:scale-95",
        primary
          ? "text-primary hover:bg-primary/10"
          : "text-text-muted hover:bg-surface-hover",
        disabled && "opacity-50 grayscale cursor-not-allowed",
        className
      )}
    >
      <Icon size={18} />
      <span>{label}</span>
    </button>
  );
}