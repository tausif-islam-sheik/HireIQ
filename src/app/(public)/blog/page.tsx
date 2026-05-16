"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Calendar, ArrowRight, User } from "lucide-react";
import Link from "next/link";
import { formatDate } from "@/lib/utils";
import gsap from "gsap";
import { blogPosts, categories } from "@/lib/blog-data";

export default function BlogPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const containerRef = useRef<HTMLDivElement>(null);

  // Filter posts
  const filteredPosts = blogPosts.filter((post) => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === "All" || post.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  useEffect(() => {
    if (containerRef.current) {
      const ctx = gsap.context(() => {
        // Use fromTo to prevent elements getting stuck at opacity 0 during re-renders
        gsap.fromTo(".header-anim", 
          { y: 20, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.1,
            ease: "power3.out",
            clearProps: "all"
          }
        );

        // Animate cards whenever they change
        gsap.fromTo(".card-anim", 
          { y: 30, opacity: 0 },
          { 
            y: 0, 
            opacity: 1, 
            duration: 0.6, 
            stagger: 0.1, 
            ease: "power3.out",
            clearProps: "all"
          }
        );
      }, containerRef);
      return () => ctx.revert();
    }
  }, [activeCategory, searchQuery]);
  return (
    <div ref={containerRef} className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="header-anim text-center mb-10">
          <h1 className="text-4xl sm:text-5xl font-bold mb-6 tracking-tight">HireIQ Blog</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10">
            Insights, tips, and trends about recruitment, career development, and
            the future of work.
          </p>
          
          {/* Search Bar - Centered and prominent */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <Input 
                placeholder="Search articles, topics, or keywords..." 
                className="pl-12 h-14 bg-card border-border/50 focus-visible:border-indigo-500 rounded-full text-base shadow-sm w-full transition-all hover:border-border" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Categories - Centered pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
            {categories.map((category) => (
              <Badge
                key={category}
                variant={category === activeCategory ? "default" : "secondary"}
                className={
                  category === activeCategory
                    ? "bg-indigo-600 hover:bg-indigo-700 cursor-pointer px-5 py-2.5 text-sm rounded-full transition-all shadow-sm"
                    : "cursor-pointer bg-card hover:bg-muted text-muted-foreground hover:text-foreground border border-border/50 px-5 py-2.5 text-sm rounded-full transition-all shadow-sm"
                }
                onClick={() => setActiveCategory(category)}
              >
                {category}
              </Badge>
            ))}
          </div>
        </div>

        {/* Blog Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {filteredPosts.length > 0 ? (
            filteredPosts.map((post) => (
              <Link href={`/blog/${post.id}`} key={post.id} className="card-anim block h-full">
                <Card className="group h-full flex flex-col cursor-pointer hover:shadow-xl hover:border-indigo-500/30 transition-all duration-300 hover:-translate-y-1">
                  <div className="aspect-[16/9] w-full overflow-hidden bg-muted">
                    <img 
                      src={post.image} 
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <CardHeader className="flex-1 pt-5 pb-4">
                    <Badge variant="secondary" className="w-fit mb-3 bg-muted text-foreground">
                      {post.category}
                    </Badge>
                    <CardTitle className="text-xl leading-tight group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors mb-2">
                      {post.title}
                    </CardTitle>
                    <CardDescription className="line-clamp-2 text-base">
                      {post.excerpt}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="mt-auto pt-0 pb-5">
                    <div className="flex items-center justify-between text-sm text-muted-foreground border-t pt-4">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        <span className="font-medium text-foreground">{post.author}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        {formatDate(post.date)}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))
          ) : (
            <div className="col-span-full py-12 text-center text-muted-foreground card-anim">
              No articles found matching your criteria.
            </div>
          )}
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
