// components/ui/label.tsx
import * as React from "react"
import { cn } from "@/lib/utils"

export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {}

const Label = React.forwardRef<HTMLLabelElement, LabelProps>(({ className, ...props }, ref) => {
  return (
    <label
      ref={ref}
      className={cn("text-sm font-medium text-gray-700", className)}
      {...props}
    />
  )
})
Label.displayName = "Label"

export { Label }
