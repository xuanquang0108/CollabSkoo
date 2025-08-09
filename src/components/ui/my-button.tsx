// src/components/ui/my-button.tsx

import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils"; // đảm bảo bạn có utils này

const myButtonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "!bg-primary !text-white hover:!bg-neutral-800 !p-2 !rounded-xl",
        ghost: "bg-transparent text-white hover:bg-white/10",
      },
      size: {
        sm: "px-3 py-1.5",
        md: "px-4 py-2",
        lg: "px-6 py-3",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);

interface MyButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "ghost";
  size?: "sm" | "md" | "lg";
}

export function MyButton({ className, variant, size, ...props }: MyButtonProps) {
  return (
    <button
      className={cn(myButtonVariants({ variant, size }), className)}
      {...props}
    />
  );
}
