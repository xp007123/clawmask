import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

type DashboardSkeletonVariant = "home" | "agent" | "wallet" | "settings"

function HeaderSkeleton() {
  return (
    <div className="flex h-(--header-height) items-center gap-2 border-b px-4 lg:px-6">
      <Skeleton className="h-8 w-28 rounded-md" />
      <Skeleton className="ml-auto h-8 w-24 rounded-full" />
    </div>
  )
}

export function DashboardPageSkeleton({
  variant,
}: {
  variant: DashboardSkeletonVariant
}) {
  return (
    <div className="flex min-h-[calc(100vh-var(--header-height))] flex-col">
      <HeaderSkeleton />
      <div className="flex flex-1 flex-col gap-4 py-4 md:gap-6 md:py-6">
        {variant === "home" ? <HomeSkeleton /> : null}
        {variant === "agent" ? <AgentSkeleton /> : null}
        {variant === "wallet" ? <WalletSkeleton /> : null}
        {variant === "settings" ? <SettingsSkeleton /> : null}
      </div>
    </div>
  )
}

function HomeSkeleton() {
  return (
    <>
      <div className="grid gap-4 px-4 lg:px-6 xl:grid-cols-[minmax(0,1fr)_480px]">
        <div className="space-y-4 md:space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} className="h-28 rounded-2xl" />
            ))}
          </div>
          <Skeleton className="h-[420px] rounded-2xl" />
          <Skeleton className="h-[360px] rounded-2xl" />
        </div>
        <div className="space-y-4">
          <Skeleton className="h-[520px] rounded-2xl" />
          <Skeleton className="h-[420px] rounded-2xl" />
        </div>
      </div>
    </>
  )
}

function AgentSkeleton() {
  return (
    <div className="space-y-4 px-4 lg:px-6">
      <div className="flex flex-wrap gap-3">
        <Skeleton className="h-10 w-32 rounded-full" />
        <Skeleton className="h-10 w-32 rounded-full" />
      </div>
      <Skeleton className="h-[220px] rounded-2xl" />
      <div className="grid gap-4 lg:grid-cols-2">
        <Skeleton className="h-[320px] rounded-2xl" />
        <Skeleton className="h-[320px] rounded-2xl" />
      </div>
      <Skeleton className="h-[280px] rounded-2xl" />
    </div>
  )
}

function WalletSkeleton() {
  return (
    <div className="space-y-4 px-4 lg:px-6">
      <Skeleton className="h-[180px] rounded-2xl" />
      <div className="grid gap-4 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <Skeleton key={index} className="h-[140px] rounded-2xl" />
        ))}
      </div>
      <Skeleton className="h-12 w-72 rounded-lg" />
      <Skeleton className="h-[420px] rounded-2xl" />
    </div>
  )
}

function SettingsSkeleton() {
  return (
    <div className="space-y-4 px-4 lg:px-6">
      <Skeleton className="h-16 w-full rounded-2xl" />
      <Skeleton className="h-12 w-64 rounded-lg" />
      <div className="space-y-4">
        {Array.from({ length: 2 }).map((_, index) => (
          <Skeleton key={index} className={cn("h-[220px] rounded-2xl")} />
        ))}
      </div>
    </div>
  )
}
