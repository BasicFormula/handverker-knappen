import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface HelperButtonProps {
  className?: string;
  onClick?: () => void;
}

export const HelperButton: React.FC<HelperButtonProps> = ({ className, onClick }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      navigate("/service-request-page");
    }
  };

  return (
    <Button
      onClick={handleClick}
      className={cn(
        // Nordic glassmorphic base
        "bg-gradient-to-br from-amber-400 via-amber-500 to-copper-600",
        "backdrop-blur-sm",
        "border-2 border-amber-600/30",
        "text-white font-headline font-bold text-lg tracking-wide",
        // Metallic workshop effects
        "shadow-[0_8px_16px_rgba(0,0,0,0.3),inset_0_2px_4px_rgba(255,255,255,0.3)]",
        // Hover state
        "hover:shadow-[0_12px_24px_rgba(217,119,6,0.4),inset_0_2px_4px_rgba(255,255,255,0.4)]",
        "hover:scale-105",
        "hover:bg-gradient-to-br hover:from-amber-500 hover:via-copper-500 hover:to-copper-700",
        // Active/pressed state
        "active:scale-95",
        "active:shadow-[0_4px_8px_rgba(0,0,0,0.4),inset_0_4px_8px_rgba(0,0,0,0.2)]",
        // Smooth transitions
        "transition-all duration-200",
        // Sizing
        "px-8 py-4 rounded-xl",
        className
      )}
    >
      HELPER
      <span className="text-sm font-normal ml-2">BUTTON</span>
    </Button>
  );
};
