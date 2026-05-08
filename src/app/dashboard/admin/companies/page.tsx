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
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Building2, Search, Globe, Users, Briefcase, CheckCircle, Ban, Building } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { EmptyState } from "@/components/shared/EmptyState";
import { Pagination } from "@/components/shared/Pagination";

interface CompanyData {
  id: string;
  name: string;
  website?: string;
  industry?: string;
  size?: string;
  isVerified: boolean;
  createdAt: string;
  _count?: {
    jobs?: number;
    users?: number;
  };
}

const PAGE_SIZE = 10;

export default function AdminCompaniesPage() {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const { data: companies, isLoading } = useQuery({
    queryKey: ["admin-companies", searchQuery],
    queryFn: async () => {
      const params = searchQuery ? { search: searchQuery } : {};
      const response = await api.get("/admin/companies", { params });
      return response.data.data.companies as CompanyData[];
    },
  });

  const verifyMutation = useMutation({
    mutationFn: async ({ companyId, isVerified }: { companyId: string; isVerified: boolean }) => {
      const response = await api.put(`/admin/companies/${companyId}/verify`, { isVerified });
      return response.data;
    },
    onSuccess: () => {
      toast.success("Company verification updated");
      queryClient.invalidateQueries({ queryKey: ["admin-companies"] });
    },
    onError: () => {
      toast.error("Failed to update company verification");
    },
  });

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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Company Management</h1>
          <p className="text-muted-foreground">
            Manage and verify companies on the platform
          </p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search companies..."
            className="pl-10 w-[250px]"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {companies && companies.length === 0 ? (
        <Card>
          <CardContent className="p-0">
            <EmptyState
              icon={Building}
              title="No companies found"
              description={searchQuery ? "No companies match your search criteria." : "There are no companies registered on the platform yet."}
              actionLabel={searchQuery ? "Clear Search" : undefined}
              onAction={searchQuery ? () => setSearchQuery("") : undefined}
            />
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Company</TableHead>
                  <TableHead>Industry</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead>Jobs</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {companies?.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE).map((company) => (
                <TableRow key={company.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{company.name}</p>
                        {company.website && (
                          <a
                            href={company.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-indigo-600 hover:underline flex items-center gap-1"
                          >
                            <Globe className="h-3 w-3" />
                            Website
                          </a>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{company.industry || "-"}</TableCell>
                  <TableCell>{company.size || "-"}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Briefcase className="h-4 w-4 text-muted-foreground" />
                      {company._count?.jobs || 0}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={company.isVerified ? "default" : "secondary"}
                      className={company.isVerified ? "bg-green-600" : ""}
                    >
                      {company.isVerified ? "Verified" : "Unverified"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        verifyMutation.mutate({
                          companyId: company.id,
                          isVerified: !company.isVerified,
                        })
                      }
                      disabled={verifyMutation.isPending}
                    >
                      {company.isVerified ? (
                        <Ban className="h-4 w-4 mr-1 text-red-500" />
                      ) : (
                        <CheckCircle className="h-4 w-4 mr-1 text-green-500" />
                      )}
                      {company.isVerified ? "Unverify" : "Verify"}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            </Table>
            {/* Pagination */}
            {companies && companies.length > PAGE_SIZE && (
              <div className="mt-4 flex justify-center">
                <Pagination
                  currentPage={currentPage}
                  totalPages={Math.ceil(companies.length / PAGE_SIZE)}
                  onPageChange={setCurrentPage}
                />
              </div>
            )}
        </CardContent>
      </Card>
      )}
    </div>
  );
}
