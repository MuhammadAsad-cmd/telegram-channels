"use client";

export function Skeleton({ className = "", ...props }) {
  return (
    <div
      className={`animate-pulse bg-gray-300 dark:bg-white/10 rounded ${className}`}
      {...props}
    />
  );
}

export function FormSkeleton() {
  return (
    <div className="space-y-5">
      {[1, 2, 3, 4].map((i) => (
        <div key={i}>
          <Skeleton className="h-4 w-24 mb-2" />
          <Skeleton className="h-12 w-full" />
        </div>
      ))}
      <Skeleton className="h-11 w-full mt-4" />
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="space-y-4 p-6">
      <Skeleton className="h-6 w-3/4" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-1/2" />
    </div>
  );
}

export function ProfileSkeleton() {
  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center gap-4">
        <Skeleton className="h-20 w-20 rounded-full shrink-0" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-5 w-48" />
          <Skeleton className="h-4 w-32" />
        </div>
      </div>
      <div className="space-y-5">
        {[1, 2, 3, 4].map((i) => (
          <div key={i}>
            <Skeleton className="h-4 w-24 mb-2" />
            <Skeleton className="h-12 w-full" />
          </div>
        ))}
      </div>
      <Skeleton className="h-11 w-32" />
    </div>
  );
}

export function ChannelDetailsSkeleton() {
  return (
    <div className="min-h-screen bg-[#e5ebef]">
      <div className="bg-white border-b border-gray-200 py-3">
        <div className="max-w-[1344px] mx-auto px-4 md:px-8">
          <Skeleton className="h-5 w-64" />
        </div>
      </div>
      <div className="max-w-[1344px] mx-auto px-4 md:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="lg:w-80 shrink-0">
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <Skeleton className="w-44 h-44 mx-auto rounded-xl" />
              <Skeleton className="h-12 w-full mt-6" />
              <div className="mt-6 space-y-3 pt-4 border-t border-gray-100">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-3 w-28" />
              </div>
            </div>
          </aside>
          <div className="flex-1 min-w-0 space-y-6">
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <Skeleton className="h-10 w-3/4" />
              <Skeleton className="h-4 w-32 mt-2" />
              <div className="mt-4 space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
                  <Skeleton className="h-5 w-5 mb-2" />
                  <Skeleton className="h-3 w-16 mb-1" />
                  <Skeleton className="h-6 w-12" />
                </div>
              ))}
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <Skeleton className="h-6 w-28 mb-1" />
              <Skeleton className="h-4 w-24 mb-4" />
              <Skeleton className="h-24 w-full rounded-lg" />
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <Skeleton className="h-6 w-40 mb-4" />
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                  <div key={i} className="flex flex-col items-center p-4">
                    <Skeleton className="w-14 h-14 rounded-full" />
                    <Skeleton className="h-4 w-full mt-2" />
                    <Skeleton className="h-3 w-12 mt-1" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function MediaTableSkeleton({ rows = 5 }) {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
      <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
        <div className="flex gap-8">
          <Skeleton className="h-4 w-14" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-8" />
          <Skeleton className="h-4 w-8" />
        </div>
      </div>
      <div className="divide-y divide-gray-200">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex items-center gap-6 px-6 py-4">
            <Skeleton className="w-12 h-12 rounded-full shrink-0" />
            <div className="flex-1 space-y-1 min-w-0">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-48" />
            </div>
            <div className="space-y-1 shrink-0">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-3 w-20" />
            </div>
            <Skeleton className="h-8 w-20 rounded shrink-0" />
          </div>
        ))}
      </div>
    </div>
  );
}
