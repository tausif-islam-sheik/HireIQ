"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { ChartCard } from "./ChartCard";

interface JobStatsChartProps {
  data: Array<{
    month: string;
    jobs: number;
    applications: number;
  }>;
}

export function JobStatsChart({ data }: JobStatsChartProps) {
  const totalJobs = data.reduce((sum, d) => sum + d.jobs, 0);
  const totalApplications = data.reduce((sum, d) => sum + d.applications, 0);
  const hasData = data.length > 0 && (totalJobs > 0 || totalApplications > 0);
  
  // Default data for empty state
  const chartData = hasData ? data : [
    { month: "Jan", jobs: 0, applications: 0 },
    { month: "Feb", jobs: 0, applications: 0 },
    { month: "Mar", jobs: 0, applications: 0 },
    { month: "Apr", jobs: 0, applications: 0 },
    { month: "May", jobs: 0, applications: 0 },
    { month: "Jun", jobs: 0, applications: 0 },
  ];

  return (
    <ChartCard
      title="Jobs vs Applications"
      subtitle="Monthly posting and apply trends"
      total={hasData ? `${totalJobs} / ${totalApplications}` : "0 / 0"}
      totalLabel="Jobs / Applications"
    >
      <div className="relative">
        <ResponsiveContainer width="100%" height={240}>
          <AreaChart data={chartData}>
          <defs>
            <linearGradient id="colorJobs" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#F97316" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#F97316" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorApps" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted-foreground) / 0.15)" />
          <XAxis
            dataKey="month"
            tickLine={false}
            axisLine={false}
            tickMargin={10}
            tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            tickMargin={10}
            tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(var(--popover))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "8px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
            }}
            labelStyle={{ color: "hsl(var(--foreground))", fontWeight: 600, marginBottom: 4 }}
            itemStyle={{ color: "hsl(var(--foreground))" }}
          />
          <Legend
            wrapperStyle={{ fontSize: 12, paddingTop: 12 }}
            iconType="circle"
            iconSize={8}
          />
          <Area
            type="monotone"
            dataKey="jobs"
            stroke="#F97316"
            strokeWidth={2.5}
            fillOpacity={1}
            fill="url(#colorJobs)"
            dot={{ r: 3, fill: "#F97316", strokeWidth: 0 }}
            activeDot={{ r: 5, strokeWidth: 0 }}
            name="Jobs Posted"
          />
          <Area
            type="monotone"
            dataKey="applications"
            stroke="#8B5CF6"
            strokeWidth={2.5}
            fillOpacity={1}
            fill="url(#colorApps)"
            dot={{ r: 3, fill: "#8B5CF6", strokeWidth: 0 }}
            activeDot={{ r: 5, strokeWidth: 0 }}
            name="Applications"
            hide={!hasData}
          />
        </AreaChart>
        </ResponsiveContainer>
        {!hasData && (
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-sm text-muted-foreground bg-background/80 px-3 py-1.5 rounded-md">No data available</p>
          </div>
        )}
      </div>
    </ChartCard>
  );
}
