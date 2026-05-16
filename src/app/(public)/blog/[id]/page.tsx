"use client";

import { notFound } from "next/navigation";
import { blogPosts } from "@/lib/blog-data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Calendar, User, Clock, Share2, Bookmark } from "lucide-react";
import Link from "next/link";
import { formatDate } from "@/lib/utils";
import React, { useEffect, useRef } from "react";
import gsap from "gsap";

export default function BlogPostPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = React.use(params);
  const post = blogPosts.find((p) => p.id === parseInt(resolvedParams.id));
  const containerRef = useRef<HTMLDivElement>(null);

  if (!post) {
    notFound();
  }

  // Get related posts (same category, excluding current)
  const relatedPosts = blogPosts
    .filter((p) => p.category === post.category && p.id !== post.id)
    .slice(0, 3);

  useEffect(() => {
    if (containerRef.current) {
      const ctx = gsap.context(() => {
        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

        tl.fromTo(".anim-fade-up", 
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, stagger: 0.15, clearProps: "all" }
        );
      }, containerRef);
      return () => ctx.revert();
    }
  }, [params.id]);

  return (
    <div ref={containerRef} className="min-h-screen py-12 bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Navigation & Actions */}
        <div className="flex items-center justify-between mb-8 anim-fade-up">
          <Button variant="ghost" asChild className="group">
            <Link href="/blog">
              <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
              Back to Blog
            </Link>
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" size="icon" className="rounded-full h-10 w-10">
              <Share2 className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" className="rounded-full h-10 w-10">
              <Bookmark className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Hero Image Section */}
        <div className="anim-fade-up aspect-[16/10] sm:aspect-[21/9] w-full overflow-hidden rounded-2xl sm:rounded-3xl bg-muted mb-8 sm:mb-10 relative shadow-2xl">
          <img 
            src={post.image} 
            alt={post.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent" />
          <div className="absolute bottom-4 left-4 right-4 sm:bottom-10 sm:left-10 sm:right-10">
            <Badge className="bg-indigo-600 hover:bg-indigo-700 text-white border-0 mb-3 sm:mb-4 px-3 py-0.5 sm:px-4 sm:py-1 text-[10px] sm:text-xs">
              {post.category}
            </Badge>
            <h1 className="text-xl sm:text-4xl md:text-5xl font-bold text-white leading-tight mb-4 sm:mb-6">
              {post.title}
            </h1>
            <div className="flex flex-wrap items-center gap-3 sm:gap-8 text-[10px] sm:text-sm text-white/90">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-indigo-500/30 backdrop-blur-md flex items-center justify-center text-[10px] sm:text-xs font-bold border border-white/20">
                  {post.author.charAt(0)}
                </div>
                <span className="font-medium">{post.author}</span>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <Calendar className="h-3 w-3 sm:h-4 sm:w-4 text-indigo-400" />
                {formatDate(post.date)}
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-indigo-400" />
                {post.readTime}
              </div>
            </div>
          </div>
        </div>

        {/* Article Body */}
        <article className="anim-fade-up prose prose-lg dark:prose-invert max-w-none border-b border-border/50 pb-12 mb-16">
          <p className="text-xl text-muted-foreground font-medium leading-relaxed mb-10 italic border-l-4 border-indigo-500 pl-6">
            {post.excerpt}
          </p>
          <div 
            className="article-content prose-headings:font-bold prose-h2:text-3xl prose-p:text-muted-foreground prose-p:leading-relaxed"
            dangerouslySetInnerHTML={{ __html: post.content || "" }} 
          />
        </article>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <div className="anim-fade-up">
            <h2 className="text-2xl font-bold mb-8">Related Articles</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedPosts.map((rp) => (
                <Link href={`/blog/${rp.id}`} key={rp.id}>
                  <Card className="group h-full hover:shadow-xl transition-all duration-300 border-border/50 overflow-hidden bg-card">
                    <div className="aspect-video w-full overflow-hidden">
                      <img src={rp.image} alt={rp.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                    <CardHeader className="p-5">
                      <Badge variant="secondary" className="w-fit mb-3 text-[10px] bg-muted text-foreground border-0">{rp.category}</Badge>
                      <CardTitle className="text-base leading-tight group-hover:text-indigo-600 transition-colors line-clamp-2">{rp.title}</CardTitle>
                    </CardHeader>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
