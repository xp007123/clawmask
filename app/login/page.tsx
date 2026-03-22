import { Suspense } from "react"

import { AuthShell } from "@/components/auth-shell"
import { LoginForm } from "@/components/login-form"
import { Skeleton } from "@/components/ui/skeleton"

export default function LoginPage() {
  return (
    <AuthShell>
      <Suspense fallback={<LoginFormSkeleton />}>
        <LoginForm />
      </Suspense>
    </AuthShell>
  )
}

function LoginFormSkeleton() {
  return (
    <div className="w-full max-w-sm space-y-6 rounded-3xl border border-border/60 bg-card/40 p-8 shadow-sm">
      <div className="space-y-3">
        <Skeleton className="h-8 w-28 rounded-md" />
        <Skeleton className="h-4 w-56 rounded-md" />
      </div>
      <div className="space-y-4">
        <Skeleton className="h-12 w-full rounded-xl" />
        <Skeleton className="h-12 w-full rounded-xl" />
        <Skeleton className="h-12 w-full rounded-xl" />
        <Skeleton className="h-12 w-full rounded-xl" />
      </div>
      <Skeleton className="h-12 w-full rounded-xl" />
    </div>
  )
}
