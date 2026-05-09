"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import {
  Search,
  Sparkles,
  Users,
  Building2,
  Briefcase,
  MapPin,
  ArrowRight,
  Star,
  CheckCircle2,
  MessageSquare,
  TrendingUp,
  ScanText,
  Wand2,
  BarChart3,
  Code2,
  Palette,
  Megaphone,
  BrainCircuit,
  Layers,
  DollarSign,
  UserCheck,
  HelpCircle,
  ChevronDown,
  Mail,
  Send,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";

// Stats data
const stats = [
  { icon: Briefcase, label: "Active Jobs", value: "2,500+", gradient: "from-blue-500 to-cyan-400" },
  { icon: Building2, label: "Companies", value: "850+", gradient: "from-violet-500 to-purple-400" },
  { icon: UserCheck, label: "Hired", value: "12,000+", gradient: "from-emerald-500 to-teal-400" },
  { icon: MapPin, label: "Cities", value: "150+", gradient: "from-amber-500 to-orange-400" },
];

// How it works steps
const steps = [
  {
    icon: Building2,
    title: "Post Jobs",
    description: "Companies post jobs with AI-generated descriptions",
  },
  {
    icon: Search,
    title: "Apply",
    description: "Candidates apply with AI-analyzed resumes",
  },
  {
    icon: CheckCircle2,
    title: "Get Hired",
    description: "AI matches the best candidates with employers",
  },
];

// AI Features
const aiFeatures = [
  {
    icon: ScanText,
    title: "AI Resume Analyzer",
    description: "Upload your resume and get instant AI-powered analysis with match scores and improvement suggestions.",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    icon: Wand2,
    title: "JD Generator",
    description: "Generate professional, bias-free job descriptions in seconds with AI assistance.",
    gradient: "from-violet-500 to-purple-500",
  },
  {
    icon: BarChart3,
    title: "Candidate Ranker",
    description: "AI ranks candidates automatically based on job requirements and resume matching.",
    gradient: "from-amber-500 to-orange-500",
  },
  {
    icon: MessageSquare,
    title: "Interview Coach",
    description: "Practice interviews with AI. Get real-time feedback and improve your performance.",
    gradient: "from-emerald-500 to-teal-500",
  },
];

// Categories with proper icons
const categories = [
  { name: "Engineering", count: 450, icon: Code2, gradient: "from-blue-100 to-cyan-100 dark:from-blue-500/20 dark:to-cyan-500/20" },
  { name: "Design", count: 120, icon: Palette, gradient: "from-pink-100 to-rose-100 dark:from-pink-500/20 dark:to-rose-500/20" },
  { name: "Marketing", count: 200, icon: Megaphone, gradient: "from-violet-100 to-purple-100 dark:from-violet-500/20 dark:to-purple-500/20" },
  { name: "Sales", count: 180, icon: TrendingUp, gradient: "from-emerald-100 to-teal-100 dark:from-emerald-500/20 dark:to-teal-500/20" },
  { name: "Data Science", count: 95, icon: BrainCircuit, gradient: "from-amber-100 to-orange-100 dark:from-amber-500/20 dark:to-orange-500/20" },
  { name: "Product", count: 85, icon: Layers, gradient: "from-indigo-100 to-blue-100 dark:from-indigo-500/20 dark:to-blue-500/20" },
  { name: "Finance", count: 140, icon: DollarSign, gradient: "from-green-100 to-emerald-100 dark:from-green-500/20 dark:to-emerald-500/20" },
  { name: "HR", count: 75, icon: Users, gradient: "from-rose-100 to-pink-100 dark:from-rose-500/20 dark:to-pink-500/20" },
];

// FAQ Data
const faqs = [
  {
    question: "How does HireIQ's AI resume analyzer work?",
    answer:
      "Our AI resume analyzer uses Claude AI to evaluate your resume against job requirements. It provides match scores (0-100), identifies your strengths, highlights skill gaps, and gives actionable suggestions for improvement. Simply upload your resume in your candidate dashboard to get started.",
  },
  {
    question: "Is HireIQ free for job seekers?",
    answer:
      "Yes! All candidate features are completely free, including job applications, AI resume analysis, interview coaching, and saving jobs for later. Employers can post jobs and access basic features for free, with premium plans available for advanced AI features.",
  },
  {
    question: "How do employers use the AI candidate ranking feature?",
    answer:
      "When candidates apply to a job, our AI automatically analyzes their resumes against the job description and ranks them by match score. Recruiters can see ranked candidates in their dashboard, along with detailed match percentages and AI-generated insights for each applicant.",
  },
  {
    question: "What makes HireIQ different from other job platforms?",
    answer:
      "HireIQ combines traditional job board functionality with cutting-edge AI features: resume analysis, job description generation, candidate ranking, and interview coaching. Our AI helps both candidates optimize their applications and employers find the best matches faster.",
  },
  {
    question: "How accurate is the AI interview coach?",
    answer:
      "Our AI interview coach provides personalized practice sessions based on your target role. It asks role-specific questions, evaluates your responses, and gives constructive feedback. While it's a great preparation tool, we recommend combining it with real mock interviews for best results.",
  },
  {
    question: "Can I edit my application after submitting?",
    answer:
      "Once submitted, applications cannot be edited to maintain fairness in the hiring process. However, you can withdraw your application and reapply if the job is still open. Make sure to review your resume and cover letter carefully before submitting.",
  },
];

// Testimonials
const testimonials = [
  {
    name: "Sarah Chen",
    role: "Software Engineer at Google",
    content: "HireIQ's AI resume analyzer helped me understand exactly what recruiters look for. I got 3 interview calls within a week!",
    avatar: "SC",
    initials: "bg-gradient-to-br from-blue-500 to-cyan-500",
  },
  {
    name: "Michael Rodriguez",
    role: "Hiring Manager at TechCorp",
    content: "The AI candidate ranking feature saved us countless hours. We found our perfect hire 60% faster than before.",
    avatar: "MR",
    initials: "bg-gradient-to-br from-violet-500 to-purple-500",
  },
  {
    name: "Emily Watson",
    role: "Product Designer at Airbnb",
    content: "The interview coach is incredible. It helped me practice and land my dream job. The feedback was spot on!",
    avatar: "EW",
    initials: "bg-gradient-to-br from-pink-500 to-rose-500",
  },
];

// Helper functions for mapping API data
function getTypeColor(type: string) {
  switch (type?.toUpperCase()) {
    case "FULL TIME":
    case "FULL_TIME":
      return "bg-emerald-100 text-emerald-700 border-emerald-300 dark:bg-emerald-500/20 dark:text-emerald-400 dark:border-emerald-500/30";
    case "REMOTE":
    case "PART TIME":
    case "PART_TIME":
      return "bg-violet-100 text-violet-700 border-violet-300 dark:bg-violet-500/20 dark:text-violet-400 dark:border-violet-500/30";
    case "CONTRACT":
    case "FREELANCE":
      return "bg-amber-100 text-amber-700 border-amber-300 dark:bg-amber-500/20 dark:text-amber-400 dark:border-amber-500/30";
    default:
      return "bg-slate-100 text-slate-700 border-slate-300 dark:bg-slate-500/20 dark:text-slate-400 dark:border-slate-500/30";
  }
}

function getTimeAgo(dateString: string) {
  if (!dateString) return "Recently";
  const date = new Date(dateString);
  const now = new Date();
  const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

  if (diffInDays === 0) {
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    if (diffInHours === 0) return "Just now";
    if (diffInHours === 1) return "1 hour ago";
    return `${diffInHours} hours ago`;
  }
  if (diffInDays === 1) return "Yesterday";
  if (diffInDays < 7) return `${diffInDays} days ago`;
  if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
  return `${Math.floor(diffInDays / 30)} months ago`;
}

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

export default function HomePage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = () => {
    if (searchQuery.trim()) {
      router.push(`/jobs?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push("/jobs");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };
  // Fetch featured jobs from API
  const { data: jobsData, isLoading } = useQuery({
    queryKey: ["featured-jobs"],
    queryFn: async () => {
      const response = await api.get("/jobs?limit=8");
      return response.data.data.jobs;
    },
  });

  // Map API job data to card format
  const featuredJobs = jobsData?.map((job: any) => ({
    id: job.id,
    title: job.title,
    company: job.company?.name || "Unknown Company",
    location: job.location || "Remote",
    salary: job.salary || "Competitive",
    type: job.type || "FULL TIME",
    typeColor: getTypeColor(job.type),
    postedDate: getTimeAgo(job.createdAt),
    tags: job.skills?.slice(0, 3) || ["General"],
    logo: getCompanyGradient(job.company?.name || ""),
  })) || [];

  return (
    <div className="min-h-screen bg-background">

      {/* Hero Section */}
      <section className="relative pt-20 pb-20 lg:pt-16 lg:pb-40 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-background" />
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-violet-500/10 rounded-full blur-[100px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-cyan-500/5 rounded-full blur-[150px]" />

        {/* Grid Pattern */}
        <div 
          className="absolute inset-0 opacity-[0.02] dark:opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(var(--tw-colors-foreground) 1px, transparent 1px), linear-gradient(90deg, var(--tw-colors-foreground) 1px, transparent 1px)`,
            backgroundSize: '60px 60px'
          }}
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted/50 border border-border mb-8">
              <Sparkles className="w-4 h-4 text-cyan-600 dark:text-cyan-500" />
              <span className="text-sm text-muted-foreground">AI-Powered Recruitment</span>
            </div>

            {/* Heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight text-foreground mb-6 leading-tight">
              Find Your Dream Job with{" "}
              <span className="bg-gradient-to-r from-blue-600 via-violet-600 to-purple-600 dark:from-blue-400 dark:via-violet-400 dark:to-purple-400 bg-clip-text text-transparent">
                AI Intelligence
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-muted-foreground mb-10 leading-relaxed max-w-2xl mx-auto">
              Smart resume analysis, AI-generated job descriptions, candidate ranking, and interview coaching. HireIQ connects talent with opportunity.
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto mb-10 pt-10 px-4 sm:px-0">
              <div className="flex items-center gap-2 p-2 bg-card rounded-full border border-border backdrop-blur-sm shadow-lg h-14 sm:h-16">
                <div className="flex-1 flex items-center px-4 sm:px-6 min-w-0">
                  <Search className="w-5 h-5 sm:w-6 sm:h-6 text-muted-foreground mr-3 sm:mr-4 flex-shrink-0" />
                  <input
                    type="text"
                    placeholder="Job title, keywords..."
                    className="w-full bg-transparent outline-none text-foreground placeholder:text-muted-foreground text-base sm:text-lg min-w-0"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                  />
                </div>
                {/* Mobile: Icon button */}
                <Button 
                  size="icon"
                  className="bg-gradient-to-r from-blue-500 to-violet-600 hover:from-blue-600 hover:to-violet-700 rounded-full w-10 h-10 flex-shrink-0 sm:hidden"
                  onClick={handleSearch}
                >
                  <Search className="w-4 h-4" />
                </Button>
                {/* Desktop: Text button */}
                <Button 
                  className="hidden sm:flex bg-gradient-to-r from-blue-500 to-violet-600 hover:from-blue-600 hover:to-violet-700 px-8 rounded-full h-12 text-base"
                  onClick={handleSearch}
                >
                  Search Jobs
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="py-12 border-y border-border bg-muted/30 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="flex justify-center mb-3">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="text-3xl sm:text-4xl font-bold text-foreground">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Jobs Section */}
      <section className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-2">Featured Jobs</h2>
              <p className="text-muted-foreground">Discover opportunities from top companies</p>
            </div>
            <Button variant="outline" className="hidden sm:flex" asChild>
              <Link href="/jobs">
                View All Jobs
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="bg-card rounded-2xl border border-border p-5">
                  <div className="flex items-start gap-3 mb-4">
                    <Skeleton className="w-11 h-11 rounded-xl" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-3 w-1/2" />
                    </div>
                  </div>
                  <div className="space-y-2 mb-4">
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-3 w-2/3" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                  <div className="flex gap-1.5 mb-4">
                    <Skeleton className="h-5 w-16 rounded-full" />
                    <Skeleton className="h-5 w-14 rounded-full" />
                    <Skeleton className="h-5 w-12 rounded-full" />
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-border/50">
                    <Skeleton className="h-5 w-20 rounded-full" />
                    <Skeleton className="h-7 w-16" />
                  </div>
                </div>
              ))}
            </div>
          ) : featuredJobs.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {featuredJobs.map((job) => (
                <div
                  key={job.id}
                  className="group relative bg-card rounded-2xl border border-border p-5 hover:border-blue-500/40 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10 hover:-translate-y-1 overflow-hidden"
                >
                  {/* Subtle gradient overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-violet-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  <div className="relative">
                    {/* Company Logo & Title */}
                    <div className="flex items-start gap-3 mb-4">
                      <div className={`w-11 h-11 rounded-xl ${job.logo} flex items-center justify-center shrink-0 shadow-lg`}>
                        <Building2 className="w-5 h-5 text-white" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-semibold text-foreground text-sm leading-tight truncate group-hover:text-blue-600 dark:group-hover:text-blue-500 transition-colors">
                          {job.title}
                        </h3>
                        <p className="text-xs text-muted-foreground mt-0.5">{job.company}</p>
                      </div>
                    </div>

                    {/* Details */}
                    <div className="space-y-1.5 mb-4">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <MapPin className="w-3.5 h-3.5" />
                        <span className="truncate">{job.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <DollarSign className="w-3.5 h-3.5" />
                        <span className="font-medium text-foreground">{job.salary}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Briefcase className="w-3.5 h-3.5" />
                        <span>{job.postedDate}</span>
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {job.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 text-[10px] rounded-full bg-muted/80 text-muted-foreground font-medium"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Type Badge & Button */}
                    <div className="flex items-center justify-between pt-3 border-t border-border/50">
                      <Badge className={`${job.typeColor} text-[10px] font-semibold px-2 py-0.5`}>
                        {job.type}
                      </Badge>
                      <Button size="sm" variant="ghost" className="text-blue-600 dark:text-blue-500 hover:text-blue-700 dark:hover:text-blue-400 hover:bg-blue-500/10 text-xs h-7 px-2" asChild>
                        <Link href={`/jobs/${job.id}`}>Details</Link>
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-muted-foreground">No jobs available at the moment.</p>
            </div>
          )}

          <Button variant="outline" className="w-full sm:hidden mt-6" asChild>
            <Link href="/jobs">View All Jobs</Link>
          </Button>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 lg:py-28 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-3">How It Works</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Simple, AI-powered process for both candidates and recruiters
            </p>
          </div>

          <div className="relative">
            {/* Connecting Line */}
            <div className="hidden md:block absolute top-16 left-[16.67%] right-[16.67%] h-0.5 bg-gradient-to-r from-blue-500/30 via-violet-500/30 to-purple-500/30" />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {steps.map((step, index) => (
                <div key={step.title} className="relative text-center">
                  <div className="relative z-10 w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-500/20">
                    <step.icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-sm font-medium text-cyan-600 dark:text-cyan-500 mb-2">Step {index + 1}</div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">{step.title}</h3>
                  <p className="text-muted-foreground text-sm max-w-xs mx-auto">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* AI Features Section */}
      <section className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted/50 border border-border mb-6">
              <Sparkles className="w-4 h-4 text-cyan-600 dark:text-cyan-500" />
              <span className="text-sm text-muted-foreground">Powered by Claude AI</span>
            </div>
            <h2 className="text-3xl font-bold text-foreground mb-3">AI Features That Transform Hiring</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Leverage cutting-edge AI to streamline your recruitment process
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {aiFeatures.map((feature) => (
              <div
                key={feature.title}
                className="group bg-card rounded-2xl border border-border p-6 hover:border-l-4 hover:border-l-blue-500 transition-all duration-300"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Categories Section */}
      <section className="py-20 lg:py-28 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-3">Popular Categories</h2>
            <p className="text-muted-foreground">Browse jobs by category</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {categories.map((category) => (
              <Link
                key={category.name}
                href={`/jobs?category=${category.name}`}
                className="group bg-card rounded-xl border border-border p-6 text-center hover:border-border/80 transition-all duration-300 overflow-hidden relative"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${category.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                <div className="relative z-10">
                  <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center mx-auto mb-3 group-hover:bg-white/10 transition-colors">
                    <category.icon className="w-6 h-6 text-muted-foreground group-hover:text-foreground transition-colors" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-1">{category.name}</h3>
                  <p className="text-sm text-muted-foreground">{category.count} jobs</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-3">What People Say</h2>
            <p className="text-muted-foreground">Success stories from our community</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.name}
                className="bg-card rounded-2xl border border-border p-6"
              >
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-6 leading-relaxed">&ldquo;{testimonial.content}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full ${testimonial.initials} flex items-center justify-center text-white font-semibold text-sm`}>
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-foreground">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section - Premium Design */}
      <section className="py-24 lg:py-32 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/20 to-background" />
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-violet-500/5 rounded-full blur-[100px]" />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Premium Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/10 to-violet-500/10 border border-blue-500/20 mb-8">
              <HelpCircle className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span className="text-sm font-medium text-blue-700 dark:text-blue-300">Support Center</span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Everything you need to know about HireIQ&apos;s AI-powered recruitment platform
            </p>
          </div>

          {/* Premium FAQ Card with Glassmorphism */}
          <div className="relative">
            {/* Glow Effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 via-violet-500/20 to-purple-500/20 rounded-3xl blur-xl opacity-50" />

            <Card className="relative border-0 shadow-2xl shadow-blue-500/5 bg-card/80 backdrop-blur-xl">
              <CardContent className="p-8 sm:p-10">
                <Accordion type="single" collapsible className="w-full space-y-4">
                  {faqs.map((faq, index) => (
                    <AccordionItem
                      key={index}
                      value={`item-${index}`}
                      className="border border-border/50 rounded-xl px-6 data-[state=open]:border-blue-500/30 data-[state=open]:bg-blue-500/5 transition-all duration-300"
                    >
                      <AccordionTrigger className="text-left py-5 hover:no-underline group">
                        <div className="flex items-center gap-4">
                          <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500/20 to-violet-500/20 flex items-center justify-center group-data-[state=open]:bg-blue-500 group-data-[state=open]:text-white transition-all duration-300">
                            <span className="text-sm font-semibold text-blue-600 group-data-[state=open]:text-white">
                              {String(index + 1).padStart(2, "0")}
                          </span>
                          </div>
                          <span className="font-semibold text-base sm:text-lg group-data-[state=open]:text-blue-600 dark:group-data-[state=open]:text-blue-400 transition-colors">
                            {faq.question}
                          </span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="pb-5 pl-12">
                        <p className="text-muted-foreground leading-relaxed text-base">
                          {faq.answer}
                        </p>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          </div>

          {/* Premium Support CTA */}
          <div className="mt-12 text-center">
            <div className="inline-flex flex-col sm:flex-row items-center gap-4 p-6 rounded-2xl bg-gradient-to-r from-muted/50 to-muted/30 border border-border/50">
              <div className="text-left">
                <p className="font-semibold text-foreground">Still have questions?</p>
                <p className="text-sm text-muted-foreground">Can&apos;t find the answer you&apos;re looking for?</p>
              </div>
              <Button
                className="bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 text-white shadow-lg shadow-blue-500/25 px-6"
                asChild
              >
                <Link href="/help">
                  <HelpCircle className="w-4 h-4 mr-2" />
                  Visit Help Center
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 p-12 lg:p-16">
            {/* Background Effects */}
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-white/10 rounded-full blur-[100px]" />
            <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-cyan-500/20 rounded-full blur-[80px]" />

            <div className="relative grid lg:grid-cols-2 gap-8 items-center">
              <div>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 mb-6">
                  <Mail className="w-4 h-4 text-cyan-300" />
                  <span className="text-sm text-white/90">Stay Updated</span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                  Subscribe to Our Newsletter
                </h2>
                <p className="text-white/80 text-lg">
                  Get the latest job opportunities, career tips, recruitment insights, and AI hiring trends delivered straight to your inbox.
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-3">
                  <Input
                    type="email"
                    placeholder="Enter your email address"
                    className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-white/50 h-12"
                  />
                  <Button className="bg-white text-indigo-600 hover:bg-white/90 h-12 px-6">
                    <Send className="w-4 h-4 mr-2" />
                    Subscribe
                  </Button>
                </div>
                <p className="text-sm text-white/60">
                  No spam, ever. Unsubscribe at any time. Read our{" "}
                  <Link href="/privacy" className="underline hover:text-white">
                    Privacy Policy
                  </Link>
                  .
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
