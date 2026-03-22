"use client"

import * as React from "react"
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts"
import {
  ArrowLeftIcon,
  BotIcon,
  CoinsIcon,
  FlagIcon,
  TrendingUpIcon,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  announcements,
  currentUserPosition,
  homeChartData,
  homeMetrics,
  homeTrades,
  extendedLeaderboard,
  leaderboard,
  type Announcement,
  type AnnouncementItem,
} from "@/lib/mock-data"
import { cn } from "@/lib/utils"
import { useLocale } from "@/components/locale-provider"

const chartConfig = {
  income: {
    label: "收益金额",
    color: "var(--chart-2)",
  },
  volume: {
    label: "交易数量",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig

const metricIcons = [
  {
    icon: FlagIcon,
    className: "bg-muted text-foreground dark:text-white",
  },
  {
    icon: TrendingUpIcon,
    className: "bg-muted text-foreground dark:text-white",
  },
  {
    icon: BotIcon,
    className: "bg-muted text-foreground dark:text-white",
  },
  {
    icon: CoinsIcon,
    className: "bg-muted text-foreground dark:text-white",
  },
] as const

const rankBadgeClassNames = [
  "bg-[#ffd036] text-[#333333]",
  "bg-[#e5e5e5] text-[#272727]",
  "bg-[#905e3d] text-[#000000]",
  "bg-muted text-foreground",
  "bg-muted text-foreground",
  "bg-muted text-foreground",
  "bg-muted text-foreground",
  "bg-muted text-foreground",
  "bg-muted text-foreground",
  "bg-muted text-foreground",
] as const

export function HomeDashboard() {
  const { t, locale } = useLocale()

  const tradeTypeMap: Record<string, string> = {
    "买入": t.trade.type.buy,
    "卖出": t.trade.type.sell,
    "平仓": t.trade.type.close,
  }

  const tradeSkillMap: Record<string, string> = {
    "币安智能体 Skill": t.trade.skill.binance,
    "欧易智能体 Skill": t.trade.skill.okx,
    "MADEX 智能体 Skill": t.trade.skill.madex,
  }

  const [isLeaderboardOpen, setIsLeaderboardOpen] = React.useState(false)
  const [isTradesOpen, setIsTradesOpen] = React.useState(false)
  const [isAnnouncementsOpen, setIsAnnouncementsOpen] = React.useState(false)
  const [selectedAnnouncement, setSelectedAnnouncement] = React.useState<Announcement | null>(null)
  const [selectedItem, setSelectedItem] = React.useState<AnnouncementItem | null>(null)
  const [chartHeight, setChartHeight] = React.useState<number | null>(null)
  const leaderboardSectionRef = React.useRef<HTMLElement | null>(null)
  const metricsGridRef = React.useRef<HTMLDivElement | null>(null)
  const chartHeaderRef = React.useRef<HTMLDivElement | null>(null)

  React.useEffect(() => {
    const leaderboardElement = leaderboardSectionRef.current
    const metricsElement = metricsGridRef.current
    const chartHeaderElement = chartHeaderRef.current

    if (
      !leaderboardElement ||
      !metricsElement ||
      !chartHeaderElement ||
      typeof window === "undefined"
    ) {
      return
    }

    const mediaQuery = window.matchMedia("(min-width: 1280px)")

    const updateHeight = () => {
      if (!mediaQuery.matches) {
        setChartHeight(null)
        return
      }

      const nextHeight =
        leaderboardElement.offsetHeight -
        metricsElement.offsetHeight -
        24 -
        chartHeaderElement.offsetHeight -
        12

      setChartHeight(Math.max(0, nextHeight))
    }

    updateHeight()

    const resizeObserver = new ResizeObserver(() => {
      updateHeight()
    })

    resizeObserver.observe(leaderboardElement)
    resizeObserver.observe(metricsElement)
    resizeObserver.observe(chartHeaderElement)
    mediaQuery.addEventListener("change", updateHeight)
    window.addEventListener("resize", updateHeight)

    return () => {
      resizeObserver.disconnect()
      mediaQuery.removeEventListener("change", updateHeight)
      window.removeEventListener("resize", updateHeight)
    }
  }, [])

  const metricCards = homeMetrics.map((metric, index) => {
    const metricIcon = metricIcons[index]
    const Icon = metricIcon?.icon ?? TrendingUpIcon
    const metricTitles = [
      t.home.yesterdayTradeCount,
      t.home.yesterdayRevenue,
      t.home.agentCount,
      t.home.totalRevenue,
    ]

    return {
      ...metric,
      title: metricTitles[index] ?? metric.title,
      icon: <Icon className="size-3.5" />,
      iconClassName: metricIcon?.className ?? "",
    }
  })

  return (
    <div className="flex flex-1 flex-col">
      <div className="dark:bg-white/5 bg-white/60 backdrop-blur-3xl rounded-2xl md:rounded-[32px] border dark:border-white/10 border-white/80 min-h-full p-4 md:p-8 dark:shadow-none card-glow">
      <div className="@container/main flex flex-1 flex-col gap-4 py-4 md:gap-6 md:py-6">
        <div className="grid gap-4 px-4 lg:px-6 xl:min-h-0 xl:flex-1 xl:grid-cols-[minmax(0,1fr)_480px] xl:grid-rows-[auto_minmax(0,1fr)]">
          <div className="min-w-0 space-y-4 md:space-y-6 xl:col-start-1 xl:row-start-1 xl:space-y-0 xl:space-x-0">
            <div
              ref={metricsGridRef}
              className="grid grid-cols-1 gap-4 sm:grid-cols-2"
            >
              {metricCards.map((metric, index) => (
                <div key={metric.title} className="dark:bg-black/40 dark:border dark:border-white/10 bg-white/80 border border-slate-200/60 rounded-2xl p-5 card-glow">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-[var(--cm-primary)]/10 border border-[var(--cm-primary)]/30 text-[var(--cm-primary)] dark:neon-border accent-glow">
                      {metric.icon}
                    </div>
                    <h3 className="text-sm md:text-base font-bold dark:text-white text-slate-800 tracking-tight">
                      {metric.title}
                    </h3>
                  </div>
                  <div className="flex items-end justify-between gap-4">
                    <div className="text-2xl font-semibold tracking-tight dark:text-white text-slate-800 font-mono">
                      {metric.value}
                    </div>
                    <div className="pb-1 text-sm font-medium text-[var(--cm-danger)]">
                      {metric.delta}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <section className="mt-4 space-y-3 md:mt-6 xl:mt-6">
              <div ref={chartHeaderRef} className="px-1">
                <h2 className="text-lg font-semibold tracking-tight dark:text-white text-slate-800">{t.home.revenue}</h2>
              </div>
              <div
                className="dark:bg-black/40 dark:border dark:border-white/10 bg-white/80 border border-slate-200/60 rounded-2xl p-4 card-glow py-0"
                style={
                  chartHeight
                    ? ({ height: `${chartHeight}px` } as React.CSSProperties)
                    : undefined
                }
              >
                <div className="px-4 py-4 sm:px-5 sm:py-5 xl:flex xl:h-full xl:min-h-0 xl:flex-col">
                  <ChartContainer
                    config={chartConfig}
                    className="h-[360px] min-h-[360px] w-full xl:h-full xl:min-h-0 [&_.recharts-cartesian-grid-horizontal_line]:stroke-border/40 [&_.recharts-curve.recharts-line-curve]:drop-shadow-none"
                  >
                    <LineChart
                      data={homeChartData}
                      margin={{ top: 12, right: 12, left: 4, bottom: 0 }}
                    >
                      <CartesianGrid vertical={false} />
                      <XAxis
                        dataKey="date"
                        tickLine={false}
                        axisLine={false}
                        tickMargin={14}
                        tickFormatter={(value) =>
                          new Date(value).toLocaleDateString(locale, {
                            month: "2-digit",
                            day: "2-digit",
                          })
                        }
                      />
                      <YAxis
                        yAxisId="left"
                        domain={[0, 100]}
                        tickCount={6}
                        tickLine={false}
                        axisLine={false}
                        width={34}
                      />
                      <YAxis
                        yAxisId="right"
                        orientation="right"
                        domain={[0, 100]}
                        tickCount={6}
                        tickLine={false}
                        axisLine={false}
                        width={34}
                      />
                      <ChartTooltip
                        cursor={false}
                        content={
                          <ChartTooltipContent
                            indicator="line"
                            labelFormatter={(value) =>
                              new Date(value).toLocaleDateString(locale, {
                                month: "long",
                                day: "numeric",
                              })
                            }
                            formatter={(value, name) => (
                              <div className="flex min-w-28 items-center justify-between gap-3">
                                <span className="text-muted-foreground">
                                  {name}
                                </span>
                                <span className="font-medium">{value}</span>
                              </div>
                            )}
                          />
                        }
                      />
                      <Line
                        yAxisId="left"
                        type="monotone"
                        dataKey="income"
                        stroke="var(--color-income)"
                        strokeWidth={2.5}
                        dot={{
                          r: 4,
                          fill: "var(--background)",
                          stroke: "var(--color-income)",
                          strokeWidth: 2,
                        }}
                        activeDot={{
                          r: 5,
                          fill: "var(--background)",
                          stroke: "var(--color-income)",
                          strokeWidth: 2,
                        }}
                      />
                      <Line
                        yAxisId="right"
                        type="monotone"
                        dataKey="volume"
                        stroke="var(--color-volume)"
                        strokeWidth={2.5}
                        dot={{
                          r: 4,
                          fill: "var(--background)",
                          stroke: "var(--color-volume)",
                          strokeWidth: 2,
                        }}
                        activeDot={{
                          r: 5,
                          fill: "var(--background)",
                          stroke: "var(--color-volume)",
                          strokeWidth: 2,
                        }}
                      />
                    </LineChart>
                  </ChartContainer>
                </div>
              </div>
            </section>

          </div>

          <section
            ref={leaderboardSectionRef}
            className="space-y-3 xl:col-start-2 xl:row-start-1 xl:self-start"
          >
            <div className="flex items-center justify-between gap-3 px-1">
              <h2 className="text-lg font-semibold tracking-tight dark:text-white text-slate-800">
                {t.home.revenueLeaderboard}
              </h2>
              <Button
                variant="ghost"
                size="sm"
                className="dark:text-white/40 text-slate-400 hover:text-[var(--cm-primary)] text-xs transition-colors"
                onClick={() => setIsLeaderboardOpen(true)}
              >
                {t.home.viewDetails}
              </Button>
            </div>
            <div className="dark:bg-black/40 dark:border dark:border-white/10 bg-white/80 border border-slate-200/60 rounded-2xl p-4 card-glow">
              <div className="space-y-3">
                {leaderboard.slice(0, 6).map((entry, index) => (
                  <div
                    key={entry.rank}
                    className="flex items-center gap-3 rounded-xl border-b dark:border-white/5 border-slate-100 last:border-0 px-2 py-4 hover:bg-[var(--cm-primary)]/5 transition-colors"
                  >
                    <div
                      className={cn(
                        "flex size-10 shrink-0 items-center justify-center rounded-full text-sm font-medium",
                        rankBadgeClassNames[index] ?? "bg-muted text-foreground"
                      )}
                    >
                      {entry.rank}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-base font-medium dark:text-white/80 text-slate-600">
                        {entry.name}
                      </div>
                      <div className="mt-1 text-sm dark:text-white/30 text-slate-400">
                        {t.home.cumulativeDuration}{entry.runtime} {t.home.roiLabel}{entry.roi}
                      </div>
                    </div>
                    <div className="shrink-0 text-right">
                      <div className="text-base font-semibold dark:text-white/80 text-slate-600 font-mono">
                        {entry.income}
                      </div>
                      <div className="mt-1 text-sm dark:text-white/30 text-slate-400">
                        {t.home.monthlyRevenue}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="space-y-3 xl:col-start-1 xl:row-start-2 xl:flex xl:min-h-0 xl:flex-col">
              <div className="flex items-center justify-between gap-3 px-1">
                <h2 className="text-lg font-semibold tracking-tight dark:text-white text-slate-800">
                  {t.home.recentTrades}
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  className="dark:text-white/40 text-slate-400 hover:text-[var(--cm-primary)] text-xs transition-colors"
                  onClick={() => setIsTradesOpen(true)}
                >
                  {t.home.viewDetails}
                </Button>
              </div>
              <div className="dark:bg-black/40 dark:border dark:border-white/10 bg-white/80 border border-slate-200/60 rounded-2xl p-4 card-glow xl:flex xl:min-h-0 xl:flex-1 xl:flex-col">
                <div className="xl:min-h-0 xl:flex-1 xl:overflow-y-auto">
                  <div className="w-full overflow-x-auto">
                    <table className="w-full text-left whitespace-nowrap">
                      <thead>
                        <tr>
                          <th className="py-4 text-[10px] font-bold dark:text-white/30 text-slate-400 border-b dark:border-white/5 border-slate-100 uppercase tracking-widest">{t.table.tradeId}</th>
                          <th className="py-4 text-[10px] font-bold dark:text-white/30 text-slate-400 border-b dark:border-white/5 border-slate-100 uppercase tracking-widest">{t.table.agent}</th>
                          <th className="py-4 text-[10px] font-bold dark:text-white/30 text-slate-400 border-b dark:border-white/5 border-slate-100 uppercase tracking-widest">{t.table.tradeType}</th>
                          <th className="py-4 text-[10px] font-bold dark:text-white/30 text-slate-400 border-b dark:border-white/5 border-slate-100 uppercase tracking-widest">{t.table.amountValue}</th>
                          <th className="py-4 text-[10px] font-bold dark:text-white/30 text-slate-400 border-b dark:border-white/5 border-slate-100 uppercase tracking-widest">{t.table.tradePair}</th>
                          <th className="py-4 text-[10px] font-bold dark:text-white/30 text-slate-400 border-b dark:border-white/5 border-slate-100 uppercase tracking-widest">{t.table.status}</th>
                          <th className="py-4 text-[10px] font-bold dark:text-white/30 text-slate-400 border-b dark:border-white/5 border-slate-100 uppercase tracking-widest">{t.table.time}</th>
                        </tr>
                      </thead>
                      <tbody className="text-xs font-mono">
                        {homeTrades.slice(0, 8).map((trade) => (
                          <tr key={trade.id} className="hover:bg-[var(--cm-primary)]/5 transition-colors border-b dark:border-white/5 border-slate-100">
                            <td className="py-4 dark:text-white/80 text-slate-600">{trade.id}</td>
                            <td className="py-4 text-[var(--cm-primary)]/60">{tradeSkillMap[trade.skill] || trade.skill}</td>
                            <td className={`py-4 ${trade.type === "买入" ? "text-[var(--cm-success)]" : trade.type === "卖出" ? "text-[var(--cm-danger)]" : "dark:text-white/40 text-slate-400"}`}>
                              {tradeTypeMap[trade.type] || trade.type}
                            </td>
                            <td className="py-4 dark:text-white/40 text-slate-500">{trade.amount}</td>
                            <td className="py-4 text-[var(--cm-primary)]/60">{trade.pair}</td>
                            <td className="py-4">
                              <span className={`px-2 py-1 rounded-md text-xs ${trade.status === "已完成" ? "bg-[var(--cm-success)]/10 text-[var(--cm-success)] border border-[var(--cm-success)]/20" : "bg-[var(--cm-warning)]/10 text-[var(--cm-warning)] border border-[var(--cm-warning)]/20"}`}>
                                {trade.status}
                              </span>
                            </td>
                            <td className="py-4 dark:text-white/30 text-slate-400">{trade.time}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
          </section>

          <section className="space-y-3 xl:col-start-2 xl:row-start-2 xl:flex xl:min-h-0 xl:flex-col">
              <div className="flex items-center justify-between gap-3 px-1">
                <h2 className="text-lg font-semibold tracking-tight dark:text-white text-slate-800">{t.home.announcements}</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  className="dark:text-white/40 text-slate-400 hover:text-[var(--cm-primary)] text-xs transition-colors"
                  onClick={() => setIsAnnouncementsOpen(true)}
                >
                  {t.home.viewDetails}
                </Button>
              </div>
              <div className="dark:bg-black/40 dark:border dark:border-white/10 bg-white/80 border border-slate-200/60 rounded-2xl p-4 card-glow xl:flex xl:min-h-0 xl:flex-1 xl:flex-col">
                <div className="xl:min-h-0 xl:flex-1 xl:overflow-y-auto">
                  {announcements.map((announcement) => (
                    <div
                      key={announcement.id}
                      className="cursor-pointer rounded-lg p-3 transition-colors hover:bg-[var(--cm-primary)]/5 border-b dark:border-white/5 border-slate-100 last:border-0"
                      onClick={() => {
                        setSelectedAnnouncement(announcement)
                        setIsAnnouncementsOpen(true)
                      }}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={cn(
                            "mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full text-xs font-medium",
                            announcement.badge === "系统"
                              ? "bg-rose-100 text-rose-500 dark:bg-rose-500/15 dark:text-rose-300"
                              : "bg-sky-100 text-sky-500 dark:bg-sky-500/15 dark:text-sky-300"
                          )}
                        >
                          {(announcement.badge === "系统" ? t.home.systemBadge : t.home.announcementBadge).charAt(0)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <h3 className="text-base font-bold dark:text-white/80 text-slate-600">
                              {announcement.title}
                            </h3>
                            <span className="shrink-0 text-sm dark:text-white/30 text-slate-400">
                              {announcement.date}
                            </span>
                          </div>
                          <p className="mt-2 text-sm dark:text-white/30 text-slate-400 leading-6">
                            {announcement.summary}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
          </section>
        </div>
      </div>
      </div>

      <Dialog open={isLeaderboardOpen} onOpenChange={setIsLeaderboardOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{t.home.revenueLeaderboard}</DialogTitle>
            <DialogDescription>
              {t.home.leaderboardDialogDesc}
            </DialogDescription>
          </DialogHeader>
          <div className="flex max-h-[60vh] flex-col">
            <div className="flex-1 overflow-y-auto pr-1">
              {extendedLeaderboard.map((entry, index) => (
                <div
                  key={entry.rank}
                  className="flex items-center gap-4 rounded-xl border-b dark:border-white/5 border-slate-100 last:border-0 px-4 py-3 hover:bg-[var(--cm-primary)]/5 transition-colors"
                >
                  <div
                    className={cn(
                      "flex size-9 shrink-0 items-center justify-center rounded-full text-sm font-medium",
                      rankBadgeClassNames[index] ?? "bg-muted text-foreground"
                    )}
                  >
                    {entry.rank}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-medium dark:text-white/80 text-slate-600">
                      {entry.name}
                    </div>
                    <div className="mt-0.5 text-xs dark:text-white/30 text-slate-400">
                      {t.home.cumulativeDuration}{entry.runtime} · {t.home.roiLabel}{entry.roi}
                    </div>
                  </div>
                  <div className="shrink-0 text-right">
                    <div className="text-sm font-semibold dark:text-white/80 text-slate-600 font-mono">{entry.income}</div>
                    <div className="mt-0.5 text-xs dark:text-white/30 text-slate-400">
                      {t.home.monthlyRevenue}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-3 shrink-0 rounded-xl bg-primary px-4 py-3 shadow-lg">
              <div className="flex items-center gap-4">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-background text-sm font-bold text-primary shadow-sm">
                  {currentUserPosition.rank}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="truncate text-sm font-semibold text-primary-foreground">
                      {currentUserPosition.name}
                    </span>
                    <span className="shrink-0 rounded-full bg-background px-2 py-0.5 text-xs font-medium text-primary">
                      {t.home.myRank}
                    </span>
                  </div>
                  <div className="mt-1 text-xs text-primary-foreground/80">
                    {t.home.cumulativeDuration}{currentUserPosition.runtime} · {t.home.roiLabel}{currentUserPosition.roi}
                  </div>
                </div>
                <div className="shrink-0 text-right">
                  <div className="text-base font-bold text-primary-foreground">
                    {currentUserPosition.income}
                  </div>
                  <div className="mt-1 text-xs text-primary-foreground/80">
                    {t.home.monthlyRevenue}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isTradesOpen} onOpenChange={setIsTradesOpen}>
        <DialogContent className="sm:max-w-5xl">
          <DialogHeader>
            <DialogTitle>{t.home.recentTrades}</DialogTitle>
            <DialogDescription>
              {t.home.tradesDialogDesc}
            </DialogDescription>
          </DialogHeader>
          <div className="max-h-[70vh] overflow-y-auto">
            <div className="w-full overflow-x-auto">
              <table className="w-full text-left whitespace-nowrap">
                <thead>
                  <tr>
                    <th className="py-4 text-[10px] font-bold dark:text-white/30 text-slate-400 border-b dark:border-white/5 border-slate-100 uppercase tracking-widest">{t.table.tradeId}</th>
                    <th className="py-4 text-[10px] font-bold dark:text-white/30 text-slate-400 border-b dark:border-white/5 border-slate-100 uppercase tracking-widest">{t.table.tradeType}</th>
                    <th className="py-4 text-[10px] font-bold dark:text-white/30 text-slate-400 border-b dark:border-white/5 border-slate-100 uppercase tracking-widest">{t.table.price}</th>
                    <th className="py-4 text-[10px] font-bold dark:text-white/30 text-slate-400 border-b dark:border-white/5 border-slate-100 uppercase tracking-widest">{t.table.amountValue}</th>
                    <th className="py-4 text-[10px] font-bold dark:text-white/30 text-slate-400 border-b dark:border-white/5 border-slate-100 uppercase tracking-widest">{t.table.tradePair}</th>
                    <th className="py-4 text-[10px] font-bold dark:text-white/30 text-slate-400 border-b dark:border-white/5 border-slate-100 uppercase tracking-widest">{t.table.revenue}</th>
                    <th className="py-4 text-[10px] font-bold dark:text-white/30 text-slate-400 border-b dark:border-white/5 border-slate-100 uppercase tracking-widest">{t.table.status}</th>
                    <th className="py-4 text-[10px] font-bold dark:text-white/30 text-slate-400 border-b dark:border-white/5 border-slate-100 uppercase tracking-widest">{t.table.time}</th>
                  </tr>
                </thead>
                <tbody className="text-xs font-mono">
                  {homeTrades.map((trade) => (
                    <tr key={trade.id} className="hover:bg-[var(--cm-primary)]/5 transition-colors border-b dark:border-white/5 border-slate-100">
                      <td className="py-4 dark:text-white/80 text-slate-600">{trade.id}</td>
                      <td className={cn(
                        "py-4",
                        trade.type === "买入" && "text-[var(--cm-success)] font-medium",
                        trade.type === "卖出" && "text-[var(--cm-danger)] font-medium",
                        trade.type !== "买入" && trade.type !== "卖出" && "dark:text-white/40 text-slate-400"
                      )}>
                        {tradeTypeMap[trade.type] || trade.type}
                      </td>
                      <td className="py-4 dark:text-white/40 text-slate-500">{trade.price ?? "-"}</td>
                      <td className="py-4 dark:text-white/40 text-slate-500">{trade.amount}</td>
                      <td className="py-4 text-[var(--cm-primary)]/60">{trade.pair}</td>
                      <td className="py-4 dark:text-white/40 text-slate-500">{trade.profit ?? "-"}</td>
                      <td className="py-4">
                        <span className={`px-2 py-1 rounded-md text-xs ${trade.status === "已完成" ? "bg-[var(--cm-success)]/10 text-[var(--cm-success)] border border-[var(--cm-success)]/20" : trade.status === "处理中" ? "bg-[var(--cm-warning)]/10 text-[var(--cm-warning)] border border-[var(--cm-warning)]/20" : "dark:text-white/40 text-slate-400"}`}>
                          {trade.status}
                        </span>
                      </td>
                      <td className="py-4 dark:text-white/30 text-slate-400">{trade.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog
        open={isAnnouncementsOpen}
        onOpenChange={(open) => {
          setIsAnnouncementsOpen(open)
          if (!open) {
            setSelectedAnnouncement(null)
          }
        }}
      >
        <DialogContent className="sm:max-w-2xl">
          {selectedAnnouncement ? (
            <>
              <DialogHeader>
                <Button
                  variant="ghost"
                  size="sm"
                  className="-ml-2 mb-2 h-8 w-fit px-2 text-muted-foreground hover:text-foreground"
                  onClick={() => setSelectedAnnouncement(null)}
                >
                  <ArrowLeftIcon className="mr-1 size-4" />
                  {t.home.backToList}
                </Button>
                <div className="flex items-center gap-2">
                  <div
                    className={cn(
                      "flex size-8 shrink-0 items-center justify-center rounded-full text-xs font-medium",
                      selectedAnnouncement.badge === "系统"
                        ? "bg-rose-100 text-rose-500 dark:bg-rose-500/15 dark:text-rose-300"
                        : "bg-sky-100 text-sky-500 dark:bg-sky-500/15 dark:text-sky-300"
                    )}
                  >
                  {(selectedAnnouncement.badge === "系统" ? t.common.urgent : t.common.announcement).charAt(0)}
                  </div>
                  <DialogTitle className="flex-1">{selectedAnnouncement.title}</DialogTitle>
                  <span className="shrink-0 text-sm text-muted-foreground">
                    {selectedAnnouncement.date}
                  </span>
                </div>
              </DialogHeader>
              <div className="max-h-[60vh] space-y-3 overflow-y-auto pr-1">
                <div className="leading-7 text-foreground">
                  {selectedAnnouncement.body}
                </div>
                {selectedAnnouncement.items && selectedAnnouncement.items.length > 0 && (
                  <div className="space-y-2 text-sm text-muted-foreground">
                    {selectedAnnouncement.items.map((item) => (
                      <div
                        key={item.id}
                        className="cursor-pointer transition-colors hover:text-foreground"
                        onClick={() => setSelectedItem(item)}
                      >
                        <span className="font-medium text-foreground">{item.title}：</span>
                        {item.content}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <DialogHeader>
                <DialogTitle>{t.home.announcements}</DialogTitle>
                <DialogDescription>{t.home.announcementDialogDesc}</DialogDescription>
              </DialogHeader>
              <div className="max-h-[70vh] space-y-2 overflow-y-auto pr-1">
                {announcements.map((announcement) => (
                  <div
                    key={announcement.id}
                    className="cursor-pointer rounded-lg p-3 transition-colors hover:bg-[var(--cm-primary)]/5 border-b dark:border-white/5 border-slate-100 last:border-0"
                    onClick={() => setSelectedAnnouncement(announcement)}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={cn(
                          "mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full text-xs font-medium",
                          announcement.badge === "系统"
                            ? "bg-rose-100 text-rose-500 dark:bg-rose-500/15 dark:text-rose-300"
                            : "bg-sky-100 text-sky-500 dark:bg-sky-500/15 dark:text-sky-300"
                        )}
                      >
                        {(announcement.badge === "系统" ? t.home.systemBadge : t.home.announcementBadge).charAt(0)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <h3 className="text-base font-bold dark:text-white/80 text-slate-600">{announcement.title}</h3>
                          <span className="shrink-0 text-sm dark:text-white/30 text-slate-400">
                            {announcement.date}
                          </span>
                        </div>
                        <p className="mt-2 text-sm dark:text-white/30 text-slate-400 leading-6">
                          {announcement.body}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      <Dialog
        open={selectedItem !== null}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedItem(null)
          }
        }}
      >
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{selectedItem?.title}</DialogTitle>
          </DialogHeader>
          <div className="leading-7 text-muted-foreground">
            {selectedItem?.content}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
