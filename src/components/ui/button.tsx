import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow-button hover:bg-primary/90 hover:shadow-lg hover:-translate-y-0.5",
        destructive: "bg-destructive text-destructive-foreground shadow-button hover:bg-destructive/90",
        outline: "border-2 border-border bg-background shadow-sm hover:bg-muted hover:border-primary/20 hover:text-foreground hover:-translate-y-0.5",
        secondary: "bg-secondary text-secondary-foreground shadow-button hover:bg-secondary/90 hover:shadow-lg hover:-translate-y-0.5",
        ghost: "hover:bg-muted hover:text-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        accent: "bg-accent text-accent-foreground shadow-button hover:bg-accent/90 hover:shadow-lg hover:-translate-y-0.5",
        hero: "bg-gradient-to-r from-primary to-primary/80 text-primary-foreground shadow-premium hover:shadow-xl hover:-translate-y-1 hover:from-primary/90 hover:to-primary/70 font-semibold",
        cta: "bg-gradient-to-r from-accent to-accent/80 text-accent-foreground shadow-premium hover:shadow-xl hover:-translate-y-1 hover:from-accent/90 hover:to-accent/70 font-semibold",
      },
      size: {
        default: "h-11 px-6 py-2",
        sm: "h-9 rounded-lg px-4 text-xs",
        lg: "h-12 rounded-xl px-8 text-base",
        xl: "h-14 rounded-xl px-10 text-lg font-bold",
        icon: "h-11 w-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

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