"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";
import { Pagination } from "@/components/shared/Pagination";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
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
import { formatDate, getStatusColor } from "@/lib/utils";
import { FileText, User, Calendar, Eye, Mail, Sparkles } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { useState } from "react";

const statusOptions: ApplicationStatus[] = [
  "PENDING",
  "REVIEWING",
  "SHORTLISTED",
  "INTERVIEW",
  "HIRED",
  "REJECTED",
];

const PAGE_SIZE = 10;

export default function RecruiterApplicationsPage() {
  const queryClient = useQueryClient();
  const [selectedJob, setSelectedJob] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);

  const { data: applicationsData, isLoading } = useQuery({
    queryKey: ["recruiter-applications", selectedJob],
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

  const { data: jobs } = useQuery({
    queryKey: ["recruiter-jobs-list"],
    queryFn: async () => {
      const response = await api.get("/jobs");
      return response.data.data.jobs as { id: string; title: string }[];
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ applicationId, status }: { applicationId: string; status: ApplicationStatus }) => {
      const response = await api.put(`/applications/${applicationId}/status`, { status });
      return response.data;
    },
    onSuccess: () => {
      toast.success("Application status updated");
      queryClient.invalidateQueries({ queryKey: ["recruiter-applications"] });
    },
    onError: () => {
      toast.error("Failed to update status");
    },
  });

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
          <h1 className="text-2xl font-bold">Applications</h1>
          <p className="text-muted-foreground">
            Review and manage candidate applications
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
        <Card>
          <CardContent className="p-12 text-center">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No applications yet</h3>
            <p className="text-muted-foreground">
              Applications will appear here when candidates apply to your jobs.
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Candidate</TableHead>
                  <TableHead>Job</TableHead>
                  <TableHead>Applied Date</TableHead>
                  <TableHead>AI Score</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {applications?.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE).map((application) => (
                  <TableRow key={application.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{application.candidate?.name || "Unknown"}</span>
                      </div>
                      <p className="text-sm text-muted-foreground ml-6">
                        {application.candidate?.email}
                      </p>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{application.job.title}</div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        {formatDate(application.createdAt)}
                      </div>
                    </TableCell>
                    <TableCell>
                      {application.aiScore ? (
                        <Badge
                          variant="secondary"
                          className={`${
                            application.aiScore >= 80
                              ? "bg-green-100 text-green-700"
                              : application.aiScore >= 60
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          <Sparkles className="h-3 w-3 mr-1" />
                          {application.aiScore.toFixed(0)}%
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Select
                        value={application.status}
                        onValueChange={(value: ApplicationStatus) =>
                          updateStatusMutation.mutate({
                            applicationId: application.id,
                            status: value,
                          })
                        }
                      >
                        <SelectTrigger className={`w-[140px] ${getStatusColor(application.status)}`}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {statusOptions.map((status) => (
                            <SelectItem key={status} value={status}>
                              {status.replace("_", " ")}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="icon" asChild>
                          <Link href={`/dashboard/recruiter/applications/${application.id}`}>
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Mail className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {/* Pagination */}
            {applications && applications.length > PAGE_SIZE && (
              <div className="mt-4 flex justify-center">
                <Pagination
                  currentPage={currentPage}
                  totalPages={Math.ceil(applications.length / PAGE_SIZE)}
                  onPageChange={setCurrentPage}
                />
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
