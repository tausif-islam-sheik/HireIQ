"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { JobCard } from "@/components/shared/JobCard";
import { SkeletonCard } from "@/components/shared/SkeletonCard";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";
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
  FileText,
  TrendingUp,
  Award,
  Target,
} from "lucide-react";

// Stats data
const stats = [
  { icon: Briefcase, label: "Active Jobs", value: "2,500+" },
  { icon: Building2, label: "Companies", value: "850+" },
  { icon: Users, label: "Hired Candidates", value: "12,000+" },
  { icon: MapPin, label: "Cities", value: "150+" },
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
    icon: Award,
    title: "Get Hired",
    description: "AI matches the best candidates with employers",
  },
];

// AI Features
const aiFeatures = [
  {
    icon: FileText,
    title: "AI Resume Analyzer",
    description:
      "Upload your resume and get instant AI-powered analysis with match scores and improvement suggestions.",
    color: "bg-blue-500",
  },
  {
    icon: Sparkles,
    title: "JD Generator",
    description:
      "Generate professional, bias-free job descriptions in seconds with AI assistance.",
    color: "bg-purple-500",
  },
  {
    icon: Target,
    title: "Candidate Ranker",
    description:
      "AI ranks candidates automatically based on job requirements and resume matching.",
    color: "bg-amber-500",
  },
  {
    icon: MessageSquare,
    title: "Interview Coach",
    description:
      "Practice interviews with AI. Get real-time feedback and improve your performance.",
    color: "bg-green-500",
  },
];

// Categories
const categories = [
  { name: "Engineering", count: 450, icon: "💻" },
  { name: "Design", count: 120, icon: "🎨" },
  { name: "Marketing", count: 200, icon: "📢" },
  { name: "Sales", count: 180, icon: "💼" },
  { name: "Data Science", count: 95, icon: "📊" },
  { name: "Product", count: 85, icon: "🚀" },
  { name: "Finance", count: 140, icon: "💰" },
  { name: "HR", count: 75, icon: "👥" },
];

// Testimonials
const testimonials = [
  {
    name: "Sarah Chen",
    role: "Software Engineer at Google",
    content:
      "HireIQ's AI resume analyzer helped me understand exactly what recruiters look for. I got 3 interview calls within a week!",
    avatar: "SC",
  },
  {
    name: "Michael Rodriguez",
    role: "Hiring Manager at TechCorp",
    content:
      "The AI candidate ranking feature saved us countless hours. We found our perfect hire 60% faster than before.",
    avatar: "MR",
  },
  {
    name: "Emily Watson",
    role: "Product Designer at Airbnb",
    content:
      "The interview coach is incredible. It helped me practice and land my dream job. The feedback was spot on!",
    avatar: "EW",
  },
];

// FAQ items
const faqItems = [
  {
    question: "How does the AI resume analyzer work?",
    answer:
      "Our AI analyzes your resume against job descriptions, providing a match score and specific suggestions for improvement.",
  },
  {
    question: "Is HireIQ free for job seekers?",
    answer:
      "Yes! Job seekers can apply to jobs, use the resume analyzer, and access the interview coach completely free.",
  },
  {
    question: "How do recruiters use the AI features?",
    answer:
      "Recruiters can generate job descriptions, rank candidates automatically, and manage their hiring pipeline efficiently.",
  },
  {
    question: "Can I practice interviews with AI?",
    answer:
      "Absolutely! Our AI interview coach simulates real interviews and provides personalized feedback on your answers.",
  },
];

export default function HomePage() {
  // Fetch featured jobs
  const { data: jobsData, isLoading } = useQuery({
    queryKey: ["featured-jobs"],
    queryFn: async () => {
      const response = await api.get("/jobs?limit=4");
      return response.data.data.jobs;
    },
  });

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-20 pb-16 lg:pt-32 lg:pb-24 overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-cyan-50 dark:from-indigo-950/20 dark:via-background dark:to-cyan-950/20" />
        <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-gradient-to-bl from-indigo-200/20 to-transparent dark:from-indigo-900/10 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-gradient-to-tr from-cyan-200/20 to-transparent dark:from-cyan-900/10 blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <Badge className="mb-4 bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300 hover:bg-indigo-100">
              <Sparkles className="w-3 h-3 mr-1" />
              AI-Powered Recruitment
            </Badge>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground mb-6">
              Find Your Dream Job with{" "}
              <span className="text-indigo-600">AI Intelligence</span>
            </h1>

            <p className="text-lg sm:text-xl text-muted-foreground mb-8 leading-relaxed">
              Smart resume analysis, AI-generated job descriptions, candidate
              ranking, and interview coaching. HireIQ connects talent with
              opportunity.
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto mb-8">
              <div className="flex gap-2 p-2 bg-white dark:bg-card rounded-xl shadow-lg border">
                <div className="flex-1 flex items-center px-4">
                  <Search className="w-5 h-5 text-muted-foreground mr-3" />
                  <input
                    type="text"
                    placeholder="Job title, keywords, or company"
                    className="w-full bg-transparent outline-none text-foreground placeholder:text-muted-foreground"
                  />
                </div>
                <Button className="bg-indigo-600 hover:bg-indigo-700 px-6">
                  Search Jobs
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-center gap-4 flex-wrap">
              <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700" asChild>
                <Link href="/jobs">Browse Jobs</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/register">Post a Job</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 border-y bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="flex justify-center mb-2">
                  <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950 flex items-center justify-center">
                    <stat.icon className="w-6 h-6 text-indigo-600" />
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-foreground">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Jobs Section */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-foreground">
                Featured Jobs
              </h2>
              <p className="text-muted-foreground mt-1">
                Discover opportunities from top companies
              </p>
            </div>
            <Button variant="outline" asChild className="hidden sm:flex">
              <Link href="/jobs">
                View All Jobs
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {isLoading
              ? Array.from({ length: 4 }).map((_, i) => (
                  <SkeletonCard key={i} />
                ))
              : jobsData?.map((job: any) => <JobCard key={job.id} job={job} />)}
          </div>

          <Button variant="outline" className="w-full sm:hidden mt-6" asChild>
            <Link href="/jobs">View All Jobs</Link>
          </Button>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-muted/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground">How It Works</h2>
            <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
              Simple, AI-powered process for both candidates and recruiters
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div
                key={step.title}
                className="text-center p-6 rounded-2xl bg-background shadow-sm"
              >
                <div className="w-16 h-16 rounded-2xl bg-indigo-600 flex items-center justify-center mx-auto mb-4">
                  <step.icon className="w-8 h-8 text-white" />
                </div>
                <div className="text-sm font-medium text-indigo-600 mb-2">
                  Step {index + 1}
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  {step.title}
                </h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Features Section */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300">
              <Sparkles className="w-3 h-3 mr-1" />
              Powered by Claude AI
            </Badge>
            <h2 className="text-3xl font-bold text-foreground">
              AI Features That Transform Hiring
            </h2>
            <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
              Leverage cutting-edge AI to streamline your recruitment process
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {aiFeatures.map((feature) => (
              <div
                key={feature.title}
                className="p-6 rounded-2xl bg-muted/50 hover:bg-muted transition-colors group"
              >
                <div
                  className={`w-12 h-12 rounded-xl ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                >
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-muted/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground">
              Popular Categories
            </h2>
            <p className="text-muted-foreground mt-2">
              Browse jobs by category
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {categories.map((category) => (
              <Link
                key={category.name}
                href={`/jobs?category=${category.name}`}
                className="p-6 rounded-xl bg-background shadow-sm hover:shadow-md transition-shadow text-center group"
              >
                <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">
                  {category.icon}
                </div>
                <h3 className="font-semibold text-foreground">
                  {category.name}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {category.count} jobs
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground">
              What People Say
            </h2>
            <p className="text-muted-foreground mt-2">
              Success stories from our community
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.name}
                className="p-6 rounded-2xl bg-muted/50"
              >
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 fill-amber-400 text-amber-400"
                    />
                  ))}
                </div>
                <p className="text-foreground mb-6">{testimonial.content}</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-semibold">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-foreground">
                      {testimonial.name}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {testimonial.role}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-indigo-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Ready to Transform Your Hiring?
          </h2>
          <p className="text-indigo-100 mb-8 max-w-2xl mx-auto">
            Join thousands of companies and candidates who use HireIQ to find the
            perfect match.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-indigo-600 hover:bg-indigo-50" asChild>
              <Link href="/register">Get Started Free</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white/10"
              asChild
            >
              <Link href="/jobs">Browse Jobs</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
