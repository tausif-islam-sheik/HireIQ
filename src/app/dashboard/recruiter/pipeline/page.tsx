"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Application, ApplicationStatus } from "@/types";
import { getStatusColor } from "@/lib/utils";
import {
  Briefcase,
  Users,
  User,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Inbox,
  TrendingUp,
  Clock,
  CheckCircle2,
  Search,
  Filter,
  MoreHorizontal,
  Mail,
  Phone,
  FileText,
  ArrowRight,
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { EmptyState } from "@/components/shared/EmptyState";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const pipelineStages: ApplicationStatus[] = [
  "PENDING",
  "REVIEWING",
  "SHORTLISTED",
  "INTERVIEW",
  "HIRED",
  "REJECTED",
];

const stageConfig: Record<ApplicationStatus, {
  label: string;
  color: string;
  bgColor: string;
  borderColor: string;
  icon: typeof User;
}> = {
  PENDING: {
    label: "New Applications",
    color: "text-amber-600",
    bgColor: "bg-amber-50 dark:bg-amber-950/30",
    borderColor: "border-amber-200 dark:border-amber-800",
    icon: Inbox,
  },
  REVIEWING: {
    label: "Under Review",
    color: "text-blue-600",
    bgColor: "bg-blue-50 dark:bg-blue-950/30",
    borderColor: "border-blue-200 dark:border-blue-800",
    icon: FileText,
  },
  SHORTLISTED: {
    label: "Shortlisted",
    color: "text-purple-600",
    bgColor: "bg-purple-50 dark:bg-purple-950/30",
    borderColor: "border-purple-200 dark:border-purple-800",
    icon: TrendingUp,
  },
  INTERVIEW: {
    label: "Interview",
    color: "text-indigo-600",
    bgColor: "bg-indigo-50 dark:bg-indigo-950/30",
    borderColor: "border-indigo-200 dark:border-indigo-800",
    icon: Calendar,
  },
  HIRED: {
    label: "Hired",
    color: "text-emerald-600",
    bgColor: "bg-emerald-50 dark:bg-emerald-950/30",
    borderColor: "border-emerald-200 dark:border-emerald-800",
    icon: CheckCircle2,
  },
  REJECTED: {
    label: "Rejected",
    color: "text-red-600",
    bgColor: "bg-red-50 dark:bg-red-950/30",
    borderColor: "border-red-200 dark:border-red-800",
    icon: Clock,
  },
};

export default function RecruiterPipelinePage() {
  const queryClient = useQueryClient();
  const [selectedJob, setSelectedJob] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const { data: jobs } = useQuery({
    queryKey: ["recruiter-jobs-for-pipeline"],
    queryFn: async () => {
      const response = await api.get("/jobs/my");
      return response.data.data as { id: string; title: string }[];
    },
  });

  const { data: applicationsData, isLoading } = useQuery({
    queryKey: ["pipeline-applications", selectedJob],
    queryFn: async () => {
      const params = selectedJob !== "all" ? { jobId: selectedJob } : {};
      const response = await api.get("/applications/recruiter", { params });
      // Handle both direct array or nested object response
      const data = response.data.data;
      return (data.applications || data || []) as Application[];
    },
  });

  // Ensure applications is always an array
  const applications = Array.isArray(applicationsData) ? applicationsData : [];

  // Filter applications by search query
  const filteredApplications = applications.filter((app) =>
    searchQuery === "" ||
    app.candidate?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    app.job?.title?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const updateStatusMutation = useMutation({
    mutationFn: async ({ applicationId, status }: { applicationId: string; status: ApplicationStatus }) => {
      const response = await api.put(`/applications/${applicationId}/status`, { status });
      return response.data;
    },
    onSuccess: () => {
      toast.success("Application moved");
      queryClient.invalidateQueries({ queryKey: ["pipeline-applications"] });
    },
    onError: () => {
      toast.error("Failed to move application");
    },
  });

  const getApplicationsByStage = (stage: ApplicationStatus) => {
    return filteredApplications?.filter((app) => app.status === stage) || [];
  };

  const stats = {
    total: applications.length,
    new: getApplicationsByStage("PENDING").length,
    reviewing: getApplicationsByStage("REVIEWING").length,
    shortlisted: getApplicationsByStage("SHORTLISTED").length,
    interview: getApplicationsByStage("INTERVIEW").length,
    hired: getApplicationsByStage("HIRED").length,
    rejected: getApplicationsByStage("REJECTED").length,
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        {/* Header Skeleton */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-72" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-10 w-[200px]" />
            <Skeleton className="h-10 w-[180px]" />
          </div>
        </div>

        {/* Stats Cards Skeleton */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>

        {/* Pipeline Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="flex flex-col gap-2">
              <Skeleton className="h-16 rounded-t-lg" />
              <Skeleton className="h-[300px] rounded-b-lg" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Hiring Pipeline</h1>
            <p className="text-muted-foreground mt-1">
              Track and manage candidates through your hiring process
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search candidates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 w-[200px]"
              />
            </div>
            <Select value={selectedJob} onValueChange={(value: string) => setSelectedJob(value)}>
              <SelectTrigger className="w-[180px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by job" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Jobs</SelectItem>
                {jobs?.map((job) => (
                  <SelectItem key={job.id} value={job.id}>
                    {job.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

      </div>

      {/* Stats Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Applicants</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <div className="h-12 w-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                <Users className="h-6 w-6 text-slate-600 dark:text-slate-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-white dark:from-blue-950/30 dark:to-slate-900">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">In Review</p>
                <p className="text-2xl font-bold text-blue-600">
                  {stats.reviewing + stats.shortlisted}
                </p>
              </div>
              <div className="h-12 w-12 rounded-xl bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-indigo-50 to-white dark:from-indigo-950/30 dark:to-slate-900">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">In Interview</p>
                <p className="text-2xl font-bold text-indigo-600">
                  {stats.interview}
                </p>
              </div>
              <div className="h-12 w-12 rounded-xl bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center">
                <Calendar className="h-6 w-6 text-indigo-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-emerald-50 to-white dark:from-emerald-950/30 dark:to-slate-900">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Hired</p>
                <p className="text-2xl font-bold text-emerald-600">
                  {stats.hired}
                </p>
              </div>
              <div className="h-12 w-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center">
                <CheckCircle2 className="h-6 w-6 text-emerald-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {applications && applications.length === 0 ? (
        <EmptyState
          icon={Inbox}
          title="No applications yet"
          description="Applications will appear here when candidates apply to your jobs."
          actionLabel="View Jobs"
          actionHref="/dashboard/recruiter/jobs"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {pipelineStages.map((stage) => {
            const stageApps = getApplicationsByStage(stage);
            const config = stageConfig[stage];
            const StageIcon = config.icon;

            return (
              <div key={stage} className="flex flex-col">
                {/* Stage Header */}
                <div className={`rounded-t-lg border-t border-x ${config.borderColor} ${config.bgColor} p-3`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <StageIcon className={`h-4 w-4 ${config.color}`} />
                      <h3 className="font-semibold text-sm">{config.label}</h3>
                    </div>
                    <Badge
                      variant="secondary"
                      className={`${stageApps.length > 0 ? config.bgColor : "bg-muted"} ${config.color} font-bold`}
                    >
                      {stageApps.length}
                    </Badge>
                  </div>
                  {/* Progress Indicator */}
                  <div className="mt-2 h-1 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${config.color.replace("text-", "bg-")} transition-all duration-500`}
                      style={{ width: stats.total > 0 ? `${(stageApps.length / stats.total) * 100}%` : "0%" }}
                    />
                  </div>
                </div>

                {/* Stage Content */}
                <div className={`border-x border-b ${config.borderColor} rounded-b-lg bg-card flex-1 min-h-[300px] max-h-[500px] overflow-y-auto`}>
                  <div className="p-3 space-y-3">
                    {stageApps.map((application) => (
                      <Card
                        key={application.id}
                        className="group hover:shadow-lg transition-all duration-200 border-border/50 hover:border-border"
                      >
                        <CardContent className="p-3">
                          {/* Candidate Header */}
                          <div className="flex items-start gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback className={`text-xs ${config.bgColor} ${config.color}`}>
                                {application.candidate?.name?.charAt(0) || "?"}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <p className="font-semibold text-sm truncate">
                                  {application.candidate?.name || "Unknown"}
                                </p>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                      <MoreHorizontal className="h-3 w-3" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem asChild>
                                      <Link href={`/dashboard/recruiter/applications/${application.id}`}>
                                        View Details
                                      </Link>
                                    </DropdownMenuItem>
                                    {application.candidate?.email && (
                                      <DropdownMenuItem>
                                        <Mail className="h-4 w-4 mr-2" />
                                        Email Candidate
                                      </DropdownMenuItem>
                                    )}
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                              <p className="text-xs text-muted-foreground truncate">
                                {application.job?.title}
                              </p>
                            </div>
                          </div>

                          {/* AI Score Badge */}
                          {application.aiScore && (
                            <div className="mt-2">
                              <Badge
                                variant="secondary"
                                className={`text-xs font-medium ${
                                  application.aiScore >= 80
                                    ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300"
                                    : application.aiScore >= 60
                                    ? "bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300"
                                    : "bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300"
                                }`}
                              >
                                <TrendingUp className="h-3 w-3 mr-1 inline" />
                                AI Match: {application.aiScore.toFixed(0)}%
                              </Badge>
                            </div>
                          )}

                          {/* Action Buttons */}
                          <div className="flex items-center gap-1 mt-3 pt-2 border-t border-border/50">
                            {stage !== "PENDING" && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 px-2 text-xs hover:bg-slate-100 dark:hover:bg-slate-800"
                                onClick={() =>
                                  updateStatusMutation.mutate({
                                    applicationId: application.id,
                                    status: pipelineStages[pipelineStages.indexOf(stage) - 1],
                                  })
                                }
                              >
                                <ChevronLeft className="h-3 w-3" />
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 px-2 text-xs flex-1"
                              asChild
                            >
                              <Link href={`/dashboard/recruiter/applications/${application.id}`}>
                                View
                              </Link>
                            </Button>
                            {stage !== "REJECTED" && stage !== "HIRED" && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className={`h-7 px-2 text-xs ${config.color} hover:${config.bgColor}`}
                                onClick={() =>
                                  updateStatusMutation.mutate({
                                    applicationId: application.id,
                                    status: pipelineStages[pipelineStages.indexOf(stage) + 1],
                                  })
                                }
                              >
                                <ChevronRight className="h-3 w-3" />
                              </Button>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}

                    {stageApps.length === 0 && (
                      <div className="flex flex-col items-center justify-center py-8 text-center">
                        <div className={`w-12 h-12 rounded-full ${config.bgColor} flex items-center justify-center mb-2`}>
                          <StageIcon className={`h-5 w-5 ${config.color} opacity-50`} />
                        </div>
                        <p className="text-sm text-muted-foreground">
                          No candidates
                        </p>
                        <p className="text-xs text-muted-foreground/60">
                          in this stage
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
