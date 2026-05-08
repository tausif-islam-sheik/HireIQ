"use client";

import { StatsCard } from "@/components/dashboard/StatsCard";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { ApplicationsChart } from "@/components/charts/ApplicationsChart";
import { useDashboardStats } from "@/hooks/useDashboardStats";
import { FileText, Heart, Calendar, CheckCircle2, Briefcase } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function CandidateDashboardPage() {
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">My Dashboard</h1>
          <p className="text-muted-foreground">Track your job applications and interviews</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/candidate/jobs">Find Jobs</Link>
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
              title="Applications"
              value={stats?.myApplications || 0}
              description="Jobs you applied to"
              icon={FileText}
            />
            <StatsCard
              title="Interviews"
              value={stats?.interviewCount || 0}
              description="Scheduled interviews"
              icon={Calendar}
            />
            <StatsCard
              title="Saved Jobs"
              value={stats?.savedJobs || 0}
              description="Jobs saved for later"
              icon={Heart}
            />
            <StatsCard
              title="Hired"
              value={0}
              description="Successful applications"
              icon={CheckCircle2}
            />
          </>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-3">
        <Button
          variant="outline"
          className="h-24 flex flex-col items-center justify-center gap-2 glass-button glass-button-hover transition-all duration-300 group"
          asChild
        >
          <Link href="/dashboard/candidate/jobs">
            <Briefcase className="h-6 w-6 group-hover:scale-110 transition-transform duration-300" />
            <span>Browse Jobs</span>
          </Link>
        </Button>
        <Button
          variant="outline"
          className="h-24 flex flex-col items-center justify-center gap-2 glass-button glass-button-hover transition-all duration-300 group"
          asChild
        >
          <Link href="/dashboard/candidate/applications">
            <FileText className="h-6 w-6 group-hover:scale-110 transition-transform duration-300" />
            <span>My Applications</span>
          </Link>
        </Button>
        <Button
          variant="outline"
          className="h-24 flex flex-col items-center justify-center gap-2 glass-button glass-button-hover transition-all duration-300 group"
          asChild
        >
          <Link href="/dashboard/candidate/resume">
            <Calendar className="h-6 w-6 group-hover:scale-110 transition-transform duration-300" />
            <span>Update Resume</span>
          </Link>
        </Button>
      </div>

      {/* Charts & Activity */}
      <div className="grid gap-6 lg:grid-cols-2">
        {isLoading ? (
          <Skeleton className="h-80" />
        ) : (
          <ApplicationsChart data={stats?.applicationsByDate || []} />
        )}
        {isLoading ? (
          <Skeleton className="h-96" />
        ) : (
          <RecentActivity applications={stats?.recentApplications || []} title="My Applications" />
        )}
      </div>
    </div>
  );
}
