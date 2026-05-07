"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Target,
  Users,
  Sparkles,
  Zap,
  Award,
  Globe,
  ArrowRight,
  Briefcase,
} from "lucide-react";
import Link from "next/link";

const values = [
  {
    icon: Target,
    title: "Precision Matching",
    description:
      "Our AI algorithms analyze thousands of data points to find the perfect match between candidates and employers.",
  },
  {
    icon: Users,
    title: "People First",
    description:
      "We believe in putting people at the center of everything we do, creating meaningful connections that last.",
  },
  {
    icon: Sparkles,
    title: "Innovation",
    description:
      "Constantly pushing boundaries with cutting-edge AI technology to revolutionize the recruitment industry.",
  },
  {
    icon: Zap,
    title: "Efficiency",
    description:
      "Streamlined processes that save time for both job seekers and employers, making hiring faster and smarter.",
  },
];

const stats = [
  { value: "2M+", label: "Active Users" },
  { value: "50K+", label: "Companies" },
  { value: "1M+", label: "Jobs Posted" },
  { value: "98%", label: "Satisfaction Rate" },
];

const team = [
  {
    name: "Alex Chen",
    role: "CEO & Co-founder",
    bio: "Former Google recruiter with 10+ years in talent acquisition.",
  },
  {
    name: "Sarah Williams",
    role: "CTO & Co-founder",
    bio: "AI researcher and former Principal Engineer at Microsoft.",
  },
  {
    name: "Michael Park",
    role: "Head of Product",
    bio: "Product leader with experience at LinkedIn and Indeed.",
  },
  {
    name: "Emily Rodriguez",
    role: "Head of Design",
    bio: "Award-winning designer passionate about user experience.",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="py-20 bg-gradient-to-br from-indigo-50 via-white to-cyan-50 dark:from-indigo-950/20 dark:via-background dark:to-cyan-950/20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold mb-6">
            Revolutionizing Hiring with{" "}
            <span className="text-indigo-600">AI Intelligence</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            HireIQ is an AI-powered recruitment platform that connects top talent
            with innovative companies through intelligent matching and automated
            workflows.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-indigo-600 hover:bg-indigo-700" size="lg" asChild>
              <Link href="/jobs">Find Jobs</Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 border-y">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-indigo-600 mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
              <p className="text-lg text-muted-foreground mb-6">
                We&apos;re on a mission to make hiring fair, efficient, and
                human-centered. By leveraging artificial intelligence, we eliminate
                bias from the recruitment process and help companies build diverse,
                high-performing teams.
              </p>
              <p className="text-lg text-muted-foreground mb-6">
                For job seekers, we provide personalized career guidance, resume
                optimization, and interview preparation powered by cutting-edge AI.
              </p>
              <div className="flex items-center gap-4">
                <Award className="h-8 w-8 text-indigo-600" />
                <span className="font-medium">Top 50 HR Tech Companies 2024</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {values.map((value) => (
                <Card key={value.title} className="h-full">
                  <CardContent className="p-6">
                    <value.icon className="h-8 w-8 text-indigo-600 mb-4" />
                    <h3 className="font-semibold mb-2">{value.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {value.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 bg-muted/50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Meet Our Leadership</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              A diverse team of experts passionate about transforming the future of
              work.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member) => (
              <Card key={member.name}>
                <CardContent className="p-6 text-center">
                  <div className="w-20 h-20 rounded-full bg-indigo-100 dark:bg-indigo-900 mx-auto mb-4 flex items-center justify-center">
                    <span className="text-2xl font-bold text-indigo-600">
                      {member.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </span>
                  </div>
                  <h3 className="font-semibold text-lg">{member.name}</h3>
                  <p className="text-indigo-600 text-sm mb-2">{member.role}</p>
                  <p className="text-sm text-muted-foreground">{member.bio}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Join the Future of Hiring</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Whether you&apos;re looking for your next opportunity or building your dream
            team, HireIQ is here to help.
          </p>
          <Button className="bg-indigo-600 hover:bg-indigo-700" size="lg" asChild>
            <Link href="/register">
              Get Started
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
