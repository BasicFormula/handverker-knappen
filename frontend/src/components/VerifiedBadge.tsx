import React from 'react';
import { ShieldCheck } from 'lucide-react';

interface Props {
  isVerified: boolean;
}

export function VerifiedBadge({ isVerified }: Props) {
  if (!isVerified) {
    return null;
  }

  return (
    <div className="inline-flex items-center rounded-full
                    bg-gradient-to-r from-amber-600/20 to-copper-600/20
                    backdrop-blur-sm
                    px-3 py-1 text-sm font-bold
                    text-amber-200
                    border-2 border-amber-500/40
                    shadow-[0_4px_12px_rgba(217,119,6,0.3)]
                    hover:shadow-[0_6px_16px_rgba(217,119,6,0.5)]
                    transition-all duration-300">
      <ShieldCheck className="mr-1.5 h-5 w-5 text-amber-400" />
      <span>BankID Verified</span>
    </div>
  );
}
