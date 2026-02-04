"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { DataTable } from "@/components/jobs/DataTable";
import {
  dailyTaskReportDummyData,
  dailyTaskReportColumns,
  dailyTasksByDayDummy,
} from "@/data/reportDummyData";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import { KpiCard } from "@/components/reports/KpiCard";
import { CalendarDays, CheckCircle2, Activity, AlertTriangle } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const dateRangeOptions = [
  { value: "7", label: "Last 7 days" },
  { value: "14", label: "Last 14 days" },
  { value: "30", label: "This month" },
];

export default function DailyTaskReportsPage() {
  const [dateRange, setDateRange] = useState("7");
  const total = dailyTaskReportDummyData.length;
  const completed = dailyTaskReportDummyData.filter((r) => r.status === "Completed").length;
  const inProgress = dailyTaskReportDummyData.filter((r) => r.status === "In Progress").length;
  const pending = dailyTaskReportDummyData.filter((r) => r.status === "Pending").length;

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Daily Task Reports
          </h1>
          <p className="text-slate-500 font-medium mt-1">
            Tasks by day, assignees, and due times.
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
        <KpiCard
          label="Total Tasks"
          value={total}
          icon={CalendarDays}
          tone="emerald"
        />
        <KpiCard
          label="Completed"
          value={completed}
          icon={CheckCircle2}
          tone="emerald"
        />
        <KpiCard
          label="In Progress"
          value={inProgress}
          icon={Activity}
          tone="amber"
        />
        <KpiCard
          label="Pending"
          value={pending}
          icon={AlertTriangle}
          tone="slate"
        />
      </div>

      <div className="space-y-3">
        <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest">
          Tasks by Day
        </h2>
        <Card className="border-slate-200 overflow-hidden">
          <CardContent className="p-4">
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={dailyTasksByDayDummy} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} className="text-slate-500" />
                <YAxis tick={{ fontSize: 12 }} className="text-slate-500" />
                <Tooltip
                  contentStyle={{ borderRadius: 8, border: "1px solid rgb(226 232 240)" }}
                  labelStyle={{ fontWeight: 600 }}
                />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="total" name="Total" fill="rgb(1 97 50)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="completed" name="Completed" fill="rgb(16 185 129)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="pending" name="Pending" fill="rgb(245 158 11)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-3">
        <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest">
          Task List
        </h2>
        <DataTable
          columns={dailyTaskReportColumns}
          data={dailyTaskReportDummyData}
          searchKey="taskName"
        />
      </div>
    </div>
  );
}
