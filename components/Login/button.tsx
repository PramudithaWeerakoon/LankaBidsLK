import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-full text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-700 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50", // Dark blue focus ring
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-r from-blue-800 to-blue-600 text-white shadow-sm hover:from-blue-900 hover:to-blue-700", // Dark blue gradient
        destructive:
          "bg-red-500 text-white shadow-sm hover:bg-red-600", // Kept as red for destructive
        outline:
          "border border-gray-300 bg-transparent shadow-sm hover:bg-blue-50 hover:text-blue-600", // Blue on hover
        secondary:
          "bg-blue-100 text-blue-700 shadow-sm hover:bg-blue-200", // Secondary variant with lighter blue
        ghost: "hover:bg-blue-50 hover:text-blue-600", // Ghost style with blue
        link: "text-blue-500 underline-offset-4 hover:underline",
      },
      size: {
        default: "h-12 w-full px-4 py-3", // Matching input size (h-12, w-full)
        sm: "h-10 px-3 text-xs", // Smaller size
        lg: "h-14 px-8", // Larger size if needed
        icon: "h-12 w-12", // Icon button with same height as input
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default", // Default to match the input size
    },
  }
);

 


export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
