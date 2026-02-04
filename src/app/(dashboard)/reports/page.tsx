"use client";

import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Palette, Printer, Hammer, CalendarDays } from "lucide-react";

const reportCards = [
  { href: "/reports/designer", label: "Designer Reports", description: "Design tasks, completion status, and turnaround.", icon: Palette, color: "bg-purple-50 text-purple-600" },
  { href: "/reports/printer", label: "Printer Reports", description: "Print jobs, quantities, and status by printer.", icon: Printer, color: "bg-blue-50 text-blue-600" },
  { href: "/reports/fabricator", label: "Fabricator Reports", description: "Fabrication jobs and progress by fabricator.", icon: Hammer, color: "bg-amber-50 text-amber-600" },
  { href: "/reports/daily-tasks", label: "Daily Task Reports", description: "Tasks by day, assignees, and due times.", icon: CalendarDays, color: "bg-emerald-50 text-emerald-600" },
];

export default function ReportsHubPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Reports</h1>
        <p className="text-slate-500 font-medium mt-1">
          View designer, printer, fabricator, and daily task reports.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2">
        {reportCards.map((card) => {
          const Icon = card.icon;
          return (
            <Link key={card.href} href={card.href} className="block">
              <Card className="h-full border-slate-200 hover:border-slate-300 hover:shadow-md transition-all cursor-pointer">
                <CardHeader className="flex flex-row items-start gap-4 space-y-0">
                  <div className={cn("rounded-lg p-3", card.color)}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-lg">{card.label}</CardTitle>
                    <CardDescription className="mt-1">{card.description}</CardDescription>
                  </div>
                </CardHeader>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
