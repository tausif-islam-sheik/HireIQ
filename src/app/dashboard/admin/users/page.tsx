"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { User, Search, Ban, CheckCircle, UserCheck, Users2 } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { useState } from "react";
import { toast } from "sonner";
import { UserRole } from "@/types";
import { EmptyState } from "@/components/shared/EmptyState";
import { Pagination } from "@/components/shared/Pagination";

interface UserData {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
  _count?: {
    applications?: number;
    jobs?: number;
  };
}

const PAGE_SIZE = 10;

export default function AdminUsersPage() {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);

  const { data: users, isLoading } = useQuery({
    queryKey: ["admin-users", searchQuery, roleFilter],
    queryFn: async () => {
      const params: { search?: string; role?: string } = {};
      if (searchQuery) params.search = searchQuery;
      if (roleFilter !== "all") params.role = roleFilter;
      
      const response = await api.get("/admin/users", { params });
      return response.data.data.users as UserData[];
    },
  });

  const toggleStatusMutation = useMutation({
    mutationFn: async ({ userId, isActive }: { userId: string; isActive: boolean }) => {
      const response = await api.put(`/admin/users/${userId}/status`, { isActive });
      return response.data;
    },
    onSuccess: () => {
      toast.success("User status updated");
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
    },
    onError: () => {
      toast.error("Failed to update user status");
    },
  });

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case "ADMIN":
        return <Badge className="bg-purple-600">Admin</Badge>;
      case "RECRUITER":
        return <Badge className="bg-blue-600">Recruiter</Badge>;
      case "CANDIDATE":
        return <Badge variant="secondary">Candidate</Badge>;
      default:
        return <Badge variant="outline">{role}</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-96" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">User Management</h1>
        <p className="text-muted-foreground">
          Manage all users on the platform
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4 justify-between">
            <CardTitle>All Users</CardTitle>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search users..."
                  className="pl-10 w-[200px]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="All Roles" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="CANDIDATE">Candidate</SelectItem>
                  <SelectItem value="RECRUITER">Recruiter</SelectItem>
                  <SelectItem value="ADMIN">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {users && users.length === 0 ? (
            <EmptyState
              icon={Users2}
              title="No users found"
              description={searchQuery ? "No users match your search criteria." : "There are no users on the platform yet."}
              actionLabel={searchQuery ? "Clear Search" : undefined}
              onAction={searchQuery ? () => setSearchQuery("") : undefined}
            />
          ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead>Activity</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users?.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE).map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{getRoleBadge(user.role)}</TableCell>
                  <TableCell>{formatDate(user.createdAt)}</TableCell>
                  <TableCell>
                    {user.role === "CANDIDATE" && (
                      <span className="text-sm text-muted-foreground">
                        {user._count?.applications || 0} applications
                      </span>
                    )}
                    {user.role === "RECRUITER" && (
                      <span className="text-sm text-muted-foreground">
                        {user._count?.jobs || 0} jobs posted
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={user.isActive ? "default" : "secondary"}
                      className={user.isActive ? "bg-green-600" : "bg-red-600"}
                    >
                      {user.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        toggleStatusMutation.mutate({
                          userId: user.id,
                          isActive: !user.isActive,
                        })
                      }
                      disabled={toggleStatusMutation.isPending}
                    >
                      {user.isActive ? (
                        <Ban className="h-4 w-4 mr-1 text-red-500" />
                      ) : (
                        <CheckCircle className="h-4 w-4 mr-1 text-green-500" />
                      )}
                      {user.isActive ? "Deactivate" : "Activate"}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          )}
          {users && users.length > PAGE_SIZE && (
            <div className="mt-4 flex justify-center">
              <Pagination
                currentPage={currentPage}
                totalPages={Math.ceil(users.length / PAGE_SIZE)}
                onPageChange={setCurrentPage}
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
