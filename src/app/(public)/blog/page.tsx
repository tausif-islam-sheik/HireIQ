"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Calendar, ArrowRight, User } from "lucide-react";
import Link from "next/link";
import { formatDate } from "@/lib/utils";

const blogPosts = [
  {
    id: 1,
    title: "How AI is Transforming the Recruitment Industry",
    excerpt:
      "Discover how artificial intelligence is revolutionizing hiring processes, from resume screening to candidate matching.",
    category: "AI & Technology",
    author: "Sarah Williams",
    date: "2024-01-15",
    readTime: "5 min read",
  },
  {
    id: 2,
    title: "10 Tips for Writing an ATS-Friendly Resume",
    excerpt:
      "Learn the best practices for optimizing your resume to pass through Applicant Tracking Systems and get noticed by recruiters.",
    category: "Career Advice",
    author: "Michael Chen",
    date: "2024-01-10",
    readTime: "8 min read",
  },
  {
    id: 3,
    title: "The Future of Remote Work: Trends to Watch",
    excerpt:
      "Explore the latest trends in remote work and how companies are adapting their hiring strategies for distributed teams.",
    category: "Workplace Trends",
    author: "Emily Rodriguez",
    date: "2024-01-05",
    readTime: "6 min read",
  },
  {
    id: 4,
    title: "Building Diverse and Inclusive Teams",
    excerpt:
      "Strategies for creating inclusive hiring practices that attract diverse talent and build stronger organizations.",
    category: "Diversity & Inclusion",
    author: "Alex Park",
    date: "2023-12-28",
    readTime: "7 min read",
  },
  {
    id: 5,
    title: "Mastering Technical Interviews",
    excerpt:
      "A comprehensive guide to preparing for technical interviews, including coding challenges and system design questions.",
    category: "Career Advice",
    author: "David Kim",
    date: "2023-12-20",
    readTime: "10 min read",
  },
  {
    id: 6,
    title: "Employer Branding: Attracting Top Talent",
    excerpt:
      "How to build a strong employer brand that attracts the best candidates and reduces time-to-hire.",
    category: "Recruiting",
    author: "Jessica Lee",
    date: "2023-12-15",
    readTime: "6 min read",
  },
];

const categories = [
  "All",
  "AI & Technology",
  "Career Advice",
  "Workplace Trends",
  "Diversity & Inclusion",
  "Recruiting",
];

export default function BlogPage() {
  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">HireIQ Blog</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Insights, tips, and trends about recruitment, career development, and
            the future of work.
          </p>
        </div>

        {/* Search and Categories */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search articles..." className="pl-10" />
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Badge
                key={category}
                variant={category === "All" ? "default" : "secondary"}
                className={
                  category === "All"
                    ? "bg-indigo-600 hover:bg-indigo-700 cursor-pointer"
                    : "cursor-pointer hover:bg-muted"
                }
              >
                {category}
              </Badge>
            ))}
          </div>
        </div>

        {/* Featured Post */}
        <Card className="mb-8 overflow-hidden">
          <div className="grid md:grid-cols-2">
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-8 flex items-center justify-center">
              <div className="text-center text-white">
                <Badge className="mb-4 bg-white/20 text-white border-0">
                  Featured
                </Badge>
                <h2 className="text-2xl font-bold mb-2">
                  The Complete Guide to AI-Powered Hiring
                </h2>
                <p className="text-white/80">
                  Learn how leading companies are using AI to streamline their
                  recruitment process.
                </p>
              </div>
            </div>
            <CardContent className="p-8">
              <Badge className="mb-4">AI & Technology</Badge>
              <h3 className="text-xl font-bold mb-2">
                How Machine Learning is Changing Candidate Screening
              </h3>
              <p className="text-muted-foreground mb-4">
                Machine learning algorithms are now capable of analyzing thousands
                of resumes in seconds, identifying the best candidates based on
                skills, experience, and cultural fit...
              </p>
              <Button variant="outline" className="group">
                Read Article
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </CardContent>
          </div>
        </Card>

        {/* Blog Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogPosts.map((post) => (
            <Card key={post.id} className="group cursor-pointer hover:shadow-lg transition-shadow">
              <CardHeader>
                <Badge variant="secondary" className="w-fit mb-2">
                  {post.category}
                </Badge>
                <CardTitle className="text-lg group-hover:text-indigo-600 transition-colors">
                  {post.title}
                </CardTitle>
                <CardDescription className="line-clamp-2">
                  {post.excerpt}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <User className="h-3 w-3" />
                    {post.author}
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {formatDate(post.date)}
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  {post.readTime}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Newsletter */}
        <Card className="mt-12 bg-indigo-50 dark:bg-indigo-950/30">
          <CardContent className="p-8">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-2xl font-bold mb-2">
                  Subscribe to Our Newsletter
                </h3>
                <p className="text-muted-foreground">
                  Get the latest recruitment insights and career tips delivered
                  straight to your inbox.
                </p>
              </div>
              <div className="flex gap-2">
                <Input placeholder="Enter your email" className="flex-1" />
                <Button className="bg-indigo-600 hover:bg-indigo-700">
                  Subscribe
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
