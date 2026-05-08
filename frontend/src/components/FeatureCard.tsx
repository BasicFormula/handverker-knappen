import React from "react";

interface Props {
  icon: React.ElementType;
  title: string;
  description: string;
  step?: number;
}

const FeatureCard = ({ icon: Icon, title, description, step }: Props) => (
  <div className="relative p-6 text-center chamfered glass-surface-light border border-border kinetic-lift overflow-hidden group">
    {/* Nordic geometric pattern overlay */}
    <div className="absolute inset-0 nordic-pattern opacity-[0.08] pointer-events-none" />
    
    {/* Oversized step number with Nordic gradient */}
    {typeof step === 'number' && (
      <span className="type-number absolute -top-2 -left-1 text-8xl md:text-9xl select-none pointer-events-none bg-gradient-to-b from-slate-500/30 to-amber-400/25 bg-clip-text text-transparent">
        {step}
      </span>
    )}

    {/* Glassmorphic depth layer */}
    <div 
      className="absolute inset-0 pointer-events-none rounded-md" 
      style={{ 
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.4), inset 0 -1px 0 rgba(0,0,0,0.05)" 
      }} 
    />

    {/* Icon container with copper accent on hover */}
    <div className="relative z-10 mb-4 flex justify-center">
      <div className="p-4 rounded-xl bg-gradient-to-br from-forest-600/20 to-steel-500/15 group-hover:from-amber-500/30 group-hover:to-copper-500/25 transition-all duration-300 border border-forest-500/20 group-hover:border-amber-500/40">
        <Icon className="w-10 h-10 md:w-12 md:h-12 text-forest-900 group-hover:text-amber-500 transition-colors duration-300" />
      </div>
    </div>

    {/* Text content */}
    <h3 className="relative z-10 text-xl md:text-2xl font-bold mb-2 text-forest-900 font-headline tracking-tight">
      {title}
    </h3>
    <p className="relative z-10 text-sm md:text-base text-slate-600 leading-relaxed font-sans">
      {description}
    </p>
  </div>
)

export default FeatureCard;
