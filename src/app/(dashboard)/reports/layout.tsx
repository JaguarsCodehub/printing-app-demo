"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { BarChart2, Palette, Printer, Hammer, CalendarDays } from "lucide-react";

const reportLinks = [
  { href: "/reports/designer", label: "Designer Reports", icon: Palette },
  { href: "/reports/printer", label: "Printer Reports", icon: Printer },
  { href: "/reports/fabricator", label: "Fabricator Reports", icon: Hammer },
  { href: "/reports/daily-tasks", label: "Daily Task Reports", icon: CalendarDays },
];

export default function ReportsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-4">
        <Link
          href="/reports"
          className={cn(
            "flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all border",
            pathname === "/reports"
              ? "bg-blue-50 text-blue-700 border-blue-100 shadow-sm"
              : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:text-slate-900"
          )}
        >
          <BarChart2 className="w-4 h-4" />
          All Reports
        </Link>
        {reportLinks.map((link) => {
          const isActive = pathname === link.href;
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all border",
                isActive
                  ? "bg-blue-50 text-blue-700 border-blue-100 shadow-sm"
                  : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:text-slate-900"
              )}
            >
              <Icon className={cn("w-4 h-4", isActive ? "text-blue-600" : "text-slate-400")} />
              {link.label}
            </Link>
          );
        })}
      </div>
      {children}
    </div>
  );
}
