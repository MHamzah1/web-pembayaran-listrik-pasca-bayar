"use client";

import { forwardRef, InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: LucideIcon;
  rightIcon?: LucideIcon;
  helperText?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      label,
      error,
      leftIcon: LeftIcon,
      rightIcon: RightIcon,
      helperText,
      id,
      ...props
    },
    ref,
  ) => {
    const inputId = id || label?.toLowerCase().replace(/\s/g, "-");

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {LeftIcon && (
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <LeftIcon className="h-5 w-5 text-gray-400" />
            </div>
          )}
          <input
            id={inputId}
            ref={ref}
            className={cn(
              "flex h-12 w-full rounded-xl border-2 bg-white px-4 py-2 text-base text-gray-900 transition-all duration-200",
              "placeholder:text-gray-400",
              "focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500",
              "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-gray-50",
              error
                ? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
                : "border-gray-200 hover:border-gray-300",
              LeftIcon && "pl-12",
              RightIcon && "pr-12",
              className,
            )}
            {...props}
          />
          {RightIcon && (
            <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
              <RightIcon className="h-5 w-5 text-gray-400" />
            </div>
          )}
        </div>
        {error && (
          <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            {error}
          </p>
        )}
        {helperText && !error && (
          <p className="mt-2 text-sm text-gray-500">{helperText}</p>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";

export { Input };
