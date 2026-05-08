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
import { Skeleton } from "@/components/ui/skeleton";
import { Application, ApplicationStatus } from "@/types";
import { formatDate, getStatusColor } from "@/lib/utils";
import { Briefcase, Building2, Calendar, Eye, Trash2, FileText } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const PAGE_SIZE = 10;

export default function CandidateApplicationsPage() {
  const queryClient = useQueryClient();
  const [currentPage, setCurrentPage] = useState(1);

  const { data: applicationsData, isLoading } = useQuery({
    queryKey: ["my-applications"],
    queryFn: async () => {
      const response = await api.get("/applications/my");
      // Handle both direct array or nested object response
      const data = response.data.data;
      return (data.applications || data || []) as Application[];
    },
  });

  // Ensure applications is always an array
  const applications = Array.isArray(applicationsData) ? applicationsData : [];

  const withdrawMutation = useMutation({
    mutationFn: async (applicationId: string) => {
      const response = await api.delete(`/applications/${applicationId}`);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Application withdrawn successfully");
      queryClient.invalidateQueries({ queryKey: ["my-applications"] });
    },
    onError: () => {
      toast.error("Failed to withdraw application");
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-96" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">My Applications</h1>
          <p className="text-muted-foreground">
            Track and manage your job applications
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/candidate/jobs">Find More Jobs</Link>
        </Button>
      </div>

      {applications && applications.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No applications yet</h3>
            <p className="text-muted-foreground mb-4">
              Start applying to jobs to track your applications here.
            </p>
            <Button asChild>
              <Link href="/dashboard/candidate/jobs">Browse Jobs</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Job</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Applied Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>AI Score</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {applications?.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE).map((application) => (
                  <TableRow key={application.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Briefcase className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{application.job.title}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-muted-foreground" />
                        <span>{application.job.company.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        {formatDate(application.createdAt)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className={getStatusColor(application.status)}
                      >
                        {application.status.replace("_", " ")}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {application.aiScore ? (
                        <span className={`font-medium ${
                          application.aiScore >= 80
                            ? "text-green-600"
                            : application.aiScore >= 60
                            ? "text-yellow-600"
                            : "text-red-600"
                        }`}>
                          {application.aiScore.toFixed(0)}%
                        </span>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="icon" asChild>
                          <Link href={`/jobs/${application.jobId}`}>
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>
                        {application.status === "PENDING" && (
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="ghost" size="icon" className="text-destructive">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Withdraw Application</DialogTitle>
                                <DialogDescription>
                                  Are you sure you want to withdraw your application for{" "}
                                  {application.job.title} at {application.job.company.name}?
                                </DialogDescription>
                              </DialogHeader>
                              <DialogFooter>
                                <Button variant="outline">Cancel</Button>
                                <Button
                                  variant="destructive"
                                  onClick={() => withdrawMutation.mutate(application.id)}
                                  disabled={withdrawMutation.isPending}
                                >
                                  {withdrawMutation.isPending ? "Withdrawing..." : "Withdraw"}
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        )}
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
