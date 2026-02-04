import React from 'react';

interface SkeletonProps {
    className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
    return (
        <div className={`animate-pulse bg-gray-200 rounded ${className}`} />
    );
}

export function TableSkeleton({ rows = 5, columns = 5 }: { rows?: number; columns?: number }) {
    return (
        <div className="w-full">
            <div className="flex gap-4 mb-4">
                {[...Array(columns)].map((_, i) => (
                    <Skeleton key={`head-${i}`} className="h-4 flex-1" />
                ))}
            </div>
            <div className="space-y-4">
                {[...Array(rows)].map((_, i) => (
                    <div key={`row-${i}`} className="flex gap-4">
                        {[...Array(columns)].map((_, j) => (
                            <Skeleton key={`cell-${i}-${j}`} className="h-10 flex-1" />
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
}
