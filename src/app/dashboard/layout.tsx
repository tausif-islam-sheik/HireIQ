"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import { cn, getInitials } from "@/lib/utils";
import {
  LayoutDashboard,
  Briefcase,
  Users,
  Building2,
  FileText,
  MessageSquare,
  Bell,
  User,
  LogOut,
  Menu,
  X,
  ChevronDown,
  Sun,
  Moon,
} from "lucide-react";
import { useTheme } from "next-themes";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { NotificationBell } from "@/components/shared/NotificationBell";

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  exact?: boolean;
}

const getNavItems = (role: string): NavItem[] => {
  const baseItems: NavItem[] = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard, exact: true },
    { href: "/dashboard/profile", label: "Profile", icon: User, exact: true },
    { href: "/dashboard/notifications", label: "Notifications", icon: Bell, exact: true },
  ];

  const adminItems: NavItem[] = [
    { href: "/dashboard/admin", label: "Overview", icon: LayoutDashboard, exact: true },
    { href: "/dashboard/admin/users", label: "Users", icon: Users },
    { href: "/dashboard/admin/jobs", label: "All Jobs", icon: Briefcase },
    { href: "/dashboard/admin/companies", label: "Companies", icon: Building2 },
    { href: "/dashboard/admin/analytics", label: "Analytics", icon: LayoutDashboard },
    { href: "/dashboard/admin/profile", label: "Profile", icon: User, exact: true },
  ];

  const recruiterItems: NavItem[] = [
    { href: "/dashboard/recruiter", label: "Overview", icon: LayoutDashboard, exact: true },
    { href: "/dashboard/recruiter/jobs", label: "My Jobs", icon: Briefcase },
    { href: "/dashboard/recruiter/applications", label: "Applications", icon: FileText },
    { href: "/dashboard/recruiter/pipeline", label: "Pipeline", icon: LayoutDashboard },
    { href: "/dashboard/recruiter/company", label: "Company", icon: Building2 },
    { href: "/dashboard/recruiter/profile", label: "Profile", icon: User, exact: true },
  ];

  const candidateItems: NavItem[] = [
    { href: "/dashboard/candidate", label: "Overview", icon: LayoutDashboard, exact: true },
    { href: "/dashboard/candidate/jobs", label: "Find Jobs", icon: Briefcase },
    { href: "/dashboard/candidate/applications", label: "My Applications", icon: FileText },
    { href: "/dashboard/candidate/resume", label: "Resume", icon: FileText },
    { href: "/dashboard/candidate/interviews", label: "Interviews", icon: MessageSquare },
    { href: "/dashboard/candidate/profile", label: "Profile", icon: User, exact: true },
  ];

  switch (role) {
    case "ADMIN":
      return [...adminItems, { href: "/dashboard/notifications", label: "Notifications", icon: Bell }];
    case "RECRUITER":
      return [...recruiterItems, { href: "/dashboard/notifications", label: "Notifications", icon: Bell }];
    case "CANDIDATE":
      return [...candidateItems, { href: "/dashboard/notifications", label: "Notifications", icon: Bell }];
    default:
      return baseItems;
  }
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout, isAuthenticated, isLoading } = useAuthStore();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch
  useState(() => setMounted(true));

  // Check authentication and RBAC
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
      return;
    }

    // Role-based access control
    if (user?.role) {
      const rolePath = pathname.split("/")[2]; // /dashboard/[role]/...
      
      // Map roles to their allowed path segments
      const rolePaths: Record<string, string[]> = {
        ADMIN: ["admin", "notifications", "profile"],
        RECRUITER: ["recruiter", "notifications", "profile"],
        CANDIDATE: ["candidate", "notifications", "profile"],
      };

      const allowedPaths = rolePaths[user.role] || [];
      
      // Check if current path is allowed for this role
      if (rolePath && !allowedPaths.includes(rolePath)) {
        // Redirect to their default dashboard
        router.push(`/dashboard/${user.role.toLowerCase()}`);
      }
    }
  }, [isAuthenticated, isLoading, user, pathname, router]);

  // Show loading while checking auth
  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
      </div>
    );
  }

  const navItems = getNavItems(user?.role || "CANDIDATE");

  return (
    <div className="min-h-screen bg-muted/50">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r bg-background hidden lg:block">
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center border-b px-6">
            <Link href="/" className="flex items-center gap-2 font-bold text-xl">
              <Briefcase className="h-6 w-6 text-primary" />
              <span>HireIQ</span>
            </Link>
          </div>

          {/* Navigation */}
          <ScrollArea className="flex-1 py-4">
            <nav className="px-4 space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = item.exact
                  ? pathname === item.href
                  : pathname === item.href || pathname.startsWith(`${item.href}/`);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-primary text-white"
                        : "text-slate-300 hover:bg-muted hover:text-white dark:text-slate-300 dark:hover:text-white"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </ScrollArea>

          {/* User Section */}
          <div className="border-t p-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="w-full justify-start gap-3 h-auto p-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.profilePicture || ""} />
                    <AvatarFallback>{getInitials(user?.name || "U")}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 text-left">
                    <p className="text-sm font-medium">{user?.name || "User"}</p>
                    <p className="text-xs text-muted-foreground capitalize">{user?.role?.toLowerCase()}</p>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link 
                    href={user?.role === "ADMIN" ? "/dashboard/admin/profile" : user?.role === "RECRUITER" ? "/dashboard/recruiter/profile" : "/dashboard/candidate/profile"} 
                    className="cursor-pointer"
                  >
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/notifications" className="cursor-pointer">
                    <Bell className="mr-2 h-4 w-4" />
                    Notifications
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout} className="cursor-pointer text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </aside>

      {/* Top Navbar */}
      <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 lg:ml-64">
        {/* Mobile Menu Button */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="lg:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Open menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0">
            <div className="flex h-full flex-col">
              {/* Logo */}
              <div className="flex h-16 items-center border-b px-6">
                <Link href="/" className="flex items-center gap-2 font-bold text-xl">
                  <Briefcase className="h-6 w-6 text-primary" />
                  <span>HireIQ</span>
                </Link>
              </div>
              {/* Mobile Navigation */}
              <ScrollArea className="flex-1 py-4">
                <nav className="px-4 space-y-1">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = item.exact
                  ? pathname === item.href
                  : pathname === item.href || pathname.startsWith(`${item.href}/`);
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                          "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                          isActive
                            ? "bg-primary text-primary-foreground"
                            : "text-muted-foreground hover:bg-muted hover:text-foreground"
                        )}
                      >
                        <Icon className="h-4 w-4" />
                        {item.label}
                      </Link>
                    );
                  })}
                </nav>
              </ScrollArea>
              {/* Mobile User Section */}
              <div className="border-t p-4">
                <Button variant="ghost" className="w-full justify-start gap-3 h-auto p-2" onClick={logout}>
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>{getInitials(user?.name || "U")}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 text-left">
                    <p className="text-sm font-medium">{user?.name || "User"}</p>
                    <p className="text-xs text-muted-foreground capitalize">{user?.role?.toLowerCase()}</p>
                  </div>
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>

        {/* Breadcrumb / Page Title */}
        <div className="flex-1">
          <h1 className="text-lg font-semibold lg:hidden">HireIQ</h1>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center gap-2">
          <NotificationBell />
          
          {/* Theme Toggle */}
          {mounted && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
              <span className="sr-only">Toggle theme</span>
            </Button>
          )}
          
          {/* User Dropdown for Desktop */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.profilePicture || ""} />
                  <AvatarFallback>{getInitials(user?.name || "U")}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link 
                  href={user?.role === "ADMIN" ? "/dashboard/admin/profile" : user?.role === "RECRUITER" ? "/dashboard/recruiter/profile" : "/dashboard/candidate/profile"} 
                  className="cursor-pointer"
                >
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/dashboard/notifications" className="cursor-pointer">
                  <Bell className="mr-2 h-4 w-4" />
                  Notifications
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout} className="cursor-pointer text-destructive">
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Main Content */}
      <main className="lg:ml-64">
        <div className="container mx-auto p-6">
          {children}
        </div>
      </main>
    </div>
  );
}
