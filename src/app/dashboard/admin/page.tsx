"use client";

import { StatsCard } from "@/components/dashboard/StatsCard";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { useDashboardStats } from "@/hooks/useDashboardStats";
import { Users, Briefcase, FileText, Building2, LayoutDashboard, BarChart3 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
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
        <Skeleton className="h-96" />
      ) : (
        <RecentActivity applications={stats?.recentApplications || []} />
      )}
    </div>
  );
}
