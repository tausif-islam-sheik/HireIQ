"use client";

import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ApplicationsChart } from "@/components/charts/ApplicationsChart";
import { HireFunnelChart } from "@/components/charts/HireFunnelChart";
import { JobStatsChart } from "@/components/charts/JobStatsChart";
import { Users, Briefcase, FileText, CheckCircle, TrendingUp } from "lucide-react";

interface AnalyticsData {
  totalUsers: number;
  totalJobs: number;
  totalApplications: number;
  totalHires: number;
  applicationsByDate: Array<{ date: string; count: number }>;
  statusDistribution: Array<{ status: string; count: number }>;
  monthlyStats: Array<{ month: string; jobs: number; applications: number }>;
}

export default function AdminAnalyticsPage() {
  const { data: analytics, isLoading } = useQuery({
    queryKey: ["admin-analytics"],
    queryFn: async () => {
      const response = await api.get("/admin/analytics");
      return response.data.data as AnalyticsData;
    },
  });

  const statsCards = [
    {
      title: "Total Users",
      value: analytics?.totalUsers || 0,
      icon: Users,
      trend: "+12%",
    },
    {
      title: "Total Jobs",
      value: analytics?.totalJobs || 0,
      icon: Briefcase,
      trend: "+8%",
    },
    {
      title: "Applications",
      value: analytics?.totalApplications || 0,
      icon: FileText,
      trend: "+24%",
    },
    {
      title: "Successful Hires",
      value: analytics?.totalHires || 0,
      icon: CheckCircle,
      trend: "+15%",
    },
  ];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
        <div className="grid lg:grid-cols-2 gap-6">
          <Skeleton className="h-80" />
          <Skeleton className="h-80" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Analytics Dashboard</h1>
        <p className="text-muted-foreground">
          Platform-wide statistics and insights
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsCards.map((stat) => (
          <Card key={stat.title}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <p className="text-3xl font-bold">{stat.value.toLocaleString()}</p>
                </div>
                <div className="p-3 rounded-lg bg-indigo-50 dark:bg-indigo-950">
                  <stat.icon className="h-6 w-6 text-indigo-600" />
                </div>
              </div>
              <div className="flex items-center gap-1 mt-4 text-sm">
                <TrendingUp className="h-4 w-4 text-green-600" />
                <span className="text-green-600">{stat.trend}</span>
                <span className="text-muted-foreground">from last month</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        {analytics?.applicationsByDate && (
          <ApplicationsChart data={analytics.applicationsByDate} />
        )}
        {analytics?.statusDistribution && (
          <HireFunnelChart data={analytics.statusDistribution.map((s) => ({
            status: s.status as any,
            count: s.count,
          }))} />
        )}
      </div>

      {analytics?.monthlyStats && (
        <JobStatsChart data={analytics.monthlyStats} />
      )}

      {/* Additional Stats */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">User Growth</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total users</span>
                <span className="font-medium">{analytics?.totalUsers?.toLocaleString() || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total applications</span>
                <span className="font-medium">{analytics?.totalApplications?.toLocaleString() || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total hires</span>
                <span className="font-medium">{analytics?.totalHires?.toLocaleString() || 0}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Job Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total jobs</span>
                <span className="font-medium">
                  {analytics?.totalJobs?.toLocaleString() || 0}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Avg. applications/job</span>
                <span className="font-medium">
                  {analytics?.totalJobs
                    ? Math.round(analytics.totalApplications / analytics.totalJobs)
                    : 0}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Hire rate</span>
                <span className="font-medium">
                  {analytics?.totalApplications
                    ? `${Math.round((analytics.totalHires / analytics.totalApplications) * 100)}%`
                    : "0%"}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Status Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics?.statusDistribution?.map((status) => (
                <div key={status.status} className="flex justify-between">
                  <span className="text-muted-foreground capitalize">{status.status.replace("_", " ").toLowerCase()}</span>
                  <span className="font-medium">{status.count}</span>
                </div>
              )) || (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">No status data</span>
                  <span className="font-medium">-</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
