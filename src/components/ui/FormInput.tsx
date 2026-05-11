"use client";

interface FormInputProps {
  label: string;
  name: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  register: any;
  error?: string;
  type?: string;
  placeholder: string;
  isTextArea?: boolean;
}

export default function FormInput({
  label,
  name,
  register,
  error,
  type = "text",
  placeholder,
  isTextArea = false,
}: FormInputProps) {
  const inputStyles = `w-full px-4 py-3 rounded-2xl border ${
    error
      ? "border-red-500 focus:ring-red-500/10"
      : "border-border focus:border-primary/50 focus:ring-primary/5"
  } bg-background outline-none transition-all text-text-main font-medium placeholder:text-text-muted/40`;

  return (
    <div className="space-y-1.5">
      <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest ml-1">
        {label}
      </label>
      {isTextArea ? (
        <textarea
          {...register(name)}
          placeholder={placeholder}
          rows={4}
          className={inputStyles}
        />
      ) : (
        <input
          {...register(name, { valueAsNumber: type === "number" })}
          type={type}
          placeholder={placeholder}
          className={inputStyles}
        />
      )}
      {error && (
        <p className="text-red-500 text-[10px] font-bold ml-1 uppercase">
          {error}
        </p>
      )}
    </div>
  );
}
