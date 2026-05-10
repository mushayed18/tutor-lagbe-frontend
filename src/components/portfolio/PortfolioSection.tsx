import { LucideIcon } from "lucide-react";

interface PortfolioSectionProps {
  title: string;
  icon: LucideIcon;
  children: React.ReactNode;
}

export default function PortfolioSection({
  title,
  icon: Icon,
  children,
}: PortfolioSectionProps) {
  return (
    <div className="mb-10 last:mb-0">
      <div className="flex items-center gap-2 mb-4">
        <div className="p-1.5 bg-primary/10 rounded-lg text-primary">
          <Icon size={16} />
        </div>
        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-text-muted">
          {title}
        </h3>
      </div>
      <div className="space-y-3">{children}</div>
    </div>
  );
}
