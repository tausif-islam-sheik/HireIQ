"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { ApplicationStatus } from "@/types";
import { ChartCard } from "./ChartCard";

interface HireFunnelChartProps {
  data: Array<{
    status: ApplicationStatus;
    count: number;
  }>;
}

const statusColors: Record<ApplicationStatus, string> = {
  PENDING: "#F59E0B",
  REVIEWING: "#3B82F6",
  SHORTLISTED: "#8B5CF6",
  INTERVIEW: "#6366F1",
  REJECTED: "#EF4444",
  HIRED: "#10B981",
};

const statusLabels: Record<ApplicationStatus, string> = {
  PENDING: "Pending",
  REVIEWING: "Reviewing",
  SHORTLISTED: "Shortlisted",
  INTERVIEW: "Interview",
  REJECTED: "Rejected",
  HIRED: "Hired",
};

export function HireFunnelChart({ data }: HireFunnelChartProps) {
  const total = data.reduce((sum, d) => sum + d.count, 0);
  const hasData = data.length > 0 && total > 0;
  
  // Default data structure for empty state
  const defaultData: HireFunnelChartProps['data'] = [
    { status: "PENDING" as ApplicationStatus, count: 0 },
    { status: "REVIEWING" as ApplicationStatus, count: 0 },
    { status: "SHORTLISTED" as ApplicationStatus, count: 0 },
    { status: "INTERVIEW" as ApplicationStatus, count: 0 },
    { status: "HIRED" as ApplicationStatus, count: 0 },
    { status: "REJECTED" as ApplicationStatus, count: 0 },
  ];
  
  const chartData = (hasData ? data : defaultData).map((item) => ({
    name: statusLabels[item.status],
    value: item.count,
    color: statusColors[item.status],
    percent: total > 0 ? ((item.count / total) * 100).toFixed(0) : "0",
  }));

  return (
    <ChartCard
      title="Application Status"
      subtitle="Distribution breakdown"
      total={hasData ? total.toLocaleString() : "0"}
      totalLabel="Total"
    >
      <div className="relative flex items-center gap-4">
        <ResponsiveContainer width="55%" height={240}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={75}
              paddingAngle={3}
              dataKey="value"
              strokeWidth={0}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--popover))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
              }}
              labelStyle={{ color: "hsl(var(--foreground))", fontWeight: 600 }}
              itemStyle={{ color: "hsl(var(--foreground))" }}
              formatter={(value: number, name: string) => {
                const percent = ((value / total) * 100).toFixed(0);
                return [`${value} (${percent}%)`, name];
              }}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="flex-1 space-y-2">
          {chartData.map((item) => (
            <div key={item.name} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-muted-foreground">{item.name}</span>
              </div>
              <span className="font-medium">
                {item.value.toLocaleString()} {hasData && <span className="text-muted-foreground">({item.percent}%)</span>}
              </span>
            </div>
          ))}
        </div>
        {!hasData && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/80">
            <p className="text-sm text-muted-foreground">No data available</p>
          </div>
        )}
      </div>
    </ChartCard>
  );
}
