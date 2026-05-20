import { LucideIcon } from "lucide-react";

interface PortfolioItemBoxProps {
  label: string;
  value: string;
  icon: LucideIcon;
  highlightValue?: boolean;
}

export function PortfolioItemBox({
  label,
  value,
  icon: Icon,
  highlightValue = false,
}: PortfolioItemBoxProps) {
  return (
    <div className="p-3.5 rounded-xl border border-border/50 flex items-start gap-3">
      <div className="p-2 bg-background shrink-0 mt-0.5">
        <Icon size={16} className="text-white" />
      </div>
      <div className="space-y-0.5">
        <span className="text-[10px] font-bold text-primary uppercase tracking-wider block">
          {label}
        </span>
        <p
          className={`text-sm font-bold leading-tight ${highlightValue ? "text-primary" : "text-text-muted"}`}
        >
          {value}
        </p>
      </div>
    </div>
  );
}