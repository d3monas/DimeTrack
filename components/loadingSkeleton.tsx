import { Skeleton } from "./ui/skeleton"

export function LoadingSkeleton() {
    return (
        <div className="mx-auto max-w-6xl p-4 sm:p-6">
            <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <Skeleton className="h-9 w-40" />
                <div className="flex items-center gap-2">
                    <Skeleton className="h-8 w-7" />
                    <Skeleton className="h-7 w-20" />
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3 sm:gap-6">
                {[1,2,3].map((i) => (
                    <div key={i} className="rounded-2xl border p-4 sm:p-6">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="mt-3 h-8 w-24" />
                    </div>
                ))}
            </div>

            <div className="mt-6 rounded-2xl border p-4 sm:p-6">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <Skeleton className="h-6 w-32" />
                        <Skeleton className="mt-2 h-4 w-24" />
                    </div>
                    <Skeleton className="h-7 w-40" />
                </div>
                <Skeleton className="mt-4 h-3 w-full rounded-full" />
                <Skeleton className="mt-2 h-4 w-32" />
            </div>

            <div className="mt-6 flex justify-end">
                <Skeleton className="h-8 w-36" />
            </div>

            <div className="mt-6 rounded-2xl border p-4 sm:p-6">
                <Skeleton className="h-6 w-40" />
                <div className="mt-4 space-y-4">
                    {[1,2,3].map((i) => (
                        <div key={i} className="flex items-center justify-between border pb-3 last:border-0">
                        <div>
                            <Skeleton className="h-4 w-32" />
                            <Skeleton className="mt-2 h-3 w-24" />
                        </div>
                        <Skeleton className="h-4 w-16" />
                    </div>
                    ))}
                </div>
            </div>

            <div className="mt-6 rounded-2xl border p-4 sm:p-6">
                <Skeleton className="h-6 w-44" />
                <div className="mt-4 space-y-3">
                    {[1,2,3].map((i) => (
                        <div key={i} className="flex justify-between">
                            <Skeleton className="h-4 w-28" />
                            <Skeleton className="h-4 w-16" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}