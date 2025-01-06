import { Skeleton } from "@/components/ui/skeleton";

export function NavSkeleton() {
  return (
    <div className="flex items-center space-x-4">
      <Skeleton className="h-8 w-[100px]" />
      <Skeleton className="h-8 w-[100px]" />
      <Skeleton className="h-8 w-[100px]" />
    </div>
  );
}
