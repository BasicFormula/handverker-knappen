import React from "react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

interface RedDomeButtonProps {
  className?: string;
  onClick?: () => void;
}

export const RedDomeButton: React.FC<RedDomeButtonProps> = ({
  className,
  onClick,
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      navigate("/service-request-page");
    }
  };

  return (
    <div className={cn("relative flex justify-center items-center py-10", className)}>
      <button
        onClick={handleClick}
        className="group relative w-64 h-64 rounded-full transition-transform duration-100 active:scale-95 outline-none"
        aria-label="Start service request"
      >
        {/* Floor Shadow */}
        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-56 h-12 bg-black/40 blur-xl rounded-[100%] z-[-1]"></div>

        {/* Metallic Base (Cylinder Side) - Nordic slate tones */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-b from-slate-400 via-slate-300 to-slate-600 shadow-[0_10px_20px_rgba(0,0,0,0.5)]"></div>
        
        {/* Metallic Top Surface (Rim) - Warm cream/slate mix */}
        <div className="absolute inset-1 rounded-full bg-gradient-to-br from-cream-100 via-slate-300 to-slate-400"></div>

        {/* Dark Inner Groove */}
        <div className="absolute inset-4 rounded-full bg-forest-900 shadow-[inset_0_2px_4px_rgba(0,0,0,0.8)]"></div>

        {/* Amber/Copper Glow Ring (Base of Dome) */}
        <div className="absolute inset-[1.1rem] rounded-full bg-amber-500 blur-sm animate-pulse-slow opacity-80"></div>

        {/* The Nordic Amber/Copper Dome */}
        <div className="absolute inset-5 rounded-full bg-gradient-to-b from-amber-400 via-amber-500 to-copper-600 shadow-[inset_0_2px_15px_rgba(255,255,255,0.4),0_5px_15px_rgba(0,0,0,0.4)] flex items-center justify-center overflow-hidden">
          
          {/* Main Glossy Highlight (Top Left) */}
          <div className="absolute top-[8%] left-[12%] w-[45%] h-[30%] bg-gradient-to-b from-white/90 to-transparent rounded-[100%] transform -rotate-45 filter blur-[1px]"></div>
          
          {/* Secondary Glossy Highlight (Smaller, brighter) */}
          <div className="absolute top-[12%] left-[15%] w-[15%] h-[10%] bg-white rounded-[100%] transform -rotate-45 filter blur-[2px]"></div>

          {/* Bottom Right Reflection/Bounce Light - warm workshop glow */}
          <div className="absolute bottom-[5%] right-[15%] w-[50%] h-[35%] bg-gradient-to-t from-copper-400/30 to-transparent rounded-[100%] transform -rotate-12 filter blur-[8px]"></div>
          
          {/* Inner Shadow for depth */}
          <div className="absolute inset-0 rounded-full shadow-[inset_0_0_20px_rgba(0,0,0,0.5)] pointer-events-none"></div>

        </div>
        
        {/* Active State Overlay (Darkens on press) */}
        <div className="absolute inset-5 rounded-full bg-black/20 opacity-0 group-active:opacity-100 transition-opacity duration-100 pointer-events-none"></div>
      </button>
    </div>
  );
};
