import * as React from "react";
import { Textarea, type TextareaProps } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

const NordicTextarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <Textarea
        ref={ref}
        className={cn(
          // Nordic glassmorphic styling with warm amber/copper accents
          "bg-gradient-to-br from-cream-100/60 to-cream-200/50",
          "backdrop-blur-sm",
          "border-amber-500/30",
          "text-forest-900",
          "placeholder:text-slate-600/60",
          // Focus states with warm amber accent
          "focus-visible:ring-amber-500/40",
          "focus-visible:border-amber-500/60",
          "focus-visible:bg-cream-100/90",
          // Hover state
          "hover:border-amber-500/50",
          "hover:bg-cream-100/80",
          // Smooth transitions
          "transition-all duration-200",
          // Shadow for depth with amber glow
          "shadow-sm hover:shadow-md hover:shadow-amber-500/10",
          className
        )}
        {...props}
      />
    );
  }
);
NordicTextarea.displayName = "NordicTextarea";

export { NordicTextarea };
