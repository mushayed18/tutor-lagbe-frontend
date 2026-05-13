import { cn } from "@/lib/utils";
import { LockKeyhole } from "lucide-react";

export default function ContactItem({
  icon: Icon,
  label,
  value,
  placeholder,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
}: any) {
  const isLocked = !value;

  return (
    <div
      className={cn(
        "flex items-center gap-4 p-4 rounded-2xl border transition-all",
        isLocked
          ? "bg-surface-hover/50 border-dashed border-border"
          : "bg-background border-border shadow-sm",
      )}
    >
      <div
        className={cn(
          "w-10 h-10 rounded-xl flex items-center justify-center",
          isLocked
            ? "bg-text-muted/10 text-text-muted"
            : "bg-primary/10 text-primary",
        )}
      >
        <Icon size={20} />
      </div>
      <div className="flex-1">
        <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-0.5">
          {label}
        </p>
        <p
          className={cn(
            "text-sm font-bold",
            isLocked ? "text-text-muted italic" : "text-text-main",
          )}
        >
          {value || placeholder}
        </p>
      </div>
      {isLocked && (
        <div className="group relative">
          <LockKeyhole
            size={18}
            className="text-text-muted opacity-50 cursor-help"
          />
          <div className="absolute bottom-full right-0 mb-2 w-48 p-2 bg-text-main text-white text-[10px] rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            Locked for safety. Hire this parent to view contact details.
          </div>
        </div>
      )}
    </div>
  );
}
