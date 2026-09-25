import React from "react";

export function SkeletonBlock({ className = "" }) {
  return (
    <div
      className={`animate-pulse rounded-xl2 bg-gray-200/70 dark:bg-white/5 ${className}`}
    />
  );
}

export function TableRowSkeleton({ columns = 5 }) {
  return (
    <tr>
      {Array.from({ length: columns }).map((_, i) => (
        <td key={i} className="px-4 py-4">
          <SkeletonBlock className="h-4 w-full" />
        </td>
      ))}
    </tr>
  );
}

export function StatCardSkeleton() {
  return (
    <div className="surface-card p-5 space-y-4">
      <SkeletonBlock className="h-10 w-10 rounded-xl2" />
      <SkeletonBlock className="h-6 w-20" />
      <SkeletonBlock className="h-4 w-28" />
    </div>
  );
}
