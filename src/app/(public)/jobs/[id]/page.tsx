"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation } from "@tanstack/react-query";
import api from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
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
  Globe,
  Users,
  ArrowRight,
  Sparkles,
  Target,
  Award,
  Calendar,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";
import { useAuthStore } from "@/store/authStore";
import { toast } from "sonner";
import { formatDate } from "@/lib/utils";
import { Job, Application } from "@/types";

const typeLabels: Record<string, string> = {
  FULL_TIME: "Full Time",
  PART_TIME: "Part Time",
  CONTRACT: "Contract",
  REMOTE: "Remote",
  INTERNSHIP: "Internship",
  FREELANCE: "Freelance",
};

const typeColors: Record<string, string> = {
  FULL_TIME: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
  PART_TIME: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
  CONTRACT: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
  REMOTE: "bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/20",
  INTERNSHIP: "bg-pink-500/10 text-pink-600 dark:text-pink-400 border-pink-500/20",
  FREELANCE: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20",
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
      <div className="min-h-screen bg-background">
        {/* Hero Skeleton */}
        <div className="relative bg-gradient-to-br from-blue-600 via-violet-600 to-purple-600 py-16">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-30"></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Skeleton className="h-6 w-32 bg-white/20 mb-6" />
            <div className="flex flex-col lg:flex-row gap-8">
              <div className="flex-1">
                <Skeleton className="h-10 w-3/4 bg-white/20 mb-4" />
                <Skeleton className="h-5 w-1/2 bg-white/20" />
              </div>
            </div>
          </div>
        </div>
        {/* Content Skeleton */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Skeleton className="h-64 w-full" />
              <Skeleton className="h-48 w-full" />
              <Skeleton className="h-32 w-full" />
            </div>
            <div className="space-y-6">
              <Skeleton className="h-80 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
            <Briefcase className="h-10 w-10 text-muted-foreground" />
          </div>
          <h1 className="text-2xl font-bold mb-3">Job Not Found</h1>
          <p className="text-muted-foreground mb-6">
            The job you&apos;re looking for doesn&apos;t exist or has been removed.
          </p>
          <Button asChild className="bg-gradient-to-r from-blue-600 to-violet-600">
            <Link href="/jobs">Browse All Jobs</Link>
          </Button>
        </div>
      </div>
    );
  }

  const typeBadgeClass = typeColors[job.type] || typeColors.FULL_TIME;

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Header */}
      <div className="relative bg-gradient-to-br from-blue-600 via-violet-600 to-purple-600 pt-12 pb-24 lg:pb-32 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-30"></div>
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/4"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-cyan-500/20 rounded-full blur-[80px] translate-y-1/4 -translate-x-1/4"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Link */}
          <Link
            href="/jobs"
            className="inline-flex items-center text-sm text-white/80 hover:text-white mb-8 transition-colors"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Jobs
          </Link>

          <div className="flex flex-col lg:flex-row gap-8 items-start">
            {/* Company Logo */}
            <div className="w-20 h-20 lg:w-24 lg:h-24 rounded-2xl bg-white flex items-center justify-center shadow-xl flex-shrink-0">
              {job.company?.logo ? (
                <img
                  src={job.company.logo}
                  alt={job.company.name}
                  className="w-12 h-12 lg:w-14 lg:h-14 object-contain"
                />
              ) : (
                <Building2 className="w-10 h-10 lg:w-12 lg:h-12 text-blue-600" />
              )}
            </div>

            {/* Job Info */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-3 mb-3">
                <Badge className={`${typeBadgeClass} font-medium`}>
                  {typeLabels[job.type] || job.type}
                </Badge>
                <span className="text-white/60 text-sm flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  Posted {formatDate(job.createdAt)}
                </span>
              </div>

              <h1 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-white mb-3 leading-tight">
                {job.title}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-white/90">
                <span className="font-semibold text-lg">{job.company?.name || "Unknown Company"}</span>
                <span className="text-white/40">•</span>
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4" />
                  {job.location}
                </span>
                {job.category && (
                  <>
                    <span className="text-white/40">•</span>
                    <span className="flex items-center gap-1.5">
                      <Target className="w-4 h-4" />
                      {job.category}
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setIsBookmarked(!isBookmarked)}
                className="bg-white/10 border-white/20 text-white hover:bg-white/20 hover:text-white"
              >
                <Bookmark className={`h-5 w-5 ${isBookmarked ? "fill-white" : ""}`} />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20 hover:text-white"
              >
                <Share2 className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 lg:-mt-20">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Job Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Info Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-card rounded-xl border border-border p-4 text-center hover:border-blue-500/30 transition-colors">
                <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center mx-auto mb-2">
                  <DollarSign className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <p className="text-xs text-muted-foreground mb-1">Salary</p>
                <p className="font-semibold text-sm">{job.salary || "Competitive"}</p>
              </div>
              <div className="bg-card rounded-xl border border-border p-4 text-center hover:border-violet-500/30 transition-colors">
                <div className="w-10 h-10 rounded-lg bg-violet-500/10 flex items-center justify-center mx-auto mb-2">
                  <Briefcase className="w-5 h-5 text-violet-600 dark:text-violet-400" />
                </div>
                <p className="text-xs text-muted-foreground mb-1">Job Type</p>
                <p className="font-semibold text-sm">{typeLabels[job.type] || job.type}</p>
              </div>
              <div className="bg-card rounded-xl border border-border p-4 text-center hover:border-emerald-500/30 transition-colors">
                <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center mx-auto mb-2">
                  <Award className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <p className="text-xs text-muted-foreground mb-1">Experience</p>
                <p className="font-semibold text-sm">{job.experience || "Any"}</p>
              </div>
              <div className="bg-card rounded-xl border border-border p-4 text-center hover:border-amber-500/30 transition-colors">
                <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center mx-auto mb-2">
                  <Clock className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                </div>
                <p className="text-xs text-muted-foreground mb-1">Deadline</p>
                <p className="font-semibold text-sm">{job.deadline ? formatDate(job.deadline) : "Open"}</p>
              </div>
            </div>

            {/* Description */}
            <div className="bg-card rounded-2xl border border-border p-6 lg:p-8">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                </div>
                <h2 className="text-xl font-semibold">About the Role</h2>
              </div>
              <div className="prose dark:prose-invert max-w-none text-muted-foreground leading-relaxed">
                <p className="whitespace-pre-wrap">{job.description}</p>
              </div>
            </div>

            {/* Requirements */}
            {job.requirements && job.requirements.length > 0 && (
              <div className="bg-card rounded-2xl border border-border p-6 lg:p-8">
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-8 h-8 rounded-lg bg-violet-500/10 flex items-center justify-center">
                    <CheckCircle2 className="w-4 h-4 text-violet-600 dark:text-violet-400" />
                  </div>
                  <h2 className="text-xl font-semibold">Requirements</h2>
                </div>
                <ul className="space-y-3">
                  {job.requirements.map((req, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-green-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <CheckCircle2 className="h-3 w-3 text-green-600" />
                      </div>
                      <span className="text-muted-foreground">{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Skills */}
            {job.skills && job.skills.length > 0 && (
              <div className="bg-card rounded-2xl border border-border p-6 lg:p-8">
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center">
                    <Award className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                  </div>
                  <h2 className="text-xl font-semibold">Required Skills</h2>
                </div>
                <div className="flex flex-wrap gap-2">
                  {job.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1.5 text-sm font-medium rounded-lg bg-slate-100 text-slate-700 border border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Apply & Company */}
          <div className="space-y-6">
            {/* Apply Card */}
            <div className="bg-card rounded-2xl border border-border p-6 sticky top-6">
              {hasApplied ? (
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Application Submitted!</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    You&apos;ve already applied for this position. We&apos;ll notify you of any updates.
                  </p>
                  <Button variant="outline" className="w-full" asChild>
                    <Link href="/dashboard/candidate/applications">View Applications</Link>
                  </Button>
                </div>
              ) : (
                <>
                  <h3 className="font-semibold text-lg mb-2">Interested in this role?</h3>
                  <p className="text-sm text-muted-foreground mb-6">
                    Apply now and get matched with your dream job. It only takes a few minutes.
                  </p>
                  <Dialog open={isApplyDialogOpen} onOpenChange={setIsApplyDialogOpen}>
                    <DialogTrigger asChild>
                      <Button
                        className="w-full bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 text-white font-semibold h-12"
                        onClick={handleApply}
                      >
                        Apply Now
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px]">
                      <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                          <Sparkles className="w-5 h-5 text-blue-600" />
                          Apply for {job.title}
                        </DialogTitle>
                        <DialogDescription>
                          Submit your application to {job.company?.name}. You can include a cover letter below.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div>
                          <label className="text-sm font-medium">Cover Letter (Optional)</label>
                          <Textarea
                            placeholder="Tell us why you're a great fit for this role..."
                            value={coverLetter}
                            onChange={(e) => setCoverLetter(e.target.value)}
                            className="mt-2 min-h-[150px] resize-none"
                          />
                        </div>
                      </div>
                      <DialogFooter className="gap-3">
                        <Button
                          variant="outline"
                          onClick={() => setIsApplyDialogOpen(false)}
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={handleSubmitApplication}
                          disabled={applyMutation.isPending}
                          className="bg-gradient-to-r from-blue-600 to-violet-600"
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

                  <div className="mt-6 pt-6 border-t border-border">
                    <p className="text-xs text-muted-foreground text-center">
                      By applying, you agree to our Terms of Service and Privacy Policy
                    </p>
                  </div>
                </>
              )}
            </div>

            {/* Company Card */}
            {job.company && (
              <div className="bg-card rounded-2xl border border-border p-6">
                <h3 className="font-semibold mb-4">About the Company</h3>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center">
                    {job.company.logo ? (
                      <img
                        src={job.company.logo}
                        alt={job.company.name}
                        className="w-8 h-8 object-contain"
                      />
                    ) : (
                      <Building2 className="w-6 h-6 text-white" />
                    )}
                  </div>
                  <div>
                    <p className="font-semibold">{job.company.name}</p>
                    {job.company.industry && (
                      <p className="text-xs text-muted-foreground">{job.company.industry}</p>
                    )}
                  </div>
                </div>

                {job.company.description && (
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                    {job.company.description}
                  </p>
                )}

                <div className="space-y-3">
                  {job.company.size && (
                    <div className="flex items-center gap-2 text-sm">
                      <Users className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground">{job.company.size} employees</span>
                    </div>
                  )}
                  {job.company.website && (
                    <a
                      href={job.company.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 transition-colors"
                    >
                      <Globe className="w-4 h-4" />
                      <span>Visit Website</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom spacing */}
      <div className="h-20"></div>
    </div>
  );
}
