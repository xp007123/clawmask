import dynamic from "next/dynamic"

import { DashboardPageSkeleton } from "@/components/dashboard-page-skeleton"

const SettingsDashboard = dynamic(
  () =>
    import("@/components/settings-dashboard").then(
      (module) => module.SettingsDashboard
    ),
  {
    loading: () => <DashboardPageSkeleton variant="settings" />,
  }
)

export default function SettingsPage() {
  return <SettingsDashboard />
}
