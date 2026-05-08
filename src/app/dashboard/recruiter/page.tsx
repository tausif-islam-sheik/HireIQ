"use client";

import { StatsCard } from "@/components/dashboard/StatsCard";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { ApplicationsChart } from "@/components/charts/ApplicationsChart";
import { useDashboardStats } from "@/hooks/useDashboardStats";
import { Briefcase, FileText, Eye, UserCheck } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function RecruiterDashboardPage() {
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Recruiter Dashboard</h1>
          <p className="text-muted-foreground">Manage your jobs and applications</p>
        </div>
        <Button asChild className="w-full sm:w-auto">
          <Link href="/dashboard/recruiter/jobs/new">Post New Job</Link>
        </Button>
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
              title="My Jobs"
              value={stats?.myJobs || 0}
              description="Active job postings"
              icon={Briefcase}
            />
            <StatsCard
              title="Total Applications"
              value={stats?.myApplications || 0}
              description="Applications received"
              icon={FileText}
            />
            <StatsCard
              title="Pending Review"
              value={stats?.pendingReviews || 0}
              description="Applications to review"
              icon={Eye}
            />
            <StatsCard
              title="Shortlisted"
              value={stats?.interviewCount || 0}
              description="Candidates for interview"
              icon={UserCheck}
            />
          </>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-3">
        <Button variant="outline" className="h-20 sm:h-24 flex flex-col items-center justify-center gap-2" asChild>
          <Link href="/dashboard/recruiter/jobs">
            <Briefcase className="h-5 w-5 sm:h-6 sm:w-6" />
            <span className="text-sm sm:text-base">Manage Jobs</span>
          </Link>
        </Button>
        <Button variant="outline" className="h-20 sm:h-24 flex flex-col items-center justify-center gap-2" asChild>
          <Link href="/dashboard/recruiter/applications">
            <FileText className="h-5 w-5 sm:h-6 sm:w-6" />
            <span className="text-sm sm:text-base">View Applications</span>
          </Link>
        </Button>
        <Button variant="outline" className="h-20 sm:h-24 flex flex-col items-center justify-center gap-2" asChild>
          <Link href="/dashboard/recruiter/company">
            <Eye className="h-5 w-5 sm:h-6 sm:w-6" />
            <span className="text-sm sm:text-base">Company Profile</span>
          </Link>
        </Button>
      </div>

      {/* Charts & Activity */}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        {isLoading ? (
          <Skeleton className="h-80" />
        ) : (
          <ApplicationsChart data={stats?.applicationsByDate || []} />
        )}
        <RecentActivity applications={stats?.recentApplications || []} title="Recent Applications" />
      </div>
    </div>
  );
}
