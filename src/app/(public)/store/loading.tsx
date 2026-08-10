import { Filter } from 'lucide-react';

export default function StoreLoading() {
  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 animate-pulse">
        
        {/* Header Skeleton */}
        <div className="flex flex-col items-center justify-center text-center mb-12 space-y-4">
          <div className="h-10 md:h-12 w-64 bg-gray-200 rounded-lg"></div>
          <div className="h-5 md:h-6 w-full max-w-xl bg-gray-200 rounded-lg"></div>
          <div className="h-5 md:h-6 w-3/4 max-w-lg bg-gray-200 rounded-lg"></div>
        </div>

        {/* Filter Bar Skeleton */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div className="flex items-center gap-2 overflow-x-auto w-full pb-2 md:pb-0 scrollbar-hide">
            <Filter className="w-5 h-5 text-gray-300 mr-2 shrink-0" />
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-9 w-24 bg-gray-200 rounded-full shrink-0"></div>
            ))}
          </div>
          <div className="h-5 w-32 bg-gray-200 rounded shrink-0"></div>
        </div>

        {/* Product Grid Skeleton */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 flex flex-col h-full">
              {/* Product Image Skeleton */}
              <div className="relative aspect-[4/5] bg-gray-200"></div>

              {/* Product Details Skeleton */}
              <div className="p-4 flex flex-col flex-1 space-y-3">
                {/* Rating */}
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 bg-gray-200 rounded-full"></div>
                  <div className="h-3 w-12 bg-gray-200 rounded"></div>
                </div>
                
                {/* Title */}
                <div className="space-y-2">
                  <div className="h-4 w-full bg-gray-200 rounded"></div>
                  <div className="h-4 w-2/3 bg-gray-200 rounded"></div>
                </div>
                
                {/* Tags */}
                <div className="flex items-center gap-2 mt-auto pt-2">
                  <div className="h-5 w-16 bg-gray-200 rounded"></div>
                  <div className="h-5 w-12 bg-gray-200 rounded"></div>
                </div>
                
                {/* Footer (Price & Button) */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-2 border-t border-gray-50 pt-3">
                  <div className="h-5 md:h-6 w-20 bg-gray-200 rounded"></div>
                  <div className="h-8 md:h-9 w-full sm:w-20 bg-gray-200 rounded-xl"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
