"use client";

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
import { ChartCard } from "./ChartCard";

interface ApplicationsChartProps {
  data: Array<{
    date: string;
    count: number;
  }>;
}

export function ApplicationsChart({ data }: ApplicationsChartProps) {
  const total = data.reduce((sum, d) => sum + d.count, 0);
  const hasData = data.length > 0 && total > 0;
  
  // Use sample months for empty state to show chart structure
  const chartData = hasData ? data : [
    { date: "Jan", count: 0 },
    { date: "Feb", count: 0 },
    { date: "Mar", count: 0 },
    { date: "Apr", count: 0 },
    { date: "May", count: 0 },
    { date: "Jun", count: 0 },
  ];

  return (
    <ChartCard
      title="Applications Over Time"
      subtitle="Platform activity trend"
      total={hasData ? total.toLocaleString() : "0"}
      totalLabel="Total Applications"
    >
      <div className="relative">
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={chartData} barSize={32}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted-foreground) / 0.15)" />
          <XAxis
            dataKey="date"
            tickLine={false}
            axisLine={false}
            tickMargin={10}
            minTickGap={24}
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
            cursor={{ fill: "hsl(var(--muted) / 0.3)" }}
          />
          <Legend
            wrapperStyle={{ fontSize: 12, paddingTop: 12 }}
            iconType="circle"
            iconSize={8}
          />
          <Bar
            dataKey="count"
            name="Applications"
            fill="#8B5CF6"
            radius={[6, 6, 0, 0]}
            opacity={hasData ? 1 : 0.3}
          />
        </BarChart>
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
