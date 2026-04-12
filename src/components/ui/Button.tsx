import React from 'react';

// Defining the available "looks" for our button
type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean; // Useful for the Register page later!
}

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading,
  className = '',
  disabled,
  ...props
}: ButtonProps) => {
  
  // 1. Base styles (Always applied)
  const baseStyles = "inline-flex items-center justify-center font-medium transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none rounded-full cursor-pointer";

  // 2. Variant styles (Threads vibe: High contrast & Pink)
  const variants = {
    primary: "bg-primary text-white hover:bg-primary-hover shadow-md",
    secondary: "bg-surface text-text-main hover:bg-gray-800",
    outline: "border border-gray-700 text-text-main hover:bg-surface",
    ghost: "text-text-muted hover:text-text-main hover:bg-surface/50",
  };

  // 3. Size styles
  const sizes = {
    sm: "px-4 py-1.5 text-xs",
    md: "px-6 py-2.5 text-sm",
    lg: "px-8 py-3 text-base",
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={isLoading || disabled}
      {...props}
    >
      {isLoading ? (
        <span className="flex items-center gap-2">
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          Processing...
        </span>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;