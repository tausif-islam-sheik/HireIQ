"use client";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Filter, X } from "lucide-react";

interface FilterOption {
  value: string;
  label: string;
}

interface FilterConfig {
  key: string;
  label: string;
  options: FilterOption[];
}

interface FilterPanelProps {
  filters: FilterConfig[];
  activeFilters: Record<string, string>;
  onFilterChange: (key: string, value: string) => void;
  onClearFilters: () => void;
}

export function FilterPanel({
  filters,
  activeFilters,
  onFilterChange,
  onClearFilters,
}: FilterPanelProps) {
  const hasActiveFilters = Object.values(activeFilters).some(
    (value: string) => value && value !== "all"
  );

  return (
    <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-3">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Filter className="h-4 w-4" />
        <span>Filters:</span>
      </div>

      {filters.map((filter) => (
        <Select
          key={filter.key}
          value={activeFilters[filter.key] || "all"}
          onValueChange={(value: string) => onFilterChange(filter.key, value)}
        >
          <SelectTrigger className="w-full sm:w-[140px] h-9">
            <SelectValue placeholder={filter.label} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{filter.label}</SelectItem>
            {filter.options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ))}

      {hasActiveFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearFilters}
          className="h-9"
        >
          <X className="h-4 w-4 mr-1" />
          Clear
        </Button>
      )}
    </div>
  );
}
