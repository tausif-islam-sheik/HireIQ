import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function SkeletonCard() {
  return (
    <Card className="h-[320px] flex flex-col">
      <CardContent className="flex-1 p-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <Skeleton className="w-12 h-12 rounded-xl" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-24" />
            </div>
          </div>
          <Skeleton className="w-8 h-8 rounded-lg" />
        </div>

        {/* Details */}
        <div className="space-y-2 mb-4">
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
        </div>

        {/* Skills */}
        <div className="flex gap-1.5">
          <Skeleton className="h-5 w-16 rounded-full" />
          <Skeleton className="h-5 w-16 rounded-full" />
          <Skeleton className="h-5 w-16 rounded-full" />
        </div>
      </CardContent>

      <CardFooter className="p-5 pt-0 mt-auto">
        <div className="flex items-center justify-between w-full gap-3">
          <Skeleton className="h-5 w-20 rounded-full" />
          <Skeleton className="h-8 w-24 rounded-lg" />
        </div>
      </CardFooter>
    </Card>
  );
}
