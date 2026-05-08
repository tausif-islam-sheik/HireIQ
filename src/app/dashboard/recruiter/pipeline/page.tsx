"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
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
import { Briefcase, Users, ArrowRight, User, Calendar, Mail, Inbox } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { EmptyState } from "@/components/shared/EmptyState";

const pipelineStages: ApplicationStatus[] = [
  "PENDING",
  "REVIEWING",
  "SHORTLISTED",
  "INTERVIEW",
  "HIRED",
  "REJECTED",
];

const stageLabels: Record<ApplicationStatus, string> = {
  PENDING: "New Applications",
  REVIEWING: "Under Review",
  SHORTLISTED: "Shortlisted",
  INTERVIEW: "Interview",
  HIRED: "Hired",
  REJECTED: "Rejected",
};

export default function RecruiterPipelinePage() {
  const queryClient = useQueryClient();
  const [selectedJob, setSelectedJob] = useState<string>("all");

  const { data: jobs } = useQuery({
    queryKey: ["recruiter-jobs-for-pipeline"],
    queryFn: async () => {
      const response = await api.get("/jobs");
      return response.data.data.jobs as { id: string; title: string }[];
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
    return applications?.filter((app) => app.status === stage) || [];
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-96" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Hiring Pipeline</h1>
          <p className="text-muted-foreground">
            Track candidates through your hiring process
          </p>
        </div>
        <Select value={selectedJob} onValueChange={(value: string) => setSelectedJob(value)}>
          <SelectTrigger className="w-[200px]">
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

      {applications && applications.length === 0 ? (
        <EmptyState
          icon={Inbox}
          title="No applications yet"
          description="Applications will appear here when candidates apply to your jobs."
          actionLabel="View Jobs"
          actionHref="/dashboard/recruiter/jobs"
        />
      ) : (
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 overflow-x-auto">
        {pipelineStages.map((stage) => {
          const stageApps = getApplicationsByStage(stage);
          return (
            <div key={stage} className="min-w-[200px]">
              <Card className="h-full">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium">
                      {stageLabels[stage]}
                    </CardTitle>
                    <Badge variant="secondary" className={getStatusColor(stage)}>
                      {stageApps.length}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {stageApps.map((application) => (
                    <Card key={application.id} className="cursor-pointer hover:shadow-md transition-shadow">
                      <CardContent className="p-3">
                        <div className="flex items-start gap-2 mb-2">
                          <User className="h-4 w-4 text-muted-foreground mt-0.5" />
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm truncate">
                              {application.candidate?.name || "Unknown"}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {application.job.title}
                            </p>
                          </div>
                        </div>

                        {application.aiScore && (
                          <Badge
                            variant="secondary"
                            className={`text-xs ${
                              application.aiScore >= 80
                                ? "bg-green-100 text-green-700"
                                : application.aiScore >= 60
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            AI: {application.aiScore.toFixed(0)}%
                          </Badge>
                        )}

                        {/* Move Actions */}
                        <div className="flex gap-1 mt-2">
                          {stage !== "PENDING" && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 px-2 text-xs"
                              onClick={() =>
                                updateStatusMutation.mutate({
                                  applicationId: application.id,
                                  status: pipelineStages[pipelineStages.indexOf(stage) - 1],
                                })
                              }
                            >
                              ←
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 px-2 text-xs flex-1"
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
                              className="h-6 px-2 text-xs"
                              onClick={() =>
                                updateStatusMutation.mutate({
                                  applicationId: application.id,
                                  status: pipelineStages[pipelineStages.indexOf(stage) + 1],
                                })
                              }
                            >
                              →
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}

                  {stageApps.length === 0 && (
                    <EmptyState
                      icon={Users}
                      title=""
                      description="No candidates in this stage"
                    />
                  )}
                </CardContent>
              </Card>
            </div>
          );
        })}
      </div>
      )}

      {/* Pipeline Stats */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Applicants</p>
                <p className="text-2xl font-bold">{applications?.length || 0}</p>
              </div>
              <Users className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">In Review</p>
                <p className="text-2xl font-bold">
                  {getApplicationsByStage("REVIEWING").length +
                    getApplicationsByStage("SHORTLISTED").length}
                </p>
              </div>
              <Briefcase className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">In Interview</p>
                <p className="text-2xl font-bold">
                  {getApplicationsByStage("INTERVIEW").length}
                </p>
              </div>
              <Calendar className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Hired</p>
                <p className="text-2xl font-bold text-green-600">
                  {getApplicationsByStage("HIRED").length}
                </p>
              </div>
              <Users className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
