import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
  rightElement?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, rightElement, ...props }, ref) => {
    return (
      <div className="relative w-full">
        <input
          type={type}
          className={cn(
            "flex h-[48px] w-full rounded-2xl border bg-white px-5 py-3 text-sm text-gray-900 placeholder:text-gray-400 font-jakarta transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-50",
            error
              ? "border-rose-300 focus-visible:ring-rose-500/20 focus-visible:border-rose-500"
              : "border-gray-200 hover:border-gray-300 focus-visible:border-[#439F46] focus-visible:ring-[#439F46]/30",
            rightElement && "pr-12",
            className
          )}
          ref={ref}
          {...props}
        />
        {rightElement && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center justify-center">
            {rightElement}
          </div>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };
