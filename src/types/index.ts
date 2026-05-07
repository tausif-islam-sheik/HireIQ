export interface User {
  id: string;
  name: string;
  email: string;
  role: "CANDIDATE" | "RECRUITER" | "ADMIN";
  avatar: string | null;
  isVerified: boolean;
  createdAt?: string;
  company?: {
    id: string;
    name: string;
    logo: string | null;
  } | null;
}

export interface Company {
  id: string;
  name: string;
  logo: string | null;
  website: string | null;
  description: string | null;
  location: string | null;
  industry: string | null;
  size: string | null;
  recruiterId?: string;
  jobs?: Job[];
  createdAt?: string;
}

export type JobType = "FULL_TIME" | "PART_TIME" | "CONTRACT" | "REMOTE" | "INTERNSHIP";

export type ApplicationStatus = "PENDING" | "REVIEWING" | "SHORTLISTED" | "INTERVIEW" | "REJECTED" | "HIRED";

export interface Job {
  id: string;
  title: string;
  description: string;
  requirements: string[];
  skills: string[];
  salary: string | null;
  location: string;
  type: JobType;
  category: string;
  experience: string;
  isActive: boolean;
  companyId: string;
  company: Company;
  _count?: {
    applications: number;
  };
  createdAt: string;
  updatedAt?: string;
}

export interface Application {
  id: string;
  status: ApplicationStatus;
  coverLetter: string | null;
  aiScore: number | null;
  aiFeedback: string | null;
  jobId: string;
  job: Job;
  candidateId: string;
  candidate?: User;
  createdAt: string;
  updatedAt?: string;
}

export interface Resume {
  id: string;
  fileUrl: string;
  parsedData: Record<string, unknown> | null;
  aiAnalysis: Record<string, unknown> | null;
  userId: string;
  createdAt: string;
}

export interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  userId: string;
  createdAt: string;
}

export interface Interview {
  id: string;
  messages: Array<{
    role: "user" | "assistant";
    content: string;
  }>;
  aiFeedback: string | null;
  overallScore: number | null;
  applicationId: string;
  userId: string;
  createdAt: string;
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasMore: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  error?: string;
}

export interface JobFilterParams {
  search?: string;
  category?: string;
  type?: string;
  location?: string;
  salary?: string;
  experience?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
}

export interface ResumeAnalysis {
  overallScore: number;
  matchPercentage: number;
  strengths: string[];
  gaps: string[];
  suggestions: string[];
  verdict: string;
}

export interface JDResult {
  title: string;
  summary: string;
  responsibilities: string[];
  requirements: string[];
  niceToHave: string[];
  benefits: string[];
}

export interface RankResult {
  candidateId: string;
  name: string;
  score: number;
  reason: string;
  rank: number;
}

export interface InterviewResult {
  reply: string;
  feedback: string;
  score: number;
  nextQuestion: string;
}

export interface DashboardStats {
  totalJobs?: number;
  totalApplications?: number;
  totalCompanies?: number;
  jobsByType?: Array<{ type: JobType; count: number }>;
  applicationStats?: Array<{ status: ApplicationStatus; count: number }>;
}
