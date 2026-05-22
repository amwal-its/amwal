import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    return (
      <button
        className={cn(
          "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-base font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amwal-green/50 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98] cursor-pointer selection:bg-transparent",
          // Variants
          variant === "default" &&
            "bg-amwal-green text-white hover:bg-amwal-green-hover shadow-md hover:shadow-lg shadow-amwal-green/10",
          variant === "outline" &&
            "border border-amwal-green/30 bg-transparent text-amwal-green hover:bg-amwal-green-light hover:border-amwal-green/60",
          variant === "ghost" &&
            "text-amwal-gray hover:text-amwal-green hover:bg-amwal-green-muted/30",
          variant === "link" &&
            "text-amwal-green underline-offset-4 hover:underline",
          // Sizes
          size === "default" && "h-[50px] px-6 py-2.5",
          size === "sm" && "h-9 px-3 text-sm",
          size === "lg" && "h-[54px] px-8 text-lg",
          size === "icon" && "h-11 w-11",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button };
