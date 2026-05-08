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

interface UserGrowthChartProps {
  totalUsers: number;
  totalApplications: number;
}

export function UserGrowthChart({ totalUsers, totalApplications }: UserGrowthChartProps) {
  // Generate sample monthly data based on totals or zeros if no data
  const hasData = totalUsers > 0 || totalApplications > 0;
  
  const data = hasData
    ? [
        { month: "Jan", users: Math.round(totalUsers * 0.1), apps: Math.round(totalApplications * 0.05) },
        { month: "Feb", users: Math.round(totalUsers * 0.2), apps: Math.round(totalApplications * 0.1) },
        { month: "Mar", users: Math.round(totalUsers * 0.35), apps: Math.round(totalApplications * 0.25) },
        { month: "Apr", users: Math.round(totalUsers * 0.5), apps: Math.round(totalApplications * 0.4) },
        { month: "May", users: Math.round(totalUsers * 0.75), apps: Math.round(totalApplications * 0.7) },
        { month: "Jun", users: totalUsers, apps: totalApplications },
      ]
    : [
        { month: "Jan", users: 0, apps: 0 },
        { month: "Feb", users: 0, apps: 0 },
        { month: "Mar", users: 0, apps: 0 },
        { month: "Apr", users: 0, apps: 0 },
        { month: "May", users: 0, apps: 0 },
        { month: "Jun", users: 0, apps: 0 },
      ];

  return (
    <ChartCard
      title="User Growth"
      subtitle="New users and applications over time"
      total={totalUsers.toLocaleString()}
      totalLabel="Total Users"
    >
      <div className="relative">
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={data} barSize={24}>
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
              cursor={{ fill: "hsl(var(--muted) / 0.3)" }}
            />
            <Legend
              wrapperStyle={{ fontSize: 12, paddingTop: 12 }}
              iconType="circle"
              iconSize={8}
            />
            <Bar
              dataKey="users"
              name="New Users"
              fill="#3B82F6"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="apps"
              name="Applications"
              fill="#8B5CF6"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
        {!hasData && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/80">
            <p className="text-sm text-muted-foreground">No data available</p>
          </div>
        )}
      </div>
    </ChartCard>
  );
}
