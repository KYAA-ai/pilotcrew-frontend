import { cn } from "@/lib/utils"
import { cva, type VariantProps } from "class-variance-authority"
import * as React from "react"

const halfRadialProgressVariants = cva(
  "relative inline-flex items-center justify-center",
  {
    variants: {
      size: {
        sm: "w-24 h-12",
        md: "w-32 h-16", 
        lg: "w-48 h-24",
        xl: "w-56 h-28",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
)

interface HalfRadialProgressProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof halfRadialProgressVariants> {
  value: number
  max?: number
  strokeWidth?: number
  showValue?: boolean
  label?: string
}

const HalfRadialProgress = React.forwardRef<HTMLDivElement, HalfRadialProgressProps>(
  ({ className, size, value, max = 100, strokeWidth = 10, showValue = true, label, ...props }, ref) => {
    const radius = size === "sm" ? 40 : size === "lg" ? 80 : size === "xl" ? 100 : 56
    const circumference = Math.PI * (radius - strokeWidth / 2) // Half circle circumference
    const progress = Math.min(Math.max(value / max, 0), 1)
    const strokeDasharray = circumference
    const strokeDashoffset = circumference * progress

    return (
      <div
        ref={ref}
        className={cn("flex flex-col items-center", className)}
        {...props}
      >
        <div className={cn(halfRadialProgressVariants({ size }), "relative")}>
          <svg
            className="absolute inset-0 w-full h-full"
            viewBox={`0 0 ${radius * 2} ${radius}`}
            style={{ overflow: 'visible' }}
          >
            {/* Clip path to show only top half */}
            <defs>
              <clipPath id={`half-circle-${size}`}>
                <rect x="0" y="0" width={radius * 2} height={radius} />
              </clipPath>
            </defs>
            
            {/* Background circle (top half only) */}
            <circle
              cx={radius}
              cy={radius}
              r={radius - strokeWidth / 2}
              stroke="currentColor"
              strokeWidth={strokeWidth}
              fill="none"
              className="text-muted"
              clipPath={`url(#half-circle-${size})`}
            />
                         {/* Progress circle (top half only) */}
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
               className="text-[#2d7ee8] transition-all duration-300 ease-in-out"
               clipPath={`url(#half-circle-${size})`}
               transform={`scale(-1, 1) translate(-${radius * 2}, 0)`}
             />
          </svg>
          
                     {/* Content below the arc */}
           <div className="absolute inset-x-0 bottom-0 flex flex-col items-center justify-center text-center">
             {showValue && (
               <div className="text-3xl font-bold text-foreground">
                 {value}/{max}
               </div>
             )}
           </div>
        </div>
        
        {/* Label outside the component */}
        {label && (
          <div className="text-xs text-muted-foreground mt-3 text-center">
            {label}
          </div>
        )}
      </div>
    )
  }
)

HalfRadialProgress.displayName = "HalfRadialProgress"

export { HalfRadialProgress, halfRadialProgressVariants }

