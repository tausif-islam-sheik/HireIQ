import { notFound } from "next/navigation";
import { blogPosts } from "@/lib/blog-data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, User, Clock } from "lucide-react";
import Link from "next/link";
import { formatDate } from "@/lib/utils";

export default function BlogPostPage({ params }: { params: { id: string } }) {
  const post = blogPosts.find((p) => p.id === parseInt(params.id));

  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen py-12 bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Back Button */}
        <Button variant="ghost" asChild className="mb-8 group">
          <Link href="/blog">
            <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            Back to Blog
          </Link>
        </Button>

        {/* Hero Image */}
        <div className="aspect-[21/9] w-full overflow-hidden rounded-2xl bg-muted mb-8 relative">
          <img 
            src={post.image} 
            alt={post.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-6 left-6 right-6">
            <Badge className="bg-indigo-600 hover:bg-indigo-700 text-white border-0 mb-4">
              {post.category}
            </Badge>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight mb-4">
              {post.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-white/80">
              <div className="flex items-center gap-1.5">
                <User className="h-4 w-4" />
                <span className="font-medium">{post.author}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                {formatDate(post.date)}
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="h-4 w-4" />
                {post.readTime}
              </div>
            </div>
          </div>
        </div>

        {/* Article Content */}
        <article className="prose prose-lg dark:prose-invert max-w-none">
          <p className="text-xl text-muted-foreground leading-relaxed mb-8">
            {post.excerpt}
          </p>
          
          {/* Dangerously setting HTML content from the mock data */}
          <div dangerouslySetInnerHTML={{ __html: post.content || "" }} />
        </article>
      </div>
    </div>
  );
}
