import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function ProductsLoadingState() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Skeleton className="h-7 w-48" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-10 w-[180px]" />
        </div>
      </div>
      
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="flex h-full flex-col overflow-hidden">
            {/* Stable image region skeleton */}
            <Skeleton className="aspect-square w-full flex-shrink-0" />
            
            {/* Flexible content region skeleton with consistent spacing */}
            <CardHeader className="flex-grow space-y-2 p-4">
              <Skeleton className="h-5 w-4/5" />
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="mt-2 h-4 w-full" />
              <Skeleton className="mt-1.5 h-4 w-full" />
              <Skeleton className="mt-1.5 h-4 w-2/3" />
            </CardHeader>
            
            {/* Stable footer region skeleton with consistent padding */}
            <CardContent className="flex-shrink-0 px-4 pb-4 pt-0">
              <div className="flex items-center justify-between gap-3">
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-6 w-20" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
