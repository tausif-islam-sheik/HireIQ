"use client";

import { StatsCard } from "@/components/dashboard/StatsCard";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { useDashboardStats } from "@/hooks/useDashboardStats";
import { Users, Briefcase, FileText, Building2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function AdminDashboardPage() {
  const { data: stats, isLoading, error } = useDashboardStats();

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>Failed to load dashboard data</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground">Overview of platform activity</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {isLoading ? (
          <>
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
          </>
        ) : (
          <>
            <StatsCard
              title="Total Users"
              value={stats?.totalUsers || 0}
              description="Registered users"
              icon={Users}
            />
            <StatsCard
              title="Total Jobs"
              value={stats?.totalJobs || 0}
              description="Active job postings"
              icon={Briefcase}
            />
            <StatsCard
              title="Applications"
              value={stats?.totalApplications || 0}
              description="Total applications received"
              icon={FileText}
            />
            <StatsCard
              title="Companies"
              value={stats?.totalCompanies || 0}
              description="Registered companies"
              icon={Building2}
            />
          </>
        )}
      </div>

      {/* Recent Activity */}
      <div className="grid gap-6 lg:grid-cols-2">
        {isLoading ? (
          <>
            <Skeleton className="h-96" />
            <Skeleton className="h-96" />
          </>
        ) : (
          <>
            <RecentActivity applications={stats?.recentApplications || []} />
            <RecentActivity applications={stats?.recentApplications || []} title="Top Performing Jobs" />
          </>
        )}
      </div>
    </div>
  );
}
