"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase, Eye, EyeOff, Loader2, CheckCircle, Mail, Lock, ArrowRight } from "lucide-react";

const demoCredentials = [
  { role: "Admin", email: "admin@hireiq.com", password: "Admin@123" },
  { role: "Recruiter", email: "recruiter@hireiq.com", password: "Recruiter@123" },
  { role: "Candidate", email: "candidate@hireiq.com", password: "Candidate@123" },
];

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const result = await login(formData.email, formData.password);
    
    if (result?.success) {
      router.push("/");
    }
    
    setIsLoading(false);
  };

  const handleDemoLogin = async (email: string, password: string) => {
    setFormData({ email, password });
    setIsLoading(true);
    
    const result = await login(email, password);
    
    if (result?.success) {
      router.push("/");
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <div className="w-full max-w-md space-y-8">
        {/* Logo */}
        <div className="flex flex-col items-center space-y-2">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
              <Briefcase className="w-7 h-7 text-white" />
            </div>
            <span className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
              HireIQ
            </span>
          </Link>
          <p className="text-muted-foreground text-center text-sm">
            Sign in to access your account
          </p>
        </div>

        {/* Login Form */}
        <Card className="border-0 shadow-2xl shadow-slate-200/50 dark:shadow-slate-950/50">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-2xl font-bold text-center">Welcome Back</CardTitle>
            <CardDescription className="text-center">
              Enter your credentials to continue
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="pl-10 h-11"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    className="pl-10 pr-10 h-11"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-11 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-medium"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign In
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </>
                )}
              </Button>
            </form>

            {/* Demo Credentials */}
            <div className="pt-4 border-t">
              <p className="text-xs text-center text-muted-foreground mb-3">Quick Demo Login</p>
              <div className="grid grid-cols-3 gap-2">
                {demoCredentials.map((demo) => (
                  <button
                    key={demo.role}
                    onClick={() => handleDemoLogin(demo.email, demo.password)}
                    className="flex flex-col items-center gap-1.5 p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-indigo-300 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/30 transition-all group"
                  >
                    <CheckCircle className="w-5 h-5 text-indigo-600 group-hover:scale-110 transition-transform" />
                    <span className="text-xs font-semibold">{demo.role}</span>
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-center pb-6">
            <p className="text-sm text-muted-foreground">
              Don&apos;t have an account?{" "}
              <Link
                href="/register"
                className="text-indigo-600 hover:text-indigo-700 font-semibold hover:underline"
              >
                Sign up
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
