import * as React from "react"

import { cn } from "@/lib/utils"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md bg-gray-50 dark:bg-slate-700 px-3 py-2 text-base file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus:outline-none hover:bg-white dark:hover:bg-slate-600 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm transition-all shadow-sm",
          className
        )}
        style={{ outline: 'none !important', border: 'none !important' }}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
