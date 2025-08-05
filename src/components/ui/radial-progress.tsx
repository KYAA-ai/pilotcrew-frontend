import { cn } from "@/lib/utils"
import { cva, type VariantProps } from "class-variance-authority"
import * as React from "react"

const radialProgressVariants = cva(
  "relative inline-flex items-center justify-center",
  {
    variants: {
      size: {
        sm: "w-20 h-20",
        md: "w-24 h-24", 
        lg: "w-32 h-32",
        xl: "w-40 h-40",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
)

interface RadialProgressProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof radialProgressVariants> {
  value: number
  max?: number
  strokeWidth?: number
  showValue?: boolean
  label?: string
}

const RadialProgress = React.forwardRef<HTMLDivElement, RadialProgressProps>(
  ({ className, size, value, max = 100, strokeWidth = 6, showValue = true, label, ...props }, ref) => {
    const radius = size === "sm" ? 32 : size === "lg" ? 56 : size === "xl" ? 72 : 40
    const circumference = 2 * Math.PI * (radius - strokeWidth / 2)
    const progress = Math.min(Math.max(value / max, 0), 1)
    const strokeDasharray = circumference
    const strokeDashoffset = circumference * (1 - progress)

    return (
      <div
        ref={ref}
        className={cn("flex flex-col items-center", className)}
        {...props}
      >
        <div className={cn(radialProgressVariants({ size }), "relative")}>
          <svg
            className="absolute inset-0 w-full h-full -rotate-90"
            viewBox={`0 0 ${radius * 2} ${radius * 2}`}
          >
            {/* Background circle */}
            <circle
              cx={radius}
              cy={radius}
              r={radius - strokeWidth / 2}
              stroke="currentColor"
              strokeWidth={strokeWidth}
              fill="none"
              className="text-muted"
            />
            {/* Progress circle */}
            <circle
              cx={radius}
              cy={radius}
              r={radius - strokeWidth / 2}
              stroke="currentColor"
              strokeWidth={strokeWidth}
              fill="none"
              strokeLinecap="round"
              strokeDasharray={strokeDasharray}
              strokeDashoffset={strokeDashoffset}
              className="text-primary transition-all duration-300 ease-in-out"
            />
          </svg>
          
          {/* Content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            {showValue && (
              <div className="text-lg font-bold">
                {value}/{max}
              </div>
            )}
          </div>
        </div>
        
        {/* Label outside the circle */}
        {label && (
          <div className="text-xs text-muted-foreground mt-2 text-center">
            {label}
          </div>
        )}
      </div>
    )
  }
)

RadialProgress.displayName = "RadialProgress"

export { RadialProgress, radialProgressVariants }
