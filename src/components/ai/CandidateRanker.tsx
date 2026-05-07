"use client";

import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import api from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { Application } from "@/types";
import { Sparkles, TrendingUp, User, FileText, Loader2, RefreshCw } from "lucide-react";
import { toast } from "sonner";

interface CandidateRankerProps {
  jobId: string;
  jobDescription: string;
}

interface RankResult {
  candidateId: string;
  name: string;
  score: number;
  reason: string;
  rank: number;
}

export function CandidateRanker({ jobId, jobDescription }: CandidateRankerProps) {
  const [rankings, setRankings] = useState<RankResult[] | null>(null);

  const { data: applications, isLoading: isLoadingApplications } = useQuery({
    queryKey: ["job-applicants", jobId],
    queryFn: async () => {
      const response = await api.get(`/applications/job/${jobId}`);
      return response.data.data as Application[];
    },
  });

  const rankMutation = useMutation({
    mutationFn: async () => {
      const candidates = applications?.map((app) => ({
        id: app.candidateId,
        name: app.candidate?.name || "Unknown",
        resumeText: "Candidate application data",
      })) || [];

      const response = await api.post("/ai/rank-candidates", {
        jobDescription,
        candidates,
      });
      return response.data.data as RankResult[];
    },
    onSuccess: (data) => {
      setRankings(data);
      toast.success("Candidates ranked successfully!");
    },
    onError: () => {
      toast.error("Failed to rank candidates");
    },
  });

  if (isLoadingApplications) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64" />
      </div>
    );
  }

  if (!applications || applications.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No applications yet for this job.</p>
        </CardContent>
      </Card>
    );
  }

  if (rankings) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-indigo-600" />
            AI Rankings ({rankings.length} candidates)
          </h3>
          <Button
            variant="outline"
            size="sm"
            onClick={() => rankMutation.mutate()}
            disabled={rankMutation.isPending}
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Re-rank
          </Button>
        </div>

        <div className="space-y-3">
          {rankings.map((rank) => (
            <Card key={rank.candidateId}>
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                        rank.rank === 1
                          ? "bg-yellow-100 text-yellow-700"
                          : rank.rank === 2
                          ? "bg-gray-100 text-gray-700"
                          : rank.rank === 3
                          ? "bg-orange-100 text-orange-700"
                          : "bg-muted"
                      }`}
                    >
                      #{rank.rank}
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">{rank.name}</h4>
                      <Badge
                        variant="secondary"
                        className={`${
                          rank.score >= 80
                            ? "bg-green-100 text-green-700"
                            : rank.score >= 60
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {rank.score}%
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {rank.reason}
                    </p>
                    <Progress
                      value={rank.score}
                      className="h-2 mt-2"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-indigo-600" />
          AI Candidate Ranker
        </CardTitle>
        <CardDescription>
          Use AI to automatically rank candidates based on their fit for this role
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center py-6">
          <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground mb-4">
            {applications.length} candidate{applications.length !== 1 ? "s" : ""} applied for this position
          </p>
          <Button
            onClick={() => rankMutation.mutate()}
            disabled={rankMutation.isPending}
            className="bg-indigo-600 hover:bg-indigo-700"
          >
            {rankMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing candidates...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Rank Candidates with AI
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
