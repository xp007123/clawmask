import dynamic from "next/dynamic"
import { notFound } from "next/navigation"

import { DashboardPageSkeleton } from "@/components/dashboard-page-skeleton"
import { agentChannels, agentConfigs, type AgentChannel } from "@/lib/mock-data"

const AgentDashboard = dynamic(
  () => import("@/components/agent-dashboard").then((module) => module.AgentDashboard),
  {
    loading: () => <DashboardPageSkeleton variant="agent" />,
  }
)

export function generateStaticParams() {
  return agentChannels.map((channel) => ({ channel }))
}

export default async function AgentPage({
  params,
}: {
  params: Promise<{ channel: string }>
}) {
  const { channel } = await params
  if (!agentChannels.includes(channel as AgentChannel)) {
    notFound()
  }

  return (
    <AgentDashboard
      channel={channel as AgentChannel}
      config={agentConfigs[channel as AgentChannel]}
    />
  )
}
