import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";

export interface DashboardStats {
  totalUsers: number;
  totalJobs: number;
  totalApplications: number;
  totalCompanies: number;
  recentApplications: Array<{
    id: string;
    status: string;
    createdAt: string;
    candidate: {
      name: string;
      email: string;
    };
    job: {
      title: string;
      company: {
        name: string;
      };
    };
  }>;
  applicationsByDate: Array<{
    date: string;
    count: number;
  }>;
  // Role-specific stats
  myApplications?: number;
  myJobs?: number;
  companyJobs?: number;
  pendingReviews?: number;
  shortlistedCount?: number;
  interviewCount?: number;
  savedJobs?: number;
}

export function useDashboardStats() {
  return useQuery({
    queryKey: ["dashboardStats"],
    queryFn: async () => {
      const response = await api.get("/applications/stats");
      return response.data.data as DashboardStats;
    },
  });
}
