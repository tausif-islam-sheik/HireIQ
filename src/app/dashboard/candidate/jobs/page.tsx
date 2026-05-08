"use client";

import { useState, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";
import { JobCard } from "@/components/shared/JobCard";
import { SkeletonCard } from "@/components/shared/SkeletonCard";
import { SearchBar } from "@/components/shared/SearchBar";
import { FilterPanel } from "@/components/shared/FilterPanel";
import { Pagination } from "@/components/shared/Pagination";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Bookmark, SlidersHorizontal, SearchX } from "lucide-react";
import { EmptyState } from "@/components/shared/EmptyState";
import { Job, JobFilterParams, ApiResponse, PaginationInfo } from "@/types";

const jobTypes = [
  { value: "FULL_TIME", label: "Full Time" },
  { value: "PART_TIME", label: "Part Time" },
  { value: "CONTRACT", label: "Contract" },
  { value: "REMOTE", label: "Remote" },
  { value: "INTERNSHIP", label: "Internship" },
];

const categories = [
  { value: "Engineering", label: "Engineering" },
  { value: "Design", label: "Design" },
  { value: "Marketing", label: "Marketing" },
  { value: "Sales", label: "Sales" },
  { value: "Data Science", label: "Data Science" },
  { value: "Product", label: "Product" },
  { value: "Finance", label: "Finance" },
  { value: "HR", label: "HR" },
];

const salaryRanges = [
  { value: "$80,000", label: "$80k - $100k / year" },
  { value: "$100,000", label: "$100k - $130k / year" },
  { value: "$110,000", label: "$110k - $140k / year" },
  { value: "$120,000", label: "$120k - $150k / year" },
  { value: "$125,000", label: "$125k - $155k / year" },
  { value: "$130,000", label: "$130k - $160k / year" },
  { value: "$140,000", label: "$140k - $175k / year" },
  { value: "$150,000", label: "$150k - $190k / year" },
  { value: "$160,000", label: "$160k - $200k / year" },
];

const sortOptions = [
  { value: "newest", label: "Newest First" },
  { value: "salary_high", label: "Salary: High to Low" },
  { value: "salary_low", label: "Salary: Low to High" },
];

export default function CandidateJobsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState("newest");
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({
    type: "all",
    category: "all",
    salary: "all",
  });

  const filters = [
    { key: "category", label: "Category", options: categories },
    { key: "type", label: "Job Type", options: jobTypes },
    { key: "salary", label: "Salary Range", options: salaryRanges },
  ];

  const fetchJobs = async () => {
    const params: JobFilterParams = {
      page: currentPage,
      limit: 12,
      search: searchQuery || undefined,
      sortBy,
      category: activeFilters.category !== "all" ? activeFilters.category : undefined,
      type: activeFilters.type !== "all" ? activeFilters.type : undefined,
      salary: activeFilters.salary !== "all" ? activeFilters.salary : undefined,
    };

    const response = await api.get<ApiResponse<{ jobs: Job[]; pagination: PaginationInfo }>>("/jobs", { params });
    return response.data.data;
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ["candidate-jobs", currentPage, searchQuery, sortBy, activeFilters],
    queryFn: fetchJobs,
  });

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  }, []);

  const handleFilterChange = (key: string, value: string) => {
    setActiveFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setActiveFilters({
      type: "all",
      category: "all",
      salary: "all",
    });
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Find Jobs</h1>
          <p className="text-muted-foreground">
            Discover opportunities that match your skills and interests
          </p>
        </div>
        <Button variant="outline" asChild className="w-full sm:w-auto">
          <a href="/dashboard/candidate/applications">
            <Bookmark className="mr-2 h-4 w-4" />
            My Applications
          </a>
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <SearchBar
            onSearch={handleSearch}
            placeholder="Search by job title, company, or keywords"
            className="flex-1"
          />
          <div className="flex gap-2 w-full sm:w-auto">
            <Select value={sortBy} onValueChange={(value: string) => setSortBy(value)}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <FilterPanel
          filters={filters}
          activeFilters={activeFilters}
          onFilterChange={handleFilterChange}
          onClearFilters={handleClearFilters}
        />
      </div>

      {/* Results */}
      {error ? (
        <div className="text-center py-12">
          <p className="text-destructive">Failed to load jobs. Please try again.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {isLoading
              ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
              : data?.jobs?.map((job) => <JobCard key={job.id} job={job} />)}
          </div>

          {!isLoading && data?.jobs?.length === 0 && (
            <EmptyState
              icon={SearchX}
              title="No jobs found"
              description="No jobs match your current search and filter criteria."
              actionLabel="Clear Filters"
              onAction={handleClearFilters}
            />
          )}

          {!isLoading && data?.pagination && data.pagination.totalPages > 1 && (
            <div className="mt-8">
              <Pagination
                currentPage={currentPage}
                totalPages={data.pagination.totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}
