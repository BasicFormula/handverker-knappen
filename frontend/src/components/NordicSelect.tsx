import * as React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface NordicSelectProps {
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  options: { value: string; label: string }[];
  className?: string;
  disabled?: boolean;
}

const NordicSelect = React.forwardRef<HTMLButtonElement, NordicSelectProps>(
  ({ value, onValueChange, placeholder, options, className, disabled }, ref) => {
    return (
      <Select value={value} onValueChange={onValueChange} disabled={disabled}>
        <SelectTrigger
          ref={ref}
          className={cn(
            // Nordic glassmorphic styling with warm amber/copper accents
            "bg-gradient-to-br from-cream-100/60 to-cream-200/50",
            "backdrop-blur-sm",
            "border-amber-500/30",
            "text-forest-900",
            // Focus states with warm amber accent
            "focus:ring-amber-500/40",
            "focus:border-amber-500/60",
            "focus:bg-cream-100/90",
            // Hover state
            "hover:border-amber-500/50",
            "hover:bg-cream-100/80",
            // Smooth transitions
            "transition-all duration-200",
            // Shadow for depth with amber glow
            "shadow-sm hover:shadow-md hover:shadow-amber-500/10",
            className
          )}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent className="bg-cream-100/95 backdrop-blur-md border-amber-500/30">
          {options.map((option) => (
            <SelectItem
              key={option.value}
              value={option.value}
              className="text-forest-900 focus:bg-amber-500/20 focus:text-forest-900"
            >
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  }
);
NordicSelect.displayName = "NordicSelect";

export { NordicSelect };
export type { NordicSelectProps };
