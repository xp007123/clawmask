import dynamic from "next/dynamic"

import { DashboardPageSkeleton } from "@/components/dashboard-page-skeleton"

const WalletDashboard = dynamic(
  () =>
    import("@/components/wallet-dashboard").then((module) => module.WalletDashboard),
  {
    loading: () => <DashboardPageSkeleton variant="wallet" />,
  }
)

export default function WalletPage() {
  return <WalletDashboard />
}
