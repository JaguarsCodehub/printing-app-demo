"use client";

import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

type Tone = "purple" | "blue" | "amber" | "emerald" | "slate";

const toneStyles: Record<
  Tone,
  {
    ring: string;
    iconBg: string;
    iconFg: string;
    accent: string;
  }
> = {
  purple: {
    ring: "hover:ring-purple-200/60",
    iconBg: "bg-purple-600/10",
    iconFg: "text-purple-700",
    accent: "from-purple-500/15 via-purple-500/5 to-transparent",
  },
  blue: {
    ring: "hover:ring-blue-200/60",
    iconBg: "bg-blue-600/10",
    iconFg: "text-blue-700",
    accent: "from-blue-500/15 via-blue-500/5 to-transparent",
  },
  amber: {
    ring: "hover:ring-amber-200/60",
    iconBg: "bg-amber-600/10",
    iconFg: "text-amber-700",
    accent: "from-amber-500/15 via-amber-500/5 to-transparent",
  },
  emerald: {
    ring: "hover:ring-emerald-200/60",
    iconBg: "bg-emerald-600/10",
    iconFg: "text-emerald-700",
    accent: "from-emerald-500/15 via-emerald-500/5 to-transparent",
  },
  slate: {
    ring: "hover:ring-slate-200/70",
    iconBg: "bg-slate-900/5",
    iconFg: "text-slate-700",
    accent: "from-slate-500/15 via-slate-500/5 to-transparent",
  },
};

export function KpiCard({
  label,
  value,
  hint,
  icon: Icon,
  tone = "slate",
}: {
  label: string;
  value: React.ReactNode;
  hint?: string;
  icon: LucideIcon;
  tone?: Tone;
}) {
  const t = toneStyles[tone];

  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-slate-200 bg-white/80 backdrop-blur",
        "shadow-[0_1px_0_0_rgba(15,23,42,0.04)] hover:shadow-[0_10px_30px_-20px_rgba(15,23,42,0.30)]",
        "transition-all duration-200 ring-1 ring-transparent",
        t.ring
      )}
    >
      <div className={cn("absolute inset-0 bg-linear-to-br", t.accent)} />
      <div className="relative p-4 flex items-start gap-4">
        <div
          className={cn(
            "w-11 h-11 rounded-2xl flex items-center justify-center border border-white/60",
            t.iconBg
          )}
        >
          <Icon className={cn("w-5 h-5", t.iconFg)} />
        </div>

        <div className="min-w-0 flex-1">
          <div className="text-[16px] font-medium text-slate-800 tracking-tight leading-none">
            {label}
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <div className="text-2xl font-black tracking-tight text-slate-900">
              {value}
            </div>
            {hint && (
              <div className="text-xs font-semibold text-slate-500 truncate">
                {hint}
              </div>
            )}
          </div>
        </div>

        <div className="hidden md:block text-[10px] font-bold text-slate-300 tracking-widest">
          •••
        </div>
      </div>
    </div>
  );
}

