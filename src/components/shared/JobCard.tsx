"use client";

import Link from "next/link";
import { Job } from "@/types";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, DollarSign, Clock, Building2, Bookmark } from "lucide-react";
import { formatDate, truncateText } from "@/lib/utils";
import { useSavedJobs } from "@/hooks/useSavedJobs";
import { useEffect, useState } from "react";

interface JobCardProps {
  job: Job;
}

export function JobCard({ job }: JobCardProps) {
  const { savedJobs, saveJob, unsaveJob, isSaving, isUnsaving } = useSavedJobs();
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    const saved = savedJobs?.some((sj) => sj.jobId === job.id);
    setIsBookmarked(saved || false);
  }, [savedJobs, job.id]);

  const typeColors: Record<string, string> = {
    FULL_TIME: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    PART_TIME: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
    CONTRACT: "bg-orange-500/10 text-orange-600 dark:text-orange-400",
    REMOTE: "bg-green-500/10 text-green-600 dark:text-green-400",
    INTERNSHIP: "bg-pink-500/10 text-pink-600 dark:text-pink-400",
  };

  return (
    <Card className="h-[320px] flex flex-col group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      <CardContent className="flex-1 p-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950 flex items-center justify-center flex-shrink-0">
              {job.company.logo ? (
                <img
                  src={job.company.logo}
                  alt={job.company.name}
                  className="w-8 h-8 object-contain"
                />
              ) : (
                <Building2 className="w-6 h-6 text-indigo-600" />
              )}
            </div>
            <div className="min-w-0">
              <h3 className="font-semibold text-foreground truncate">
                {truncateText(job.title, 30)}
              </h3>
              <p className="text-sm text-muted-foreground truncate">
                {job.company.name}
              </p>
            </div>
          </div>
          <button
            onClick={async () => {
              if (isBookmarked) {
                await unsaveJob(job.id);
              } else {
                await saveJob(job.id);
              }
            }}
            disabled={isSaving || isUnsaving}
            className={`p-2 rounded-lg transition-colors disabled:opacity-50 ${
              isBookmarked
                ? "bg-indigo-100 text-indigo-600 dark:bg-indigo-900"
                : "hover:bg-muted"
            }`}
          >
            <Bookmark
              className={`w-4 h-4 ${isBookmarked ? "fill-current" : ""}`}
            />
          </button>
        </div>

        {/* Details */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="w-4 h-4 flex-shrink-0" />
            <span className="truncate">{job.location}</span>
          </div>
          {job.salary && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <DollarSign className="w-4 h-4 flex-shrink-0" />
              <span className="truncate">
                {job.salary.includes("/hour") || job.salary.includes("/hour") ? job.salary : `${job.salary} / year`}
              </span>
            </div>
          )}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="w-4 h-4 flex-shrink-0" />
            <span>{formatDate(job.createdAt)}</span>
          </div>
        </div>

        {/* Skills */}
        <div className="flex flex-wrap gap-1.5">
          {job.skills.slice(0, 3).map((skill) => (
            <Badge
              key={skill}
              variant="secondary"
              className="text-xs font-normal"
            >
              {skill}
            </Badge>
          ))}
          {job.skills.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{job.skills.length - 3}
            </Badge>
          )}
        </div>
      </CardContent>

      <CardFooter className="p-5 pt-0 mt-auto">
        <div className="flex items-center justify-between w-full gap-3">
          <Badge
            variant="secondary"
            className={`${typeColors[job.type] || ""} border-0`}
          >
            {job.type.replace("_", " ")}
          </Badge>
          <Button
            size="sm"
            className="bg-indigo-600 hover:bg-indigo-700"
            asChild
          >
            <Link href={`/jobs/${job.id}`}>View Details</Link>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
