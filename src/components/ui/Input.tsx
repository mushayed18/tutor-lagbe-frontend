import React, { forwardRef } from 'react'; // 1. Import forwardRef

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

// 2. Wrap the component in forwardRef
const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', ...props }, ref) => {
    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label className="text-sm font-medium text-text-muted ml-1">
            {label}
          </label>
        )}

        <input
          ref={ref} // 3. Attach the ref here
          className={`
            w-full bg-surface border border-gray-800 text-text-main text-sm rounded-xl px-4 py-3
            placeholder:text-gray-600
            focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary
            transition-all duration-200
            ${error ? 'border-red-500 focus:ring-red-500/50' : ''}
            ${className}
          `}
          {...props}
        />

        {error && (
          <span className="text-xs text-red-500 ml-1 mt-0.5">
            {error}
          </span>
        )}
      </div>
    );
  }
);

// 4. Give it a display name for debugging
Input.displayName = 'Input';

export default Input;