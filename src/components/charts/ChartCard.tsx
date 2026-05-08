"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";

interface ChartCardProps {
  title: string;
  subtitle?: string;
  total?: number | string;
  totalLabel?: string;
  children: React.ReactNode;
}

export function ChartCard({ title, subtitle, total, totalLabel, children }: ChartCardProps) {
  return (
    <Card className="overflow-hidden border border-border/60 bg-card">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            {subtitle && <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>}
          </div>
          {total !== undefined && (
            <div className="text-right">
              <div className="flex items-center gap-1 justify-end">
                <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />
                <span className="text-2xl font-bold tracking-tight">{total}</span>
              </div>
              {totalLabel && <p className="text-xs text-muted-foreground">{totalLabel}</p>}
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-0">{children}</CardContent>
    </Card>
  );
}
