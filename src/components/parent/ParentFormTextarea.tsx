"use client";

interface ParentFormTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
}

export default function ParentFormTextarea({
  label,
  rows = 4,
  ...props
}: ParentFormTextareaProps) {
  return (
    <div className="space-y-1.5 w-full">
      <label className="text-xs font-bold text-text-muted uppercase tracking-wider ml-1">
        {label}
      </label>
      <textarea
        rows={rows}
        {...props}
        className="w-full px-4 py-3 rounded-2xl border border-border bg-background focus:border-primary/50 focus:ring-4 focus:ring-primary/5 outline-none transition-all text-text-main font-medium placeholder:text-text-muted/40 resize-y min-h-25"
      />
    </div>
  );
}
