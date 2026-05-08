"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation } from "@tanstack/react-query";
import api from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Briefcase,
  MapPin,
  DollarSign,
  Clock,
  Building2,
  ChevronLeft,
  CheckCircle2,
  Share2,
  Bookmark,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { useAuthStore } from "@/store/authStore";
import { toast } from "sonner";
import { formatDate, getStatusColor } from "@/lib/utils";
import { Job, Application } from "@/types";

const typeLabels: Record<string, string> = {
  FULL_TIME: "Full Time",
  PART_TIME: "Part Time",
  CONTRACT: "Contract",
  REMOTE: "Remote",
  INTERNSHIP: "Internship",
};

export default function JobDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();
  const [isApplyDialogOpen, setIsApplyDialogOpen] = useState(false);
  const [coverLetter, setCoverLetter] = useState("");
  const [isBookmarked, setIsBookmarked] = useState(false);

  const jobId = params.id as string;

  const { data: job, isLoading } = useQuery({
    queryKey: ["job", jobId],
    queryFn: async () => {
      const response = await api.get(`/jobs/${jobId}`);
      return response.data.data as Job;
    },
  });

  const { data: myApplications } = useQuery({
    queryKey: ["my-applications"],
    queryFn: async () => {
      const response = await api.get("/applications/my");
      return response.data.data as Application[];
    },
    enabled: isAuthenticated && user?.role === "CANDIDATE",
  });

  const hasApplied = Array.isArray(myApplications) && myApplications.some((app) => app.jobId === jobId);

  const applyMutation = useMutation({
    mutationFn: async () => {
      const response = await api.post("/applications", {
        jobId,
        coverLetter,
      });
      return response.data;
    },
    onSuccess: () => {
      toast.success("Application submitted successfully!");
      setIsApplyDialogOpen(false);
      setCoverLetter("");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to submit application");
    },
  });

  const handleApply = () => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
    if (user?.role !== "CANDIDATE") {
      toast.error("Only candidates can apply for jobs");
      return;
    }
    setIsApplyDialogOpen(true);
  };

  const handleSubmitApplication = () => {
    applyMutation.mutate();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-muted/30 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-1/3"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
            <div className="h-64 bg-muted rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-muted/30 py-8">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-2xl font-bold mb-4">Job Not Found</h1>
          <p className="text-muted-foreground mb-4">
            The job you&apos;re looking for doesn&apos;t exist or has been removed.
          </p>
          <Button asChild>
            <Link href="/jobs">Browse All Jobs</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Link */}
        <Link
          href="/jobs"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Jobs
        </Link>

        {/* Job Header */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-xl bg-indigo-50 dark:bg-indigo-950 flex items-center justify-center flex-shrink-0">
                  {job.company.logo ? (
                    <img
                      src={job.company.logo}
                      alt={job.company.name}
                      className="w-10 h-10 object-contain"
                    />
                  ) : (
                    <Building2 className="w-8 h-8 text-indigo-600" />
                  )}
                </div>
                <div>
                  <CardTitle className="text-2xl mb-1">{job.title}</CardTitle>
                  <CardDescription className="flex items-center gap-2 text-base">
                    <span className="font-medium text-foreground">{job.company.name}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {job.location}
                    </span>
                  </CardDescription>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setIsBookmarked(!isBookmarked)}
                >
                  <Bookmark
                    className={`h-4 w-4 ${isBookmarked ? "fill-current" : ""}`}
                  />
                </Button>
                <Button variant="outline" size="icon">
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mt-4">
              <Badge
                variant="secondary"
                className="bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300"
              >
                {typeLabels[job.type] || job.type}
              </Badge>
              <Badge variant="outline">{job.category}</Badge>
              <Badge variant="outline">{job.experience}</Badge>
            </div>
          </CardHeader>

          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-muted">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Salary</p>
                  <p className="font-medium">{job.salary || "Not specified"}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-muted">
                  <Briefcase className="h-4 w-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Job Type</p>
                  <p className="font-medium">{typeLabels[job.type] || job.type}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-muted">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Posted</p>
                  <p className="font-medium">{formatDate(job.createdAt)}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-muted">
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Experience</p>
                  <p className="font-medium">{job.experience}</p>
                </div>
              </div>
            </div>

            {/* Apply Button */}
            {hasApplied ? (
              <div className="flex items-center gap-2 p-4 bg-green-50 dark:bg-green-950 rounded-lg">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                <span className="font-medium text-green-600">
                  You&apos;ve already applied for this job
                </span>
              </div>
            ) : (
              <Dialog open={isApplyDialogOpen} onOpenChange={setIsApplyDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    className="w-full md:w-auto bg-indigo-600 hover:bg-indigo-700"
                    size="lg"
                    onClick={handleApply}
                  >
                    Apply Now
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>Apply for {job.title}</DialogTitle>
                    <DialogDescription>
                      Submit your application to {job.company.name}. You can include
                      a cover letter below.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div>
                      <label className="text-sm font-medium">Cover Letter (Optional)</label>
                      <Textarea
                        placeholder="Tell us why you're a great fit for this role..."
                        value={coverLetter}
                        onChange={(e) => setCoverLetter(e.target.value)}
                        className="mt-2 min-h-[150px]"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setIsApplyDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleSubmitApplication}
                      disabled={applyMutation.isPending}
                      className="bg-indigo-600 hover:bg-indigo-700"
                    >
                      {applyMutation.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        "Submit Application"
                      )}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
          </CardContent>
        </Card>

        {/* Job Description */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Job Description</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose dark:prose-invert max-w-none">
              <p className="whitespace-pre-wrap">{job.description}</p>
            </div>
          </CardContent>
        </Card>

        {/* Requirements */}
        {job.requirements && job.requirements.length > 0 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Requirements</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {job.requirements.map((req, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {/* Skills */}
        {job.skills && job.skills.length > 0 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Required Skills</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {job.skills.map((skill) => (
                  <Badge key={skill} variant="secondary">
                    {skill}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Company Info */}
        <Card>
          <CardHeader>
            <CardTitle>About {job.company.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              {job.company.description || "No company description available."}
            </p>
            {(job.company.website || job.company.industry || job.company.size) && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4 pt-4 border-t">
                {job.company.industry && (
                  <div>
                    <p className="text-xs text-muted-foreground">Industry</p>
                    <p className="font-medium">{job.company.industry}</p>
                  </div>
                )}
                {job.company.size && (
                  <div>
                    <p className="text-xs text-muted-foreground">Company Size</p>
                    <p className="font-medium">{job.company.size}</p>
                  </div>
                )}
                {job.company.website && (
                  <div>
                    <p className="text-xs text-muted-foreground">Website</p>
                    <a
                      href={job.company.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-indigo-600 hover:underline"
                    >
                      Visit Website
                    </a>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
