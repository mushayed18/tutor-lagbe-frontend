import React, { forwardRef, useState } from "react";
import { Eye, EyeOff } from "lucide-react"; // Import icons

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  isPassword?: boolean; // New prop to handle password toggling
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, isPassword, type, className = "", ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);

    // Determine the actual type of the input
    const inputType = isPassword ? (showPassword ? "text" : "password") : type;

    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label className="text-sm font-medium text-text-muted ml-1">
            {label}
          </label>
        )}

        <div className="relative flex items-center">
          <input
            ref={ref}
            type={inputType}
            className={`
              w-full bg-surface border border-gray-800 text-text-main text-sm rounded-xl px-4 py-3
              placeholder:text-gray-600
              focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary
              transition-all duration-200
              ${error ? "border-red-500 focus:ring-red-500/50" : ""}
              ${className}
              ${isPassword ? "pr-12" : ""} /* Add padding if there's an icon */
            `}
            {...props}
          />

          {/* Password Toggle Button */}
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="cursor-pointer absolute right-4 text-text-muted hover:text-primary transition-colors"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          )}
        </div>

        {error && (
          <span className="text-xs text-red-500 ml-1 mt-0.5">{error}</span>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";

export default Input;
