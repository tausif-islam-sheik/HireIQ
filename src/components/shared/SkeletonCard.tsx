import { Skeleton } from "@/components/ui/skeleton";

export function SkeletonCard() {
  return (
    <div className="bg-card rounded-2xl border border-border p-4 h-[260px] flex flex-col">
      {/* Header */}
      <div className="flex items-start gap-3 mb-4">
        <Skeleton className="w-11 h-11 rounded-xl flex-shrink-0" />
        <div className="flex-1 space-y-2 min-w-0 pr-1">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-3 w-20" />
        </div>
        <Skeleton className="w-7 h-7 rounded-lg flex-shrink-0" />
      </div>

      {/* Details */}
      <div className="space-y-1.5 mb-3 flex-shrink-0">
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-2/3" />
        <Skeleton className="h-3 w-1/2" />
      </div>

      {/* Skills */}
      <div className="flex gap-1.5 mb-3 min-h-[22px]">
        <Skeleton className="h-[18px] w-14 rounded-full" />
        <Skeleton className="h-[18px] w-14 rounded-full" />
        <Skeleton className="h-[18px] w-14 rounded-full" />
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-border/50 mt-auto">
        <Skeleton className="h-[18px] w-16 rounded-md" />
        <Skeleton className="h-6 w-20 rounded-lg" />
      </div>
    </div>
  );
}
