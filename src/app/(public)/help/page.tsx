"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Search,
  MessageCircle,
  Mail,
  Phone,
  FileText,
  Shield,
  CreditCard,
  User,
  Building2,
  Loader2,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";

const helpCategories = [
  {
    icon: User,
    title: "Getting Started",
    description: "Learn how to create an account and set up your profile",
    articles: 12,
  },
  {
    icon: Building2,
    title: "For Employers",
    description: "Post jobs, manage applications, and hire candidates",
    articles: 15,
  },
  {
    icon: FileText,
    title: "Job Applications",
    description: "Apply for jobs, track applications, and manage your pipeline",
    articles: 10,
  },
  {
    icon: Shield,
    title: "Account & Security",
    description: "Manage your account settings and security preferences",
    articles: 8,
  },
  {
    icon: CreditCard,
    title: "Billing & Subscriptions",
    description: "Understand pricing, payments, and subscription plans",
    articles: 6,
  },
  {
    icon: MessageCircle,
    title: "AI Features",
    description: "Learn about our AI-powered recruitment tools",
    articles: 9,
  },
];

const faqs = [
  {
    question: "How do I create an account on HireIQ?",
    answer:
      "Click the 'Sign Up' button in the top right corner, choose your role (Candidate or Recruiter), and fill in your details. You'll receive a confirmation email to verify your account.",
    category: "Getting Started",
  },
  {
    question: "Is HireIQ free to use?",
    answer:
      "Yes! Candidates can use HireIQ completely free. Employers can post jobs and access basic features for free, with premium plans available for advanced features like AI candidate ranking and priority support.",
    category: "Billing",
  },
  {
    question: "How does the AI resume analyzer work?",
    answer:
      "Our AI resume analyzer uses Claude AI to evaluate your resume against job requirements. It provides match scores, identifies strengths and gaps, and suggests improvements. Upload your resume in the candidate dashboard to get started.",
    category: "AI Features",
  },
  {
    question: "Can I apply to multiple jobs at once?",
    answer:
      "Yes, you can save jobs to your favorites and apply to them individually. Each application is tailored to the specific job posting to maximize your chances of success.",
    category: "Job Applications",
  },
  {
    question: "How do I post a job as an employer?",
    answer:
      "Log in as a Recruiter, go to your Dashboard, and click 'Post New Job'. You can use our AI Job Description Generator to create professional job postings, or write your own.",
    category: "For Employers",
  },
  {
    question: "What file formats are supported for resume uploads?",
    answer:
      "We support PDF, DOC, and DOCX formats for resume uploads. PDF is recommended for best formatting consistency across different devices.",
    category: "Job Applications",
  },
  {
    question: "How is my personal data protected?",
    answer:
      "We take data security seriously. All data is encrypted in transit and at rest. We never sell your personal information and comply with GDPR and other privacy regulations. Read our Privacy Policy for more details.",
    category: "Security",
  },
  {
    question: "Can I delete my account?",
    answer:
      "Yes, you can delete your account at any time from your Profile settings. This will permanently remove your data from our systems, though some information may be retained as required by law.",
    category: "Account",
  },
];

const quickLinks = [
  { title: "Contact Support", href: "/contact", icon: MessageCircle },
  { title: "Privacy Policy", href: "/privacy", icon: Shield },
  { title: "Terms of Service", href: "/terms", icon: FileText },
];

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearching(true);
    setTimeout(() => setIsSearching(false), 500);
  };

  const filteredFaqs = faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Help Center</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Find answers to your questions and get the support you need
          </p>
        </div>

        {/* Search */}
        <Card className="mb-12">
          <CardContent className="p-8">
            <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="Search for help articles, FAQs, or topics..."
                  className="pl-12 pr-4 py-6 text-lg"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {isSearching && (
                  <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 animate-spin text-muted-foreground" />
                )}
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Quick Links */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
          {quickLinks.map((link) => (
            <Card key={link.title} className="group hover:border-indigo-500 transition-colors">
              <CardContent className="p-6">
                <Link href={link.href} className="flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-indigo-50 group-hover:bg-indigo-100 transition-colors">
                    <link.icon className="h-6 w-6 text-indigo-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold group-hover:text-indigo-600 transition-colors">
                      {link.title}
                    </h3>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-indigo-600 transition-colors" />
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Help Categories */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Browse by Category</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {helpCategories.map((category) => (
              <Card
                key={category.title}
                className="group cursor-pointer hover:shadow-lg transition-all duration-300"
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-lg bg-indigo-50 group-hover:bg-indigo-100 transition-colors">
                      <category.icon className="h-6 w-6 text-indigo-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold mb-1 group-hover:text-indigo-600 transition-colors">
                        {category.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        {category.description}
                      </p>
                      <Badge variant="secondary">{category.articles} articles</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Frequently Asked Questions</CardTitle>
                <CardDescription>
                  {searchQuery
                    ? `Showing ${filteredFaqs.length} results for "${searchQuery}"`
                    : "Find quick answers to common questions"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  {(searchQuery ? filteredFaqs : faqs).map((faq, index) => (
                    <AccordionItem key={index} value={`item-${index}`}>
                      <AccordionTrigger className="text-left">
                        <div className="flex items-center gap-3">
                          <Badge variant="outline" className="shrink-0">
                            {faq.category}
                          </Badge>
                          <span>{faq.question}</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground pl-[88px]">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
                {searchQuery && filteredFaqs.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">
                      No results found. Try a different search term.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Contact Support */}
          <div>
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle>Still Need Help?</CardTitle>
                <CardDescription>Our support team is here to assist you</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-indigo-600" />
                  <div>
                    <p className="font-medium">Email Support</p>
                    <a
                      href="mailto:support@hireiq.com"
                      className="text-sm text-muted-foreground hover:text-indigo-600"
                    >
                      support@hireiq.com
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-indigo-600" />
                  <div>
                    <p className="font-medium">Phone Support</p>
                    <p className="text-sm text-muted-foreground">+1 (555) 123-4567</p>
                    <p className="text-xs text-muted-foreground">Mon-Fri, 9am-5pm PST</p>
                  </div>
                </div>
                <Separator />
                <Button className="w-full" asChild>
                  <Link href="/contact">Contact Us</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
