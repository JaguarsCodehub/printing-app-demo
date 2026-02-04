"use client";

import { useState } from "react";
import { DataTable } from "@/components/jobs/DataTable";
import {
  fabricatorReportDummyData,
  fabricatorReportColumns,
} from "@/data/reportDummyData";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import { KpiCard } from "@/components/reports/KpiCard";
import { Hammer, CheckCircle2, Activity, Percent } from "lucide-react";

const dateRangeOptions = [
  { value: "7", label: "Last 7 days" },
  { value: "30", label: "Last 30 days" },
  { value: "90", label: "This quarter" },
];

export default function FabricatorReportsPage() {
  const [dateRange, setDateRange] = useState("30");
  const total = fabricatorReportDummyData.length;
  const completed = fabricatorReportDummyData.filter((r) => r.status === "READY").length;
  const pending = fabricatorReportDummyData.filter((r) => r.status === "FABRICATION").length;

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Fabricator Reports
          </h1>
          <p className="text-slate-500 font-medium mt-1">
            Fabrication jobs and progress by fabricator.
          </p>
        </div>
        <Select value={dateRange} onValueChange={setDateRange}>
          <SelectTrigger className="w-[180px] bg-white border-slate-200">
            <SelectValue placeholder="Date range" />
          </SelectTrigger>
          <SelectContent>
            {dateRangeOptions.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Total Jobs" value={total} icon={Hammer} tone="amber" />
        <KpiCard
          label="Completed"
          value={completed}
          icon={CheckCircle2}
          tone="emerald"
        />
        <KpiCard
          label="In Progress"
          value={pending}
          icon={Activity}
          tone="purple"
        />
        <KpiCard
          label="Completion"
          value={`${total ? Math.round((completed / total) * 100) : 0}%`}
          icon={Percent}
          tone="slate"
        />
      </div>

      <div className="space-y-3">
        <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest">
          Fabrication Jobs
        </h2>
        <DataTable
          columns={fabricatorReportColumns}
          data={fabricatorReportDummyData}
          searchKey="jobTitle"
        />
      </div>
    </div>
  );
}
