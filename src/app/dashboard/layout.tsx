"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
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
  Settings,
  User,
  LogOut,
} from "lucide-react";
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

const getNavItems = (role: string) => {
  const baseItems = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/dashboard/profile", label: "Profile", icon: User },
    { href: "/dashboard/notifications", label: "Notifications", icon: Bell },
  ];

  const adminItems = [
    { href: "/dashboard/admin", label: "Overview", icon: LayoutDashboard },
    { href: "/dashboard/admin/users", label: "Users", icon: Users },
    { href: "/dashboard/admin/jobs", label: "All Jobs", icon: Briefcase },
    { href: "/dashboard/admin/companies", label: "Companies", icon: Building2 },
  ];

  const recruiterItems = [
    { href: "/dashboard/recruiter", label: "Overview", icon: LayoutDashboard },
    { href: "/dashboard/recruiter/jobs", label: "My Jobs", icon: Briefcase },
    { href: "/dashboard/recruiter/applications", label: "Applications", icon: FileText },
    { href: "/dashboard/recruiter/company", label: "Company", icon: Building2 },
  ];

  const candidateItems = [
    { href: "/dashboard/candidate", label: "Overview", icon: LayoutDashboard },
    { href: "/dashboard/candidate/jobs", label: "Find Jobs", icon: Briefcase },
    { href: "/dashboard/candidate/applications", label: "My Applications", icon: FileText },
    { href: "/dashboard/candidate/resume", label: "Resume", icon: FileText },
    { href: "/dashboard/candidate/interviews", label: "Interviews", icon: MessageSquare },
  ];

  switch (role) {
    case "ADMIN":
      return [...adminItems, ...baseItems.slice(1)];
    case "RECRUITER":
      return [...recruiterItems, ...baseItems.slice(1)];
    case "CANDIDATE":
      return [...candidateItems, ...baseItems.slice(1)];
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
  const { user, logout } = useAuthStore();

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
                const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);

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
                  <Link href="/dashboard/profile" className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/settings" className="cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
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

      {/* Mobile Header */}
      <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 lg:hidden">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
          <Briefcase className="h-6 w-6 text-primary" />
          <span>HireIQ</span>
        </Link>
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
