import { Skeleton } from "./skeleton";

export default function Loading() {
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar Skeleton */}
      <div className="hidden md:flex md:w-64 md:flex-col fixed inset-y-0 z-50">
        <div className="flex-1 flex flex-col min-h-0 bg-gray-900 border-r border-gray-800">
           <div className="flex items-center h-16 flex-shrink-0 px-4 bg-gray-900">
              <Skeleton className="h-8 w-32 bg-gray-800" />
           </div>
           <div className="flex-1 flex flex-col overflow-y-auto pt-5 pb-4 px-2 space-y-3">
               {[1, 2, 3, 4, 5, 6].map((i) => (
                   <Skeleton key={i} className="h-10 w-full bg-gray-800 rounded-md" />
               ))}
           </div>
        </div>
      </div>

      {/* Main Content Skeleton */}
      <div className="flex flex-col flex-1 md:pl-64">
        <div className="sticky top-0 z-10 flex-shrink-0 flex h-16 bg-white shadow-sm border-b border-gray-200 px-8 items-center justify-between">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-8 w-8 rounded-full" />
        </div>

        <main className="flex-1 py-8 px-8">
             <div className="mb-8 flex items-center justify-between">
                <div>
                    <Skeleton className="h-8 w-64 mb-2" />
                    <Skeleton className="h-4 w-96" />
                </div>
                <Skeleton className="h-10 w-32" />
             </div>

             {/* Cards Grid */}
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {[1, 2, 3, 4].map((i) => (
                    <Skeleton key={i} className="h-32 rounded-xl" />
                ))}
             </div>

             <Skeleton className="h-96 rounded-xl w-full" />
        </main>
      </div>
    </div>
  );
}
