import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline";
}

export function Button({ variant = "primary", className, ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors disabled:opacity-50 disabled:pointer-events-none",
        variant === "primary" && "bg-black text-white hover:bg-zinc-800",
        variant === "secondary" && "bg-zinc-100 text-black hover:bg-zinc-200",
        variant === "outline" && "border border-zinc-300 text-black hover:bg-zinc-50",
        className
      )}
      {...props}
    />
  );
}
