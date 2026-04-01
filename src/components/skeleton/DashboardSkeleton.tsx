import { Skeleton } from "./Skeleton";

export function DashboardSkeleton() {
  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between">
        <div className="space-y-3">
          <Skeleton className="h-10 w-[250px] rounded-2xl" />
          <Skeleton className="h-4 w-[180px] opacity-60" />
        </div>
        <Skeleton className="h-12 w-12 rounded-full premium-ring" />
      </div>

      {/* Grid de Stats com suas classes utilitárias */}
      <div className="grid gap-6 md:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="stat-card border-none">
            <Skeleton className="h-4 w-24 opacity-50" />
            <Skeleton className="h-10 w-32 mt-2" />
            <Skeleton className="h-3 w-40 mt-4 opacity-30" />
          </div>
        ))}
      </div>

      {/* Grande Glass Card Skeleton */}
      <div className="glass-card p-8 border-none min-h-[400px]">
        <div className="flex gap-6 mb-8">
          <Skeleton className="h-12 w-12 rounded-xl" />
          <div className="space-y-2">
            <Skeleton className="h-6 w-[300px]" />
            <Skeleton className="h-4 w-[200px] opacity-40" />
          </div>
        </div>
        
        <div className="space-y-4">
          <Skeleton className="h-[200px] w-full rounded-2xl opacity-20" />
          <div className="flex gap-4">
             <Skeleton className="h-10 w-full" />
             <Skeleton className="h-10 w-full" />
          </div>
        </div>
      </div>
    </div>
  )
}