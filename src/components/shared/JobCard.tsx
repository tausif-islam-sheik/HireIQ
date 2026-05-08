"use client";

import Link from "next/link";
import { Job } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, DollarSign, Clock, Building2, Bookmark, ArrowRight } from "lucide-react";
import { formatDistanceToNow } from "@/lib/utils";
import { useSavedJobs } from "@/hooks/useSavedJobs";
import { useEffect, useState } from "react";

interface JobCardProps {
  job: Job;
}

const typeConfig: Record<string, { bg: string; text: string; border: string; label: string }> = {
  FULL_TIME: {
    bg: "bg-emerald-50 dark:bg-emerald-950/30",
    text: "text-emerald-700 dark:text-emerald-400",
    border: "border-emerald-200 dark:border-emerald-800",
    label: "Full Time"
  },
  PART_TIME: {
    bg: "bg-blue-50 dark:bg-blue-950/30",
    text: "text-blue-700 dark:text-blue-400",
    border: "border-blue-200 dark:border-blue-800",
    label: "Part Time"
  },
  CONTRACT: {
    bg: "bg-amber-50 dark:bg-amber-950/30",
    text: "text-amber-700 dark:text-amber-400",
    border: "border-amber-200 dark:border-amber-800",
    label: "Contract"
  },
  REMOTE: {
    bg: "bg-violet-50 dark:bg-violet-950/30",
    text: "text-violet-700 dark:text-violet-400",
    border: "border-violet-200 dark:border-violet-800",
    label: "Remote"
  },
  INTERNSHIP: {
    bg: "bg-pink-50 dark:bg-pink-950/30",
    text: "text-pink-700 dark:text-pink-400",
    border: "border-pink-200 dark:border-pink-800",
    label: "Internship"
  },
  FREELANCE: {
    bg: "bg-cyan-50 dark:bg-cyan-950/30",
    text: "text-cyan-700 dark:text-cyan-400",
    border: "border-cyan-200 dark:border-cyan-800",
    label: "Freelance"
  },
};

function getCompanyGradient(name: string) {
  const gradients = [
    "from-blue-500 to-cyan-500",
    "from-violet-500 to-purple-500",
    "from-emerald-500 to-teal-500",
    "from-pink-500 to-rose-500",
    "from-amber-500 to-orange-500",
    "from-indigo-500 to-blue-500",
    "from-red-500 to-rose-500",
    "from-cyan-500 to-blue-500",
  ];
  const index = name.length % gradients.length;
  return `bg-gradient-to-br ${gradients[index]}`;
}

export function JobCard({ job }: JobCardProps) {
  const { savedJobs, saveJob, unsaveJob, isSaving, isUnsaving } = useSavedJobs();
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    const saved = savedJobs?.some((sj) => sj.jobId === job.id);
    setIsBookmarked(saved || false);
  }, [savedJobs, job.id]);

  const typeStyle = typeConfig[job.type] || typeConfig.FULL_TIME;
  const timeAgo = job.createdAt ? formatDistanceToNow(new Date(job.createdAt)) : "Recently";

  return (
    <div className="group relative bg-card rounded-2xl border border-border p-4 hover:border-blue-500/40 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/5 hover:-translate-y-1 overflow-hidden h-[260px] flex flex-col">
      {/* Subtle gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-violet-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="relative flex flex-col h-full">
        {/* Header */}
        <div className="flex items-start gap-3 mb-4">
          {/* Logo - Fixed size */}
          <div className={`w-11 h-11 rounded-xl ${getCompanyGradient(job.company?.name || "")} flex items-center justify-center flex-shrink-0 shadow-md`}>
            {job.company?.logo ? (
              <img
                src={job.company.logo}
                alt={job.company.name}
                className="w-6 h-6 object-contain"
              />
            ) : (
              <Building2 className="w-5 h-5 text-white" />
            )}
          </div>

          {/* Title Section - Takes remaining space */}
          <div className="flex-1 min-w-0 pr-1">
            <h3 className="font-semibold text-foreground text-sm leading-snug truncate group-hover:text-blue-600 dark:group-hover:text-blue-500 transition-colors">
              {job.title}
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5 truncate">
              {job.company?.name || "Unknown Company"}
            </p>
          </div>

          {/* Bookmark Button - Fixed position, always aligned right */}
          <button
            onClick={async (e) => {
              e.preventDefault();
              if (isBookmarked) {
                await unsaveJob(job.id);
              } else {
                await saveJob(job.id);
              }
            }}
            disabled={isSaving || isUnsaving}
            className={`flex-shrink-0 p-1.5 rounded-md transition-all disabled:opacity-50 ${
              isBookmarked
                ? "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
                : "hover:bg-muted text-muted-foreground"
            }`}
          >
            <Bookmark className={`w-4 h-4 ${isBookmarked ? "fill-current" : ""}`} />
          </button>
        </div>

        {/* Details - Fixed height for alignment */}
        <div className="space-y-1.5 mb-3 flex-shrink-0">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="truncate">{job.location || "Remote"}</span>
          </div>
          {job.salary ? (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <DollarSign className="w-3.5 h-3.5 flex-shrink-0" />
              <span className="font-medium text-foreground">{job.salary}</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <DollarSign className="w-3.5 h-3.5 flex-shrink-0" />
              <span>Competitive</span>
            </div>
          )}
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Clock className="w-3.5 h-3.5 flex-shrink-0" />
            <span>{timeAgo}</span>
          </div>
        </div>

        {/* Skills - Fixed height area */}
        <div className="flex flex-wrap gap-1.5 mb-3 min-h-[22px]">
          {job.skills?.slice(0, 3).map((skill) => (
            <span
              key={skill}
              className="px-2 py-0.5 text-[10px] rounded-full bg-slate-100 text-slate-700 border border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700 font-medium"
            >
              {skill}
            </span>
          ))}
          {job.skills && job.skills.length > 3 && (
            <span className="px-2 py-0.5 text-[10px] rounded-full bg-muted text-muted-foreground font-medium">
              +{job.skills.length - 3}
            </span>
          )}
        </div>

        {/* Footer - Pushed to bottom */}
        <div className="flex items-center justify-between pt-3 border-t border-border/50 mt-auto">
          <span className={`px-2 py-0.5 text-[10px] font-semibold rounded-md border ${typeStyle.bg} ${typeStyle.text} ${typeStyle.border}`}>
            {typeStyle.label}
          </span>
          <Button
            size="sm"
            variant="ghost"
            className="text-blue-600 dark:text-blue-500 hover:text-blue-700 dark:hover:text-blue-400 hover:bg-blue-500/10 text-xs h-6 px-2"
            asChild
          >
            <Link href={`/jobs/${job.id}`}>
              Details
              <ArrowRight className="ml-1 w-3 h-3" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
