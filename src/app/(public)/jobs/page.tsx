"use client";

import { useState, useCallback, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";
import { JobCard } from "@/components/shared/JobCard";
import { SkeletonCard } from "@/components/shared/SkeletonCard";
import { SearchBar } from "@/components/shared/SearchBar";
import { FilterPanel } from "@/components/shared/FilterPanel";
import { Pagination } from "@/components/shared/Pagination";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  SlidersHorizontal,
  Grid3X3,
  List,
  Search,
  MapPin,
  Briefcase,
  Clock,
  Sparkles,
  Building2,
  ChevronDown,
  X,
  Filter,
} from "lucide-react";
import { Job, JobFilterParams, ApiResponse, PaginationInfo } from "@/types";
import Link from "next/link";

const jobTypes = [
  { value: "FULL_TIME", label: "Full Time" },
  { value: "PART_TIME", label: "Part Time" },
  { value: "CONTRACT", label: "Contract" },
  { value: "REMOTE", label: "Remote" },
  { value: "INTERNSHIP", label: "Internship" },
];

const experienceLevels = [
  { value: "entry", label: "Entry Level" },
  { value: "mid", label: "Mid Level" },
  { value: "senior", label: "Senior Level" },
  { value: "lead", label: "Lead/Manager" },
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

const locations = [
  { value: "Remote", label: "Remote" },
  { value: "New York", label: "New York" },
  { value: "San Francisco", label: "San Francisco" },
  { value: "London", label: "London" },
  { value: "Berlin", label: "Berlin" },
];

const sortOptions = [
  { value: "newest", label: "Newest First" },
  { value: "salary_high", label: "Salary: High to Low" },
  { value: "salary_low", label: "Salary: Low to High" },
];

export default function JobsPage() {
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState("newest");
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({
    type: "all",
    category: "all",
    location: "all",
    experience: "all",
  });

  // Read search query from URL on mount
  useEffect(() => {
    const urlSearch = searchParams.get("search");
    if (urlSearch) {
      setSearchQuery(urlSearch);
    }
  }, [searchParams]);

  const filters = [
    { key: "category", label: "Category", options: categories },
    { key: "type", label: "Job Type", options: jobTypes },
    { key: "location", label: "Location", options: locations },
    { key: "experience", label: "Experience", options: experienceLevels },
  ];

  const fetchJobs = async () => {
    const params: JobFilterParams = {
      page: currentPage,
      limit: 12,
      search: searchQuery || undefined,
      sortBy,
      category: activeFilters.category !== "all" ? activeFilters.category : undefined,
      type: activeFilters.type !== "all" ? activeFilters.type : undefined,
      location: activeFilters.location !== "all" ? activeFilters.location : undefined,
      experience: activeFilters.experience !== "all" ? activeFilters.experience : undefined,
    };

    const response = await api.get<ApiResponse<{ jobs: Job[]; pagination: PaginationInfo }>>("/jobs", { params });
    return response.data.data;
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ["jobs", currentPage, searchQuery, sortBy, activeFilters],
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
    setSearchQuery("");
    setActiveFilters({
      type: "all",
      category: "all",
      location: "all",
      experience: "all",
    });
    setCurrentPage(1);
    // Update URL to remove search param
    window.history.replaceState({}, "", "/jobs");
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Count active filters
  const activeFilterCount = Object.values(activeFilters).filter(v => v !== "all").length;

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-blue-600 via-violet-600 to-purple-600 pt-16 pb-24 lg:pb-32 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-30"></div>
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-white/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/4"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-cyan-500/20 rounded-full blur-[80px] translate-y-1/4 -translate-x-1/4"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 mb-6">
              <Sparkles className="w-4 h-4 text-cyan-300" />
              <span className="text-sm text-white/90">AI-Powered Job Matching</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
              Find Your Dream Job
            </h1>
            <p className="text-xl text-white/80 mb-8">
              Discover {data?.pagination?.total?.toLocaleString() || "thousands of"} opportunities from top companies
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="flex gap-2 p-2 bg-white rounded-2xl shadow-2xl">
                <div className="flex-1 flex items-center px-4">
                  <Search className="w-5 h-5 text-slate-400 mr-3" />
                  <input
                    type="text"
                    placeholder="Search by job title, company, or keywords..."
                    className="w-full bg-transparent outline-none text-slate-900 placeholder:text-slate-400"
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                  />
                </div>
                <Button 
                  className="bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 px-6 rounded-xl"
                  onClick={() => handleSearch(searchQuery)}
                >
                  Search
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12">
        {/* Filters Bar */}
        <div className="bg-card rounded-2xl border border-border shadow-xl p-4 lg:p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Filter Dropdowns */}
            <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-3">
              <Select value={activeFilters.category} onValueChange={(v) => handleFilterChange("category", v)}>
                <SelectTrigger className="w-full">
                  <Briefcase className="w-4 h-4 mr-2 text-muted-foreground" />
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={activeFilters.type} onValueChange={(v) => handleFilterChange("type", v)}>
                <SelectTrigger className="w-full">
                  <Clock className="w-4 h-4 mr-2 text-muted-foreground" />
                  <SelectValue placeholder="Job Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {jobTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={activeFilters.location} onValueChange={(v) => handleFilterChange("location", v)}>
                <SelectTrigger className="w-full">
                  <MapPin className="w-4 h-4 mr-2 text-muted-foreground" />
                  <SelectValue placeholder="Location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  {locations.map((loc) => (
                    <SelectItem key={loc.value} value={loc.value}>{loc.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={activeFilters.experience} onValueChange={(v) => handleFilterChange("experience", v)}>
                <SelectTrigger className="w-full">
                  <Building2 className="w-4 h-4 mr-2 text-muted-foreground" />
                  <SelectValue placeholder="Experience" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  {experienceLevels.map((exp) => (
                    <SelectItem key={exp.value} value={exp.value}>{exp.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Sort & Clear */}
            <div className="flex items-center gap-3">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[160px]">
                  <SlidersHorizontal className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  {sortOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {activeFilterCount > 0 && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleClearFilters}
                  className="whitespace-nowrap"
                >
                  <X className="w-4 h-4 mr-1" />
                  Clear ({activeFilterCount})
                </Button>
              )}
            </div>
          </div>

          {/* Active Filters Display */}
          {activeFilterCount > 0 && (
            <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-border">
              <span className="text-sm text-muted-foreground">Active filters:</span>
              {Object.entries(activeFilters).map(([key, value]) => {
                if (value === "all") return null;
                const filterDef = filters.find(f => f.key === key);
                const optionLabel = filterDef?.options.find(o => o.value === value)?.label || value;
                return (
                  <Badge 
                    key={key} 
                    variant="secondary"
                    className="cursor-pointer hover:bg-destructive/10"
                    onClick={() => handleFilterChange(key, "all")}
                  >
                    {filterDef?.label}: {optionLabel}
                    <X className="w-3 h-3 ml-1" />
                  </Badge>
                );
              })}
            </div>
          )}
        </div>

        {/* Results Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-semibold">
              {isLoading ? (
                <span className="text-muted-foreground">Loading jobs...</span>
              ) : (
                <>
                  {data?.pagination?.total?.toLocaleString() || 0} Jobs
                  {searchQuery && <span className="text-muted-foreground text-lg font-normal ml-2">for &quot;{searchQuery}&quot;</span>}
                </>
              )}
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground hidden sm:inline">View:</span>
            <Button variant="outline" size="icon" className="h-8 w-8">
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="text-center py-16 bg-card rounded-2xl border border-border">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <X className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Failed to load jobs</h3>
            <p className="text-muted-foreground mb-4">Please try again later</p>
            <Button onClick={() => window.location.reload()}>Retry</Button>
          </div>
        )}

        {/* Jobs Grid */}
        {!error && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {isLoading
                ? Array.from({ length: 12 }).map((_, i) => <SkeletonCard key={i} />)
                : data?.jobs?.map((job) => <JobCard key={job.id} job={job} />)
              }
            </div>

            {/* Empty State */}
            {!isLoading && data?.jobs?.length === 0 && (
              <div className="text-center py-16 bg-card rounded-2xl border border-border">
                <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                  <Search className="w-10 h-10 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-2">No jobs found</h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  Try adjusting your search or filters to find what you&apos;re looking for
                </p>
                <div className="flex gap-3 justify-center">
                  <Button variant="outline" onClick={handleClearFilters}>
                    Clear All Filters
                  </Button>
                  <Button asChild className="bg-gradient-to-r from-blue-600 to-violet-600">
                    <Link href="/">Browse Featured Jobs</Link>
                  </Button>
                </div>
              </div>
            )}

            {/* Pagination */}
            {!isLoading && data?.pagination && data.pagination.totalPages > 1 && (
              <div className="mt-10">
                <Pagination
                  currentPage={currentPage}
                  totalPages={data.pagination.totalPages}
                  onPageChange={handlePageChange}
                />
                <p className="text-center text-sm text-muted-foreground mt-4">
                  Showing {(currentPage - 1) * 12 + 1} - {Math.min(currentPage * 12, data.pagination.total)} of {data.pagination.total.toLocaleString()} jobs
                </p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Bottom spacing */}
      <div className="h-20"></div>
    </div>
  );
}
