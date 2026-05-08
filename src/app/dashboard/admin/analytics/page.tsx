"use client";

import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ApplicationsChart } from "@/components/charts/ApplicationsChart";
import { HireFunnelChart } from "@/components/charts/HireFunnelChart";
import { JobStatsChart } from "@/components/charts/JobStatsChart";
import { UserGrowthChart } from "@/components/charts/UserGrowthChart";

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

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
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
          Deep insights and platform-wide trends
        </p>
      </div>

      {/* Charts - Top Row: 2 columns like reference */}
      <div className="grid lg:grid-cols-2 gap-6">
        {isLoading ? (
          <Skeleton className="h-80" />
        ) : (
          <ApplicationsChart 
            data={analytics?.applicationsByDate?.length ? analytics.applicationsByDate : []} 
          />
        )}
        {isLoading ? (
          <Skeleton className="h-80" />
        ) : (
          <HireFunnelChart 
            data={analytics?.statusDistribution?.length ? analytics.statusDistribution.map((s) => ({
              status: s.status as any,
              count: s.count,
            })) : []} 
          />
        )}
      </div>

      {/* Charts - Bottom Row: 2 columns like reference */}
      <div className="grid lg:grid-cols-2 gap-6">
        {isLoading ? (
          <Skeleton className="h-80" />
        ) : (
          <JobStatsChart 
            data={analytics?.monthlyStats?.length ? analytics.monthlyStats : []} 
          />
        )}
        {/* Additional bar chart for User Growth - matches reference bottom left */}
        <UserGrowthChart 
          totalUsers={analytics?.totalUsers || 0}
          totalApplications={analytics?.totalApplications || 0}
        />
      </div>

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
