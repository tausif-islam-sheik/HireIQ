"use client";

import { StatsCard } from "@/components/dashboard/StatsCard";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { useDashboardStats } from "@/hooks/useDashboardStats";
import { Users, Briefcase, FileText, Building2, LayoutDashboard, BarChart3 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import Link from "next/link";

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
            {[...Array(4)].map((_, i) => (
              <Card key={i}>
                <div className="flex flex-row items-center justify-between space-y-0 p-6 pb-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-4" />
                </div>
                <div className="p-6 pt-0">
                  <Skeleton className="h-8 w-16" />
                  <Skeleton className="h-3 w-32 mt-1" />
                </div>
              </Card>
            ))}
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

      {/* Quick Actions */}
      <div className="grid gap-3 sm:gap-4 grid-cols-2 sm:grid-cols-2 md:grid-cols-4">
        <Button variant="outline" className="h-20 sm:h-24 flex flex-col items-center justify-center gap-2" asChild>
          <Link href="/dashboard/admin/users">
            <Users className="h-5 w-5 sm:h-6 sm:w-6" />
            <span className="text-xs sm:text-sm">Manage Users</span>
          </Link>
        </Button>
        <Button variant="outline" className="h-20 sm:h-24 flex flex-col items-center justify-center gap-2" asChild>
          <Link href="/dashboard/admin/jobs">
            <Briefcase className="h-5 w-5 sm:h-6 sm:w-6" />
            <span className="text-xs sm:text-sm">Manage Jobs</span>
          </Link>
        </Button>
        <Button variant="outline" className="h-20 sm:h-24 flex flex-col items-center justify-center gap-2" asChild>
          <Link href="/dashboard/admin/companies">
            <Building2 className="h-5 w-5 sm:h-6 sm:w-6" />
            <span className="text-xs sm:text-sm">Manage Companies</span>
          </Link>
        </Button>
        <Button variant="outline" className="h-20 sm:h-24 flex flex-col items-center justify-center gap-2" asChild>
          <Link href="/dashboard/admin/analytics">
            <BarChart3 className="h-5 w-5 sm:h-6 sm:w-6" />
            <span className="text-xs sm:text-sm">View Analytics</span>
          </Link>
        </Button>
      </div>

      {/* Recent Activity */}
      {isLoading ? (
        <Card>
          <div className="p-6">
            <Skeleton className="h-6 w-40" />
          </div>
          <div className="p-6 pt-0">
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center gap-4">
                  <Skeleton className="h-9 w-9 rounded-full" />
                  <div className="flex-1 min-w-0 space-y-1">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-48" />
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <Skeleton className="h-5 w-16" />
                    <Skeleton className="h-3 w-12" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      ) : (
        <RecentActivity applications={stats?.recentApplications || []} />
      )}
    </div>
  );
}
