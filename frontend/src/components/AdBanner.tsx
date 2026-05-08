import React from "react";
import { cn } from "utils/cn";

export type AdBannerFormat = "square" | "vertical" | "wide";

export interface AdBannerProps {
  format?: AdBannerFormat;
  eyebrow?: string;
  headline: string;
  body: string;
  bullet?: string;
  cta: string;
  footerNote?: string;
  link?: string;
}

const sizeClasses: Record<AdBannerFormat, string> = {
  square: "w-full max-w-[420px] aspect-square",
  vertical: "w-full max-w-[320px] aspect-[9/16]",
  wide: "w-full max-w-[640px] aspect-[5/3]",
};

export const AdBanner: React.FC<AdBannerProps> = ({
  format = "square",
  eyebrow,
  headline,
  body,
  bullet,
  cta,
  footerNote,
  link = "#",
}) => {
  return (
    <div
      className={cn(
        "relative overflow-hidden chamfered border border-white/15 shadow-[0_30px_80px_rgba(16,24,40,0.35)]",
        "bg-white/70 backdrop-blur-2xl text-left text-forest-900",
        "flex flex-col justify-between transition-transform hover:scale-[1.01] duration-300",
        sizeClasses[format],
      )}
    >
      {/* Gradient + pattern layers */}
      <div className="absolute inset-0 bg-gradient-to-br from-forest-900/15 via-steel-700/10 to-slate-600/8 opacity-70" />
      <div className="absolute inset-0 nordic-pattern opacity-25 mix-blend-soft-light" />
      <div className="absolute inset-0 bg-white/35" />
      <div className="absolute inset-0 border border-white/25" />

      <div className="relative z-10 flex h-full flex-col gap-4 p-8">
        {eyebrow && (
          <span className="text-xs uppercase tracking-[0.35em] text-slate-600">
            {eyebrow}
          </span>
        )}

        <div className="space-y-3">
          <h3 className="type-headline bg-gradient-to-r from-forest-900 via-slate-700 to-amber-500 bg-clip-text text-transparent">
            {headline}
          </h3>
          <p className="text-base leading-relaxed text-slate-700">{body}</p>
        </div>

        {bullet && (
          <div className="flex items-center gap-3 rounded-2xl border border-white/60 bg-white/50 px-4 py-2 shadow-inner">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-copper-500 text-white font-semibold tracking-[0.15em]">
              ★
            </div>
            <p className="text-sm font-medium text-slate-700">{bullet}</p>
          </div>
        )}

        <div className="mt-auto">
          <a
            href={link}
            target={link.startsWith("http") ? "_blank" : undefined}
            rel={link.startsWith("http") ? "noopener noreferrer" : undefined}
            className="inline-block rounded-2xl bg-gradient-to-r from-amber-500 to-copper-500 px-6 py-3 text-xs font-semibold uppercase tracking-[0.4em] text-white shadow-lg shadow-amber-500/40 hover:shadow-amber-500/60 transition-shadow"
          >
            {cta}
          </a>
          {footerNote && (
            <p className="mt-3 text-xs text-slate-600">{footerNote}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdBanner;
