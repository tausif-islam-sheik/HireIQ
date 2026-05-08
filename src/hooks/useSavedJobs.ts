"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";
import { Job } from "@/types";

interface SavedJob {
  id: string;
  jobId: string;
  job: Job;
  createdAt: string;
}

export function useSavedJobs() {
  const queryClient = useQueryClient();

  const { data: savedJobs, isLoading } = useQuery({
    queryKey: ["saved-jobs"],
    queryFn: async () => {
      const response = await api.get("/saved-jobs");
      return response.data.data as SavedJob[];
    },
  });

  const saveJobMutation = useMutation({
    mutationFn: async (jobId: string) => {
      const response = await api.post(`/saved-jobs/${jobId}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["saved-jobs"] });
    },
  });

  const unsaveJobMutation = useMutation({
    mutationFn: async (jobId: string) => {
      const response = await api.delete(`/saved-jobs/${jobId}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["saved-jobs"] });
    },
  });

  const checkSavedJob = async (jobId: string): Promise<boolean> => {
    try {
      const response = await api.get(`/saved-jobs/check/${jobId}`);
      return response.data.data.isSaved;
    } catch {
      return false;
    }
  };

  return {
    savedJobs,
    isLoading,
    saveJob: saveJobMutation.mutateAsync,
    unsaveJob: unsaveJobMutation.mutateAsync,
    checkSavedJob,
    isSaving: saveJobMutation.isPending,
    isUnsaving: unsaveJobMutation.isPending,
  };
}
