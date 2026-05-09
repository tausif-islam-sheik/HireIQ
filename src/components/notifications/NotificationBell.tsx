"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Bell, Check, Trash2, Briefcase, User, MessageSquare, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatDistanceToNow } from "date-fns";
import { useAuthStore } from "@/store/authStore";
import { cn } from "@/lib/utils";

interface Notification {
  id: string;
  type: "JOB_APPLICATION" | "STATUS_UPDATE" | "MESSAGE" | "SYSTEM";
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  link?: string;
}

const iconMap = {
  JOB_APPLICATION: Briefcase,
  STATUS_UPDATE: Check,
  MESSAGE: MessageSquare,
  SYSTEM: Bell,
};

const colorMap = {
  JOB_APPLICATION: "bg-blue-500",
  STATUS_UPDATE: "bg-emerald-500",
  MESSAGE: "bg-violet-500",
  SYSTEM: "bg-amber-500",
};

export function NotificationBell() {
  const { user, isAuthenticated } = useAuthStore();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // Fetch notifications
  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchNotifications = async () => {
      setIsLoading(true);
      try {
        // Simulated API call - replace with actual endpoint
        // const response = await api.get("/notifications");
        // setNotifications(response.data);
        
        // Demo data for now
        const demoNotifications: Notification[] = [
          {
            id: "1",
            type: "JOB_APPLICATION",
            title: "New Application",
            message: "Sarah Chen applied for Senior Frontend Developer",
            read: false,
            createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 min ago
            link: "/dashboard/recruiter/applicants",
          },
          {
            id: "2",
            type: "STATUS_UPDATE",
            title: "Application Reviewed",
            message: "Your application at Google has been reviewed",
            read: false,
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
            link: "/dashboard/candidate/applications",
          },
          {
            id: "3",
            type: "MESSAGE",
            title: "New Message",
            message: "Recruiter from TechCorp sent you a message",
            read: true,
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
            link: "/dashboard/candidate/messages",
          },
        ];
        setNotifications(demoNotifications);
        setUnreadCount(demoNotifications.filter((n) => !n.read).length);
      } catch (error) {
        console.error("Failed to fetch notifications:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotifications();

    // Set up polling or WebSocket for real-time updates
    const interval = setInterval(fetchNotifications, 30000); // Poll every 30s
    return () => clearInterval(interval);
  }, [isAuthenticated]);

  const markAsRead = async (id: string) => {
    try {
      // await api.put(`/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      console.error("Failed to mark as read:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      // await api.put("/notifications/read-all");
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error("Failed to mark all as read:", error);
    }
  };

  const deleteNotification = async (id: string) => {
    try {
      // await api.delete(`/notifications/${id}`);
      setNotifications((prev) => prev.filter((n) => n.id !== id));
      const deleted = notifications.find((n) => n.id === id);
      if (deleted && !deleted.read) {
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error("Failed to delete notification:", error);
    }
  };

  if (!isAuthenticated) return null;

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-medium text-white animate-pulse">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-96">
        <DropdownMenuLabel className="flex items-center justify-between">
          <span className="font-semibold">Notifications</span>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={markAllAsRead}
              className="h-auto py-1 px-2 text-xs"
            >
              Mark all read
            </Button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <ScrollArea className="h-[300px]">
          {isLoading ? (
            <div className="flex items-center justify-center h-32">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-32 text-center px-4">
              <Bell className="h-8 w-8 text-muted-foreground/50 mb-2" />
              <p className="text-sm text-muted-foreground">No notifications yet</p>
            </div>
          ) : (
            notifications.map((notification) => {
              const Icon = iconMap[notification.type];
              const iconColor = colorMap[notification.type];

              return (
                <DropdownMenuItem
                  key={notification.id}
                  className={cn(
                    "flex items-start gap-3 p-3 cursor-pointer focus:bg-accent",
                    !notification.read && "bg-blue-50/50 dark:bg-blue-950/20"
                  )}
                  onClick={() => {
                    if (!notification.read) {
                      markAsRead(notification.id);
                    }
                  }}
                >
                  {notification.link ? (
                    <Link
                      href={notification.link}
                      className="flex items-start gap-3 flex-1"
                      onClick={() => setIsOpen(false)}
                    >
                      <div
                        className={cn(
                          "flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center",
                          iconColor
                        )}
                      >
                        <Icon className="h-4 w-4 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p
                          className={cn(
                            "text-sm font-medium",
                            !notification.read && "text-foreground"
                          )}
                        >
                          {notification.title}
                        </p>
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {notification.message}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {formatDistanceToNow(new Date(notification.createdAt), {
                            addSuffix: true,
                          })}
                        </p>
                      </div>
                    </Link>
                  ) : (
                    <>
                      <div
                        className={cn(
                          "flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center",
                          iconColor
                        )}
                      >
                        <Icon className="h-4 w-4 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p
                          className={cn(
                            "text-sm font-medium",
                            !notification.read && "text-foreground"
                          )}
                        >
                          {notification.title}
                        </p>
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {notification.message}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {formatDistanceToNow(new Date(notification.createdAt), {
                            addSuffix: true,
                          })}
                        </p>
                      </div>
                    </>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="flex-shrink-0 h-7 w-7 opacity-0 group-hover:opacity-100 hover:opacity-100"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteNotification(notification.id);
                    }}
                  >
                    <Trash2 className="h-3 w-3 text-muted-foreground" />
                  </Button>
                </DropdownMenuItem>
              );
            })
          )}
        </ScrollArea>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="justify-center" asChild>
          <Link href="/dashboard/notifications" className="text-sm text-center">
            View all notifications
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
