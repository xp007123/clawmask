import dynamic from "next/dynamic"

import { DashboardPageSkeleton } from "@/components/dashboard-page-skeleton"

const HomeDashboard = dynamic(
  () => import("@/components/home-dashboard").then((module) => module.HomeDashboard),
  {
    loading: () => <DashboardPageSkeleton variant="home" />,
  }
)

export default function HomePage() {
  return <HomeDashboard />
}
