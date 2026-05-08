"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, User, Bot, Sparkles, Loader2, Star } from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/axios";

interface Message {
  role: "user" | "assistant";
  content: string;
  feedback?: string;
  score?: number;
}

interface InterviewCoachProps {
  jobTitle: string;
  applicationId: string;
}

export function InterviewCoach({ jobTitle, applicationId }: InterviewCoachProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initial greeting
    if (messages.length === 0) {
      setMessages([
        {
          role: "assistant",
          content: `Hello! I'm your AI interview coach for the ${jobTitle} position. I'll be asking you questions similar to what you might encounter in a real interview. Let's begin!\n\nTell me a bit about yourself and your background.`,
        },
      ]);
    }
  }, [jobTitle, messages.length]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await api.post("/ai/interview-chat", {
        jobTitle,
        messages: [...messages, userMessage].map((m) => ({
          role: m.role,
          content: m.content,
        })),
      });

      const { reply, feedback, score, nextQuestion } = response.data.data;

      const assistantMessage: Message = {
        role: "assistant",
        content: reply,
        feedback,
        score,
      };

      setMessages((prev) => [...prev, assistantMessage]);

      if (nextQuestion) {
        setTimeout(() => {
          setMessages((prev) => [
            ...prev,
            { role: "assistant", content: `\n\n${nextQuestion}` },
          ]);
        }, 1000);
      }
    } catch {
      toast.error("Failed to get AI response. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Card className="h-[600px] flex flex-col bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900 border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-slate-900/50">
      <CardHeader className="border-b border-slate-200 dark:border-slate-800 bg-gradient-to-r from-indigo-50/50 to-purple-50/50 dark:from-indigo-950/30 dark:to-purple-950/30 pb-4">
        <CardTitle className="text-lg flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/25">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <span className="font-semibold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent">Interview Practice</span>
          </div>
          <Badge variant="secondary" className="w-fit truncate max-w-full bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-slate-200 dark:border-slate-700 font-medium">{jobTitle}</Badge>
        </CardTitle>
      </CardHeader>

      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        <div className="space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex gap-3 ${
                message.role === "user" ? "flex-row-reverse" : ""
              }`}
            >
              <Avatar className="h-8 w-8 ring-2 ring-white dark:ring-slate-800 shadow-md">
                {message.role === "user" ? (
                  <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
                    <User className="h-4 w-4" />
                  </AvatarFallback>
                ) : (
                  <AvatarFallback className="bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 text-indigo-600 dark:text-indigo-400">
                    <Bot className="h-4 w-4" />
                  </AvatarFallback>
                )}
              </Avatar>
              <div
                className={`max-w-[85%] sm:max-w-[80%] space-y-2 ${
                  message.role === "user" ? "items-end" : ""
                }`}
              >
                <div
                  className={`rounded-2xl p-4 shadow-lg ${
                    message.role === "user"
                      ? "bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-indigo-500/25"
                      : "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-slate-200/50 dark:shadow-slate-900/50"
                  }`}
                >
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                </div>

                {message.feedback && message.score !== undefined && (
                  <Card className="border-amber-200 dark:border-amber-800/50 bg-gradient-to-br from-amber-50/80 to-yellow-50/80 dark:from-amber-950/30 dark:to-yellow-950/30 shadow-lg shadow-amber-500/10">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="p-1 rounded-full bg-amber-100 dark:bg-amber-900/50">
                          <Star className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                        </div>
                        <span className="font-semibold text-sm text-amber-900 dark:text-amber-100">
                          Score: {message.score}/10
                        </span>
                      </div>
                      <p className="text-sm text-amber-800/80 dark:text-amber-200/80 leading-relaxed">
                        {message.feedback}
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex gap-3">
              <Avatar className="h-8 w-8 ring-2 ring-white dark:ring-slate-800 shadow-md">
                <AvatarFallback className="bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 text-indigo-600 dark:text-indigo-400">
                  <Bot className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-lg border border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-gradient-to-b from-slate-50/50 to-white dark:from-slate-900/50 dark:to-slate-900">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your response..."
              className="min-h-[60px] resize-none pr-12 rounded-xl border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-inner focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              disabled={isLoading}
            />
          </div>
          <Button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all w-full sm:w-auto shrink-0 rounded-xl h-[60px] px-6"
          >
            <Send className="h-4 w-4 mr-2" />
            Send
          </Button>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-3 text-center sm:text-left">
          Press <kbd className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-xs">Enter</kbd> to send, <kbd className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-xs">Shift+Enter</kbd> for new line
        </p>
      </div>
    </Card>
  );
}
