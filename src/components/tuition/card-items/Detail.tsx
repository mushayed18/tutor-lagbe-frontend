import { LucideIcon } from "lucide-react";

export function Detail({ icon: Icon, label }: { icon: LucideIcon; label: string }) {
  return (
    <div className="flex items-center gap-2 text-text-muted text-sm truncate">
      <Icon size={16} />
      <span className="truncate">{label}</span>
    </div>
  );
}