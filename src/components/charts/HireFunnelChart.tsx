"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ApplicationStatus } from "@/types";

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
  const chartData = data.map((item) => ({
    name: statusLabels[item.status],
    value: item.count,
    color: statusColors[item.status],
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Application Status Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "6px",
              }}
              labelStyle={{ color: "hsl(var(--foreground))" }}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
