"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";
import { Button } from "@/components/ui/button";
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
import { InterviewCoach } from "@/components/ai/InterviewCoach";
import { Application } from "@/types";
import { MessageSquare, Sparkles, Briefcase, Building2, Play } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function CandidateInterviewsPage() {
  const [selectedApplication, setSelectedApplication] = useState<string | null>(null);

  const { data: applications, isLoading } = useQuery({
    queryKey: ["my-applications-for-interview"],
    queryFn: async () => {
      const response = await api.get("/applications/my");
      return response.data.data as Application[];
    },
  });

  const selectedJob = applications?.find(
    (app) => app.id === selectedApplication
  );

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">AI Interview Coach</h1>
        <p className="text-muted-foreground">
          Practice interviews with AI and get real-time feedback
        </p>
      </div>

      {!selectedApplication ? (
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Select a Job to Practice
              </CardTitle>
              <CardDescription>
                Choose one of your applied jobs to practice role-specific interview questions
              </CardDescription>
            </CardHeader>
            <CardContent>
              {applications && applications.length > 0 ? (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {applications.map((application) => (
                    <Card
                      key={application.id}
                      className="cursor-pointer hover:border-indigo-500 transition-colors"
                      onClick={() => setSelectedApplication(application.id)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-950">
                            <Briefcase className="h-5 w-5 text-indigo-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium truncate">
                              {application.job.title}
                            </p>
                            <p className="text-sm text-muted-foreground flex items-center gap-1">
                              <Building2 className="h-3 w-3" />
                              {application.job.company.name}
                            </p>
                          </div>
                        </div>
                        <Button className="w-full mt-4" variant="outline">
                          <Play className="h-4 w-4 mr-2" />
                          Start Practice
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-4">
                    You haven&apos;t applied to any jobs yet. Apply to jobs to practice interview questions.
                  </p>
                  <Button asChild>
                    <a href="/dashboard/candidate/jobs">Browse Jobs</a>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-indigo-600" />
                General Interview Practice
              </CardTitle>
              <CardDescription>
                Practice common interview questions for any role
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <Select>
                  <SelectTrigger className="w-[280px]">
                    <SelectValue placeholder="Select job category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="software-engineer">Software Engineer</SelectItem>
                    <SelectItem value="product-manager">Product Manager</SelectItem>
                    <SelectItem value="data-scientist">Data Scientist</SelectItem>
                    <SelectItem value="designer">Designer</SelectItem>
                    <SelectItem value="marketing">Marketing</SelectItem>
                    <SelectItem value="sales">Sales</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  onClick={() => setSelectedApplication("general")}
                  className="bg-indigo-600 hover:bg-indigo-700"
                >
                  <Play className="h-4 w-4 mr-2" />
                  Start General Practice
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">
                Interview Practice: {selectedJob?.job.title || "General Practice"}
              </h2>
              <p className="text-sm text-muted-foreground">
                {selectedJob?.job.company.name || "Multiple industries"}
              </p>
            </div>
            <Button variant="outline" onClick={() => setSelectedApplication(null)}>
              End Session
            </Button>
          </div>
          <InterviewCoach
            jobTitle={selectedJob?.job.title || "Software Engineer"}
            applicationId={selectedApplication}
          />
        </div>
      )}
    </div>
  );
}
