"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
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
import { Briefcase, Search, Building2, MapPin, Users, Eye, Trash2, FileX } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import Link from "next/link";
import { EmptyState } from "@/components/shared/EmptyState";
import { Pagination } from "@/components/shared/Pagination";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface JobData {
  id: string;
  title: string;
  type: string;
  location: string;
  isActive: boolean;
  createdAt: string;
  company: {
    name: string;
  };
  _count?: {
    applications?: number;
  };
}

const PAGE_SIZE = 10;

export default function AdminJobsPage() {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);

  const { data: jobsData, isLoading } = useQuery({
    queryKey: ["admin-jobs", searchQuery, statusFilter],
    queryFn: async () => {
      const params: { search?: string; isActive?: boolean } = {};
      if (searchQuery) params.search = searchQuery;
      if (statusFilter === "active") params.isActive = true;
      if (statusFilter === "inactive") params.isActive = false;
      
      const response = await api.get("/admin/jobs", { params });
      // Handle both direct array or nested object response
      const data = response.data.data;
      return (data.jobs || data || []) as JobData[];
    },
  });

  // Ensure jobs is always an array
  const jobs = Array.isArray(jobsData) ? jobsData : [];

  const deleteMutation = useMutation({
    mutationFn: async (jobId: string) => {
      const response = await api.delete(`/admin/jobs/${jobId}`);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Job deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["admin-jobs"] });
    },
    onError: () => {
      toast.error("Failed to delete job");
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
          <h1 className="text-2xl font-bold">Job Management</h1>
          <p className="text-muted-foreground">
            Manage all job postings on the platform
          </p>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search jobs..."
              className="pl-10 w-[200px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {jobs && jobs.length === 0 ? (
        <Card>
          <CardContent className="p-0">
            <EmptyState
              icon={FileX}
              title="No jobs found"
              description={searchQuery ? "No jobs match your search criteria." : "There are no job postings on the platform yet."}
              actionLabel={searchQuery ? "Clear Search" : undefined}
              onAction={searchQuery ? () => setSearchQuery("") : undefined}
            />
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
                  <TableHead>Type</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Applications</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {jobs?.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE).map((job) => (
                <TableRow key={job.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Briefcase className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{job.title}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-muted-foreground" />
                      {job.company.name}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {job.type.replace("_", " ")}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      {job.location}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      {job._count?.applications || 0}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={job.isActive ? "default" : "secondary"}
                      className={job.isActive ? "bg-green-600" : ""}
                    >
                      {job.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="icon" asChild>
                        <Link href={`/jobs/${job.id}`}>
                          <Eye className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="icon" className="text-destructive">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Delete Job</DialogTitle>
                            <DialogDescription>
                              Are you sure you want to delete &quot;{job.title}&quot; from {job.company.name}? This action cannot be undone.
                            </DialogDescription>
                          </DialogHeader>
                          <DialogFooter>
                            <Button variant="outline">Cancel</Button>
                            <Button
                              variant="destructive"
                              onClick={() => deleteMutation.mutate(job.id)}
                              disabled={deleteMutation.isPending}
                            >
                              {deleteMutation.isPending ? "Deleting..." : "Delete"}
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            </Table>
            {/* Pagination */}
            {jobs && jobs.length > PAGE_SIZE && (
              <div className="mt-4 flex justify-center">
                <Pagination
                  currentPage={currentPage}
                  totalPages={Math.ceil(jobs.length / PAGE_SIZE)}
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
