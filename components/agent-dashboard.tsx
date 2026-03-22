"use client"

import * as React from "react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Conversation,
  ConversationContent,
} from "@/components/ui/conversation"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import {
  Message,
  MessageAvatar,
  MessageContent,
} from "@/components/ui/message"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { AgentChannel, AgentConfig, AgentPosition } from "@/lib/mock-data"
import {
  currentUserPosition,
  defaultAutoTradeConfig,
  extendedLeaderboard,
} from "@/lib/mock-data"
import { ArrowUpIcon, BotIcon, ChevronLeftIcon, ChevronRightIcon, Share2Icon } from "lucide-react"
import { cn } from "@/lib/utils"
import { useLocale } from "@/components/locale-provider"

type ConversationMode = "strategy" | "normal"

type AgentSuggestion = {
  id: string
  mode: ConversationMode
  pair: string
  side: "做多" | "做空"
  summary: string
  latestPrice: string
  markPrice: string
  tradeId: string
  trigger: string
  investRange: string
  maxAdd: string
  maCost: string
  defaultAmount: string
  timestamp: string
}

type AgentChatMessage = {
  id: string
  role: "assistant" | "user"
  text: string
  suggestion?: AgentSuggestion
}

type AgentWorkspace = {
  initialMessages: Record<ConversationMode, AgentChatMessage[]>
  historySuggestions: Record<ConversationMode, AgentSuggestion[]>
}

const STRATEGY_PRESETS = ["#启动智能体", "#关闭智能体"] as const
const ASSISTANT_REPLY_BASE_DELAY = 900
const ASSISTANT_REPLY_PER_CHAR_DELAY = 18
const ASSISTANT_REPLY_MAX_DELAY = 1600

function createId(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`
}

function buildSuggestion(
  id: string,
  mode: ConversationMode,
  config: AgentConfig,
  overrides: Partial<AgentSuggestion> = {}
): AgentSuggestion {
  const basePair =
    config.positions[0]?.pair ?? config.trades[0]?.pair ?? "USDT/ETH 永续"
  const baseSide = config.positions[0]?.side ?? "做多"

  return {
    id,
    mode,
    pair: basePair,
    side: baseSide,
    summary:
      mode === "strategy"
        ? config.strategyConversation[0] ?? config.statusNote
        : config.normalConversation[0] ?? "你可以继续确认并买入这一笔合约。",
    latestPrice: config.latestPrice,
    markPrice: config.markPrice,
    tradeId: config.tradeId,
    trigger: config.trigger,
    investRange: config.investRange,
    maxAdd: config.maxAdd,
    maCost: config.maCost,
    defaultAmount: config.defaultAmount,
    timestamp: config.trades[0]?.time ?? "刚刚",
    ...overrides,
  }
}

function createWorkspace(
  channel: AgentChannel,
  config: AgentConfig
): AgentWorkspace {
  const positionPairs = config.positions.map((item) => item.pair)
  const tradePairs = config.trades.map((item) => item.pair)

  const strategyFeatured = buildSuggestion(
    `${channel}-strategy-featured`,
    "strategy",
    config,
    {
      pair: positionPairs[0] ?? tradePairs[0] ?? "USDT/ETH 永续",
      side: config.positions[0]?.side ?? "做多",
      summary: config.strategyConversation[0] ?? config.statusNote,
      timestamp: config.trades[0]?.time ?? "刚刚",
    }
  )

  const strategyHistory = [
    buildSuggestion(`${channel}-strategy-1`, "strategy", config, {
      pair: positionPairs[1] ?? tradePairs[1] ?? strategyFeatured.pair,
      side: config.positions[1]?.side ?? "做空",
      summary:
        config.strategyConversation[1] ??
        "这一轮策略还未执行，你可以继续确认后买入。",
      timestamp: config.trades[1]?.time ?? "2026-03-10 09:45:00",
    }),
    buildSuggestion(`${channel}-strategy-2`, "strategy", config, {
      pair: tradePairs[2] ?? positionPairs[2] ?? strategyFeatured.pair,
      side: "做多",
      summary: "上一轮策略仍保留在历史池中，可继续补单或直接买入。",
      timestamp: config.trades[2]?.time ?? "2026-03-10 09:18:00",
    }),
    buildSuggestion(`${channel}-strategy-3`, "strategy", config, {
      pair: "BNB/USDT 永续",
      side: "做多",
      summary: "BNB 强势突破关键阻力位，建议顺势做多跟进。",
      timestamp: "2026-03-09 15:30:00",
    }),
    buildSuggestion(`${channel}-strategy-4`, "strategy", config, {
      pair: "SOL/USDT 永续",
      side: "做空",
      summary: "SOL 出现顶背离信号，轻仓做空尝试抓回调。",
      timestamp: "2026-03-09 14:22:00",
    }),
    buildSuggestion(`${channel}-strategy-5`, "strategy", config, {
      pair: "ADA/USDT 永续",
      side: "做多",
      summary: "ADA 回调至支撑位企稳，可考虑分批建仓做多。",
      timestamp: "2026-03-09 11:08:00",
    }),
    buildSuggestion(`${channel}-strategy-6`, "strategy", config, {
      pair: "DOGE/USDT 永续",
      side: "做空",
      summary: "DOGE 成交量萎缩，上涨动能不足，短线做空。",
      timestamp: "2026-03-08 22:45:00",
    }),
  ]

  const normalHistory = [
    buildSuggestion(`${channel}-normal-1`, "normal", config, {
      pair: tradePairs[0] ?? strategyFeatured.pair,
      side: "做多",
      summary:
        config.normalConversation[0] ??
        "这笔合约来自普通对话上下文，当前还未执行。",
      timestamp: config.trades[0]?.time ?? "2026-03-10 10:12:00",
    }),
    buildSuggestion(`${channel}-normal-2`, "normal", config, {
      pair: tradePairs[1] ?? strategyFeatured.pair,
      side: "做空",
      summary:
        config.normalConversation[1] ??
        "你可以继续追问细节，再决定是否直接买入。",
      timestamp: config.trades[1]?.time ?? "2026-03-10 09:40:00",
    }),
  ]

  return {
    initialMessages: {
      strategy: [
        {
          id: createId("msg"),
          role: "assistant",
          text: config.statusNote,
        },
        {
          id: createId("msg"),
          role: "assistant",
          text:
            config.strategyConversation[0] ??
            "已为你准备好当前策略推荐，你可以继续确认是否买入。",
          suggestion: strategyFeatured,
        },
      ],
      normal: [
        {
          id: createId("msg"),
          role: "assistant",
          text:
            config.normalConversation[0] ??
            "普通对话已开启，你可以直接问我当前合约和行情问题。",
        },
      ],
    },
    historySuggestions: {
      strategy: strategyHistory,
      normal: normalHistory,
    },
  }
}

function AgentSuggestionCard({
  suggestion,
  purchased,
  onBuy,
}: {
  suggestion: AgentSuggestion
  purchased: boolean
  onBuy: (suggestion: AgentSuggestion) => void
}) {
  return (
    <div className="dark:bg-black/40 dark:border dark:border-white/10 bg-white/80 border border-slate-200/60 rounded-xl p-4 card-glow">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-base font-semibold dark:text-white text-slate-700">{suggestion.pair}</p>
          <p className="mt-1 text-sm dark:text-white/40 text-slate-400">
            {suggestion.summary}
          </p>
        </div>
        <Badge variant={suggestion.side === "做多" ? "default" : "secondary"}>
          {suggestion.side}
        </Badge>
      </div>

      <div className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
        <div>
          <p className="text-[10px] dark:text-white/30 text-slate-400 uppercase">最新价格</p>
          <p className="mt-1 text-lg font-semibold dark:text-white text-slate-700">
            {suggestion.latestPrice}
          </p>
        </div>
        <div>
          <p className="text-[10px] dark:text-white/30 text-slate-400 uppercase">标记价</p>
          <p className="mt-1 text-lg font-semibold dark:text-white text-slate-700">
            {suggestion.markPrice}
          </p>
        </div>
        <div>
          <p className="text-[10px] dark:text-white/30 text-slate-400 uppercase">交易号</p>
          <p className="mt-1 dark:text-white/40 text-slate-500">{suggestion.tradeId}</p>
        </div>
        <div>
          <p className="text-[10px] dark:text-white/30 text-slate-400 uppercase">最大补仓次数</p>
          <p className="mt-1 dark:text-white/40 text-slate-500">{suggestion.maxAdd}</p>
        </div>
        <div className="sm:col-span-2">
          <p className="text-[10px] dark:text-white/30 text-slate-400 uppercase">触发条件</p>
          <p className="mt-1 dark:text-white/40 text-slate-500">{suggestion.trigger}</p>
        </div>
        <div>
          <p className="text-[10px] dark:text-white/30 text-slate-400 uppercase">投入金额</p>
          <p className="mt-1 dark:text-white/40 text-slate-500">{suggestion.investRange}</p>
        </div>
        <div>
          <p className="text-[10px] dark:text-white/30 text-slate-400 uppercase">消耗算力</p>
          <p className="mt-1 dark:text-white/40 text-slate-500">{suggestion.maCost}</p>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-3">
        <Input
          defaultValue={suggestion.defaultAmount}
          className="max-w-28 dark:bg-white/5 bg-slate-50"
        />
        <Button
          onClick={() => onBuy(suggestion)}
          disabled={purchased}
          className="min-w-24"
        >
          {purchased ? "已买入" : "买入"}
        </Button>
      </div>
    </div>
  )
}

function AgentHistoryCard({
  suggestion,
  onContinue,
  t,
}: {
  suggestion: AgentSuggestion
  onContinue: (suggestion: AgentSuggestion) => void
  t: any
}) {
  return (
    <div className="dark:bg-black/40 dark:border dark:border-white/10 bg-white/80 border border-slate-200/60 rounded-xl p-4 card-glow">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold dark:text-white text-slate-700">{suggestion.pair}</p>
          <p className="mt-1 text-xs dark:text-white/30 text-slate-400">
            {suggestion.timestamp}
          </p>
        </div>
        <Badge variant="outline">{suggestion.side}</Badge>
      </div>

      <p className="mt-3 text-sm dark:text-white/40 text-slate-500">{suggestion.summary}</p>

      <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
        <div>
          <p className="text-[10px] dark:text-white/30 text-slate-400 uppercase">{t.agent.latestPrice}</p>
          <p className="mt-1 font-medium dark:text-white/40 text-slate-500">
            {suggestion.latestPrice}
          </p>
        </div>
        <div>
          <p className="text-[10px] dark:text-white/30 text-slate-400 uppercase">{t.agent.markPrice}</p>
          <p className="mt-1 font-medium dark:text-white/40 text-slate-500">
            {suggestion.markPrice}
          </p>
        </div>
      </div>

      <Button
        variant="outline"
        size="sm"
        className="mt-4 w-full"
        onClick={() => onContinue(suggestion)}
      >
        {t.agent.continueBuy}
      </Button>
    </div>
  )
}

export function AgentDashboard({
  channel,
  config,
}: {
  channel: AgentChannel
  config: AgentConfig
}) {
  const { t } = useLocale()
  const workspace = React.useMemo(
    () => createWorkspace(channel, config),
    [channel, config]
  )
  const [conversationMode, setConversationMode] =
    React.useState<ConversationMode>("strategy")
  const [isAutoTradeEnabled, setIsAutoTradeEnabled] = React.useState(false)
  const [draft, setDraft] = React.useState("")
  const [messagesByMode, setMessagesByMode] = React.useState<
    Record<ConversationMode, AgentChatMessage[]>
  >(() => workspace.initialMessages)
  const [purchasedSuggestionIds, setPurchasedSuggestionIds] = React.useState<
    string[]
  >([])
  const [positionTab, setPositionTab] = React.useState<"进行中" | "已完成">(
    "进行中"
  )
  const [closeDialogPosition, setCloseDialogPosition] =
    React.useState<AgentPosition | null>(null)
  const [closeMethod, setCloseMethod] = React.useState<"all" | "partial">("all")
  const [partialPercent, setPartialPercent] = React.useState("50")
  const [shareDialogPosition, setShareDialogPosition] =
    React.useState<AgentPosition | null>(null)
  const [isLeaderboardOpen, setIsLeaderboardOpen] = React.useState(false)
  const [isAutoTradeConfigOpen, setIsAutoTradeConfigOpen] = React.useState(false)
  const [autoTradeConfig, setAutoTradeConfig] = React.useState(defaultAutoTradeConfig)
  // AI 全自动交易弹窗状态
  const [tradeAmount, setTradeAmount] = React.useState("10%")
  const [tradeAmountAuto, setTradeAmountAuto] = React.useState(false)
  const [tradeStrategy, setTradeStrategy] = React.useState<"稳健型" | "平衡型" | "成长型" | "auto">("auto")
  const [closeThreshold, setCloseThreshold] = React.useState("10%")
  const [closeThresholdAuto, setCloseThresholdAuto] = React.useState(false)
  const [isHistoryCollapsed, setIsHistoryCollapsed] = React.useState(() => {
    if (typeof window === "undefined") return false
    const saved = localStorage.getItem("history-collapsed")
    return saved === "true"
  })

  React.useEffect(() => {
    localStorage.setItem("history-collapsed", String(isHistoryCollapsed))
  }, [isHistoryCollapsed])
  const messagesByModeRef = React.useRef(messagesByMode)
  const purchasedSuggestionIdsRef = React.useRef(purchasedSuggestionIds)
  const pendingSuggestionIdsRef = React.useRef<Set<string>>(new Set())
  const replyTimeoutIdsRef = React.useRef<number[]>([])

  React.useEffect(() => {
    messagesByModeRef.current = messagesByMode
  }, [messagesByMode])

  React.useEffect(() => {
    purchasedSuggestionIdsRef.current = purchasedSuggestionIds
  }, [purchasedSuggestionIds])

  React.useEffect(() => {
    return () => {
      replyTimeoutIdsRef.current.forEach((timeoutId) => window.clearTimeout(timeoutId))
    }
  }, [])

  React.useEffect(() => {
    replyTimeoutIdsRef.current.forEach((timeoutId) => window.clearTimeout(timeoutId))
    replyTimeoutIdsRef.current = []
    pendingSuggestionIdsRef.current.clear()
    setConversationMode("strategy")
    setIsAutoTradeEnabled(false)
    setDraft("")
    setMessagesByMode(workspace.initialMessages)
    setPurchasedSuggestionIds([])
  }, [workspace])

  const positions = config.positions.filter((position) =>
    positionTab === "进行中"
      ? position.status === "进行中"
      : position.status === "已完成"
  )

  const activeMessages = messagesByMode[conversationMode]
  const availableHistory = workspace.historySuggestions[conversationMode].filter(
    (item) => !purchasedSuggestionIds.includes(item.id)
  )

  const buildAssistantReply = React.useCallback(
    (mode: ConversationMode, content: string) => {
      if (mode === "strategy") {
        if (content.includes("关闭")) {
          return "已记录关闭请求，当前会停止新的策略推送，你仍然可以继续查看历史策略。"
        }

        if (content.includes("启动")) {
          return config.statusNote
        }

        return (
          config.strategyConversation[1] ??
          "我已根据你的输入整理出下一轮可执行策略，你可以继续确认。"
        )
      }

      if (content.includes("风险")) {
        return "当前建议先观察仓位节奏，再决定是否继续追单。"
      }

      return (
        config.normalConversation[1] ??
        "普通对话已收到，我会继续按你的问题补充说明。"
      )
    },
    [config.normalConversation, config.statusNote, config.strategyConversation]
  )

  const getAssistantReplyDelay = React.useCallback((content: string) => {
    return Math.min(
      ASSISTANT_REPLY_MAX_DELAY,
      ASSISTANT_REPLY_BASE_DELAY + content.length * ASSISTANT_REPLY_PER_CHAR_DELAY
    )
  }, [])

  const handleSend = React.useCallback(() => {
    const content = draft.trim()
    if (!content) {
      return
    }
    const currentMode = conversationMode
    const surfacedSuggestions = new Set(
      messagesByModeRef.current[currentMode]
        .map((message) => message.suggestion?.id)
        .filter((value): value is string => Boolean(value))
    )
    const nextSuggestion =
      currentMode === "strategy"
        ? workspace.historySuggestions.strategy.find(
            (item) =>
              !purchasedSuggestionIdsRef.current.includes(item.id) &&
              !pendingSuggestionIdsRef.current.has(item.id) &&
              !surfacedSuggestions.has(item.id)
          )
        : undefined
    const assistantText = buildAssistantReply(currentMode, content)

    if (nextSuggestion) {
      pendingSuggestionIdsRef.current.add(nextSuggestion.id)
    }

    setMessagesByMode((current) => ({
      ...current,
      [currentMode]: [
        ...current[currentMode],
        {
          id: createId("msg"),
          role: "user",
          text: content,
        },
      ],
    }))
    setDraft("")

    const timeoutId = window.setTimeout(() => {
      if (nextSuggestion) {
        pendingSuggestionIdsRef.current.delete(nextSuggestion.id)
      }

      setMessagesByMode((current) => ({
        ...current,
        [currentMode]: [
          ...current[currentMode],
          {
            id: createId("msg"),
            role: "assistant",
            text: assistantText,
            suggestion: nextSuggestion,
          },
        ],
      }))

      replyTimeoutIdsRef.current = replyTimeoutIdsRef.current.filter(
        (storedTimeoutId) => storedTimeoutId !== timeoutId
      )
    }, getAssistantReplyDelay(content))

    replyTimeoutIdsRef.current.push(timeoutId)
  }, [buildAssistantReply, conversationMode, draft, getAssistantReplyDelay, workspace.historySuggestions.strategy])

  const handleContinueSuggestion = React.useCallback(
    (suggestion: AgentSuggestion) => {
      setConversationMode(suggestion.mode)
      setDraft(`继续购买 ${suggestion.pair}`)
      setMessagesByMode((current) => {
        const exists = current[suggestion.mode].some(
          (message) => message.suggestion?.id === suggestion.id
        )

        if (exists) {
          return current
        }

        return {
          ...current,
          [suggestion.mode]: [
            ...current[suggestion.mode],
            {
              id: createId("msg"),
              role: "assistant",
              text: `已恢复 ${suggestion.pair} 的历史记录，你可以继续确认后买入。`,
              suggestion,
            },
          ],
        }
      })
    },
    []
  )

  const handleBuySuggestion = React.useCallback((suggestion: AgentSuggestion) => {
    setPurchasedSuggestionIds((current) =>
      current.includes(suggestion.id) ? current : [...current, suggestion.id]
    )
    setConversationMode(suggestion.mode)
    setMessagesByMode((current) => ({
      ...current,
      [suggestion.mode]: [
        ...current[suggestion.mode],
        {
          id: createId("msg"),
          role: "assistant",
          text: `已为你记录 ${suggestion.pair} 的买入请求，接下来可以在仓位结果区继续观察执行状态。`,
        },
      ],
    }))
  }, [])

  return (
    <div className="flex flex-1 flex-col">
      <div className="dark:bg-white/5 bg-white/60 backdrop-blur-3xl rounded-2xl md:rounded-[32px] border dark:border-white/10 border-white/80 min-h-full p-4 md:p-8 dark:shadow-none card-glow">
      <div className="@container/main flex flex-1 flex-col gap-4 py-4 md:gap-6 md:py-6">
        <div className="grid gap-4 px-4 lg:grid-cols-[minmax(0,1fr)_minmax(420px,480px)] lg:px-6 xl:grid-cols-[minmax(0,1fr)_480px]">
          <div className="dark:bg-black/40 dark:border dark:border-white/10 bg-white/80 border border-slate-200/60 rounded-2xl p-3 card-glow overflow-hidden lg:h-[720px]">
            <div className="relative flex h-full">
              <section className="flex h-full min-h-0 flex-1 flex-col">
                <div className="min-h-0 flex-1 overflow-hidden">
                  <Conversation className="h-full">
                    <ConversationContent className="h-full gap-3">
                      {activeMessages.map((message) => (
                        <Message
                          key={message.id}
                          from={message.role === "assistant" ? "assistant" : "user"}
                        >
                          {message.role === "assistant" ? (
                            <>
                              <MessageAvatar
                                name={`${config.badge} Agent`}
                                icon={<BotIcon className="size-4" />}
                                className="after:hidden"
                                fallbackClassName="bg-primary/15 text-primary"
                              />
                              <div className="flex min-w-0 max-w-[min(100%,34rem)] flex-col gap-2">
                                <MessageContent variant="contained">
                                  <p className="max-w-[44ch] leading-7">{message.text}</p>
                                </MessageContent>
                                {message.suggestion ? (
                                  <AgentSuggestionCard
                                    suggestion={message.suggestion}
                                    purchased={purchasedSuggestionIds.includes(
                                      message.suggestion.id
                                    )}
                                    onBuy={handleBuySuggestion}
                                    t={t}
                                  />
                                ) : null}
                              </div>
                            </>
                          ) : (
                            <>
                              <div className="flex min-w-0 max-w-[min(100%,34rem)] flex-col items-end gap-2">
                                <MessageContent variant="contained">
                                  <p className="leading-7">{message.text}</p>
                                </MessageContent>
                                {message.suggestion ? (
                                  <AgentSuggestionCard
                                    suggestion={message.suggestion}
                                    purchased={purchasedSuggestionIds.includes(
                                      message.suggestion.id
                                    )}
                                    onBuy={handleBuySuggestion}
                                  />
                                ) : null}
                              </div>
                            </>
                          )}
                        </Message>
                      ))}
                    </ConversationContent>
                  </Conversation>
                </div>

                <div className="mt-1.5">
                  <div className="dark:bg-black/40 dark:border dark:border-white/10 bg-white/80 border border-slate-200/60 rounded-[24px] px-3 py-2.5 card-glow">
                    <div className="flex flex-col gap-2">
                      <div className="flex min-h-9 flex-wrap items-center gap-1.5">
                        <Tabs
                          value={conversationMode}
                          onValueChange={(value) =>
                            setConversationMode(value as ConversationMode)
                          }
                          className="w-auto"
                        >
                          <TabsList className="grid grid-cols-2">
                            <TabsTrigger value="strategy">{t.agent.strategyChat}</TabsTrigger>
                            <TabsTrigger value="normal">{t.agent.normalChat}</TabsTrigger>
                          </TabsList>
                        </Tabs>

                        {STRATEGY_PRESETS.map((preset) => (
                          <Button
                            key={preset}
                            variant="ghost"
                            size="sm"
                            className={
                              conversationMode === "strategy"
                                ? "h-9 rounded-full border border-border/60 bg-muted/20 px-3"
                                : "pointer-events-none h-9 rounded-full border border-transparent px-3 text-transparent shadow-none"
                            }
                            tabIndex={conversationMode === "strategy" ? 0 : -1}
                            aria-hidden={conversationMode === "strategy" ? undefined : true}
                            onClick={() => {
                              if (conversationMode === "strategy") {
                                setDraft(preset)
                              }
                            }}
                          >
                            {preset}
                          </Button>
                        ))}

                        <div className="ml-auto flex shrink-0 items-center gap-2 rounded-full dark:border dark:border-white/10 border-slate-200/60 dark:bg-white/5 bg-slate-100 px-2.5 py-1.5">
                          <Switch
                            checked={isAutoTradeEnabled}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setIsAutoTradeConfigOpen(true)
                              } else {
                                setIsAutoTradeEnabled(false)
                              }
                            }}
                          />
                          <span className="text-sm dark:text-white/40 text-slate-400">{t.agent.autoTrade}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Input
                          value={draft}
                          onChange={(event) => setDraft(event.target.value)}
                          onKeyDown={(event) => {
                            if (event.key === "Enter") {
                              event.preventDefault()
                              handleSend()
                            }
                          }}
                          placeholder={t.agent.typeMessage}
                          className="h-11 flex-1 rounded-2xl dark:border dark:border-white/5 border-slate-200/60 dark:bg-white/5 bg-slate-50 px-4 text-base shadow-none"
                        />
                        <Button
                          size="icon"
                          className="size-11 shrink-0 rounded-full"
                          aria-label={t.agent.send}
                          onClick={handleSend}
                        >
                          <ArrowUpIcon className="size-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              <aside
                className={cn(
                  "flex h-full min-h-0 flex-col overflow-hidden bg-muted/20 transition-all duration-300 ease-in-out",
                  isHistoryCollapsed ? "w-12" : "w-[280px]"
                )}
              >
                <div className="flex items-center">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="mr-2 h-8 w-8 shrink-0 rounded-lg bg-muted/60 hover:bg-muted"
                    onClick={() => setIsHistoryCollapsed(!isHistoryCollapsed)}
                    aria-label={isHistoryCollapsed ? "展开历史记录" : "收起历史记录"}
                  >
                    {isHistoryCollapsed ? (
                      <ChevronLeftIcon className="size-4" />
                    ) : (
                      <ChevronRightIcon className="size-4" />
                    )}
                  </Button>
                  <Tabs
                    value={conversationMode}
                    onValueChange={(value) =>
                      setConversationMode(value as ConversationMode)
                    }
                    className={cn("w-full flex-1", isHistoryCollapsed && "opacity-0 pointer-events-none")}
                  >
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="strategy">{t.agent.historyRecords}</TabsTrigger>
                      <TabsTrigger value="normal">{t.agent.normalChat}</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>

                <div
                  className={cn(
                    "mt-3 flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto px-3 pr-1",
                    isHistoryCollapsed ? "opacity-0" : "opacity-100"
                  )}
                >
                  {availableHistory.length > 0 ? (
                    availableHistory.map((suggestion) => (
                      <AgentHistoryCard
                        key={suggestion.id}
                        suggestion={suggestion}
                        onContinue={handleContinueSuggestion}
                        t={t}
                      />
                    ))
                  ) : (
                    <div className="flex flex-1 items-center justify-center rounded-xl border border-dashed dark:border-white/10 border-slate-200/60 dark:bg-black/20 bg-slate-50 px-6 text-center text-sm dark:text-white/40 text-slate-400">
                      当前模式下的待继续合约已经全部处理完了。
                    </div>
                  )}
                </div>

              </aside>
            </div>
          </div>

          <div className="dark:bg-black/40 dark:border dark:border-white/10 bg-white/80 border border-slate-200/60 rounded-2xl p-4 card-glow lg:min-h-[680px] lg:w-[min(100%,480px)] lg:justify-self-end">
            <div className="px-4 pb-3 sm:px-5">
              <Tabs
                value={positionTab}
                onValueChange={(value) =>
                  setPositionTab(value as "进行中" | "已完成")
                }
                className="w-full"
              >
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="进行中">{t.agent.inProgress}</TabsTrigger>
                  <TabsTrigger value="已完成">{t.agent.completed}</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            <div className="flex flex-1 flex-col space-y-2.5 px-4 pb-4 sm:px-5">
              {positions.map((position) => (
                <div
                  key={position.id}
                  className="rounded-xl border-b dark:border-white/5 border-slate-100 last:border-0 px-3.5 py-3 hover:bg-[var(--cm-primary)]/5 transition-colors"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold dark:text-white/80 text-slate-600">{position.pair}</p>
                      <p className="mt-1 text-[11px] leading-5 dark:text-white/30 text-slate-400">
                        {position.condition}
                      </p>
                    </div>
                    <span className="px-2 py-1 rounded-md text-xs font-medium shrink-0 dark:bg-white/10 bg-[var(--cm-primary)]/10 dark:text-white/80 text-slate-600 border dark:border-white/10 border-[var(--cm-primary)]/15">
                      {position.side}
                    </span>
                  </div>

                  <div className={`mt-3 grid gap-x-3 gap-y-2.5 text-sm ${position.status === "已完成" ? "grid-cols-2 xl:grid-cols-5" : "grid-cols-2 xl:grid-cols-4"}`}>
                    <div>
                      <p className="text-[11px] uppercase tracking-[0.08em] dark:text-white/30 text-slate-400">
                        {t.agent.buyAmount}
                      </p>
                      <p className="mt-1 text-sm font-semibold dark:text-white/80 text-slate-600 font-mono">
                        {position.buyAmount}
                      </p>
                    </div>
                    <div>
                      <p className="text-[11px] uppercase tracking-[0.08em] dark:text-white/30 text-slate-400">
                        {t.agent.pnl}
                      </p>
                      <p
                        className={`mt-1 text-sm font-semibold ${
                          position.pnl.startsWith("-")
                            ? "text-[var(--cm-danger)]"
                            : "text-[var(--cm-success)]"
                        }`}
                      >
                        {position.pnl}
                      </p>
                    </div>
                    <div>
                      <p className="text-[11px] uppercase tracking-[0.08em] dark:text-white/30 text-slate-400">
                        {t.agent.entryPrice}
                      </p>
                      <p className="mt-1 text-sm font-semibold dark:text-white/80 text-slate-600 font-mono">
                        {position.entryPrice}
                      </p>
                    </div>
                    <div>
                      <p className="text-[11px] uppercase tracking-[0.08em] dark:text-white/30 text-slate-400">
                        {position.status === "进行中" ? t.agent.currentPrice : t.agent.exitPrice}
                      </p>
                      <p className="mt-1 text-sm font-semibold dark:text-white/80 text-slate-600 font-mono">
                        {position.currentPrice ?? position.exitPrice}
                      </p>
                    </div>
                    {position.status === "已完成" && (
                      <div>
                        <p className="text-[11px] uppercase tracking-[0.08em] dark:text-white/30 text-slate-400">
                          {t.agent.addCount}
                        </p>
                        <p className="mt-1 text-sm font-semibold dark:text-white/80 text-slate-600">
                          {position.addCount} 次
                        </p>
                      </div>
                    )}
                  </div>

                  {position.status === "已完成" && (
                    <div className="mt-3 rounded-lg border dark:border-white/5 border-slate-100 dark:bg-black/20 bg-white/80 px-3 py-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="dark:text-white/30 text-slate-400">交易 ID</span>
                        <span className="font-mono dark:text-white/80 text-slate-600">{position.id}</span>
                      </div>
                    </div>
                  )}

                  <div className="mt-3 flex justify-end">
                    {position.status === "进行中" ? (
                      <Button
                        size="sm"
                        className="bg-emerald-500 text-white hover:bg-emerald-400"
                        onClick={() => setCloseDialogPosition(position)}
                      >
                        {t.agent.closePosition}
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShareDialogPosition(position)}
                      >
                        {t.agent.shareRecord}
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid gap-4 px-4 lg:grid-cols-[minmax(0,1fr)_minmax(420px,480px)] lg:px-6 xl:grid-cols-[minmax(0,1fr)_480px]">
          <div className="dark:bg-black/40 dark:border dark:border-white/10 bg-white/80 border border-slate-200/60 rounded-2xl p-4 card-glow overflow-hidden">
            <div>
              <h2 className="text-lg font-semibold tracking-tight dark:text-white text-slate-800 mb-4">{t.agent.tradeRecords}</h2>
            </div>
            <div className="px-0">
              <div className="w-full overflow-x-auto">
                <table className="w-full text-left whitespace-nowrap">
                  <thead>
                    <tr>
                      <th className="py-4 text-[10px] font-bold dark:text-white/30 text-slate-400 border-b dark:border-white/5 border-slate-100 uppercase tracking-widest">{t.table.tradeId}</th>
                      <th className="py-4 text-[10px] font-bold dark:text-white/30 text-slate-400 border-b dark:border-white/5 border-slate-100 uppercase tracking-widest">{t.table.tradeType}</th>
                      <th className="py-4 text-[10px] font-bold dark:text-white/30 text-slate-400 border-b dark:border-white/5 border-slate-100 uppercase tracking-widest">{t.table.price}</th>
                      <th className="py-4 text-[10px] font-bold dark:text-white/30 text-slate-400 border-b dark:border-white/5 border-slate-100 uppercase tracking-widest">{t.table.amount}</th>
                      <th className="py-4 text-[10px] font-bold dark:text-white/30 text-slate-400 border-b dark:border-white/5 border-slate-100 uppercase tracking-widest">{t.table.tradePair}</th>
                      <th className="py-4 text-[10px] font-bold dark:text-white/30 text-slate-400 border-b dark:border-white/5 border-slate-100 uppercase tracking-widest">{t.table.revenue}</th>
                      <th className="py-4 text-[10px] font-bold dark:text-white/30 text-slate-400 border-b dark:border-white/5 border-slate-100 uppercase tracking-widest">{t.table.status}</th>
                      <th className="py-4 text-[10px] font-bold dark:text-white/30 text-slate-400 border-b dark:border-white/5 border-slate-100 uppercase tracking-widest">{t.table.time}</th>
                    </tr>
                  </thead>
                  <tbody className="text-xs font-mono">
                    {config.trades.map((trade) => (
                      <tr key={trade.id} className="hover:bg-[var(--cm-primary)]/5 transition-colors border-b dark:border-white/5 border-slate-100">
                        <td className="py-4 dark:text-white/80 text-slate-600">{trade.id}</td>
                        <td className={cn(
                          "py-4",
                          trade.type === "买入" && "text-[var(--cm-success)] font-medium",
                          trade.type === "卖出" && "text-[var(--cm-danger)] font-medium",
                          trade.type !== "买入" && trade.type !== "卖出" && "dark:text-white/40 text-slate-400"
                        )}>
                          {trade.type}
                        </td>
                        <td className="py-4 dark:text-white/40 text-slate-500">{trade.price ?? "-"}</td>
                        <td className="py-4 dark:text-white/40 text-slate-500">{trade.amount}</td>
                        <td className="py-4 text-[var(--cm-primary)]/60">{trade.pair}</td>
                        <td className="py-4 text-[var(--cm-success)]">{trade.profit ?? "-"}</td>
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
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:w-[min(100%,480px)] lg:justify-self-end">
            <div className="dark:bg-black/40 dark:border dark:border-white/10 bg-white/80 border border-slate-200/60 rounded-2xl p-4 card-glow">
              <div>
                <h2 className="text-lg font-semibold tracking-tight dark:text-white text-slate-800">{t.agent.accountSummary}</h2>
                <p className="text-sm dark:text-white/30 text-slate-400 mt-1">当前交易账户摘要。</p>
              </div>
              <div className="space-y-4 mt-4">
                <div>
                  <p className="text-sm dark:text-white/30 text-slate-400">{t.agent.accountName}</p>
                  <p className="mt-1 text-lg font-semibold dark:text-white/80 text-slate-600 font-mono">
                    {config.accountSummary.accountName}
                  </p>
                </div>
                <div>
                  <p className="text-sm dark:text-white/30 text-slate-400">{t.agent.totalAssets}</p>
                  <p className="mt-1 dark:text-white/80 text-slate-600 font-mono">{config.accountSummary.totalAssets}</p>
                </div>
                <div className="grid gap-3 lg:grid-cols-1">
                  <div>
                    <p className="text-sm dark:text-white/30 text-slate-400">{t.agent.fundingAssets}</p>
                    <p className="mt-1 dark:text-white/80 text-slate-600 font-mono">{config.accountSummary.fundingAssets}</p>
                  </div>
                  <div>
                    <p className="text-sm dark:text-white/30 text-slate-400">{t.agent.tradingAssets}</p>
                    <p className="mt-1 dark:text-white/80 text-slate-600 font-mono">{config.accountSummary.tradingAssets}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="dark:bg-black/40 dark:border dark:border-white/10 bg-white/80 border border-slate-200/60 rounded-2xl p-4 card-glow">
              <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div>
                  <h2 className="text-lg font-semibold tracking-tight dark:text-white text-slate-800">{t.agent.yieldSummary}</h2>
                  <p className="text-sm dark:text-white/30 text-slate-400 mt-1">{t.agent.yieldSummaryDesc}</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="dark:text-white/40 text-slate-400 hover:text-[var(--cm-primary)] text-xs transition-colors"
                  onClick={() => setIsLeaderboardOpen(true)}
                >
                  {t.home.viewDetails}
                </Button>
              </div>
              <div className="grid gap-4 lg:grid-cols-1">
                <div>
                  <p className="text-sm dark:text-white/30 text-slate-400">{t.agent.strategies}</p>
                  <p className="mt-1 text-lg font-semibold dark:text-white/80 text-slate-600 font-mono">
                    {config.yieldSummary.strategies}
                  </p>
                </div>
                <div>
                  <p className="text-sm dark:text-white/30 text-slate-400">{t.agent.runtime}</p>
                  <p className="mt-1 dark:text-white/80 text-slate-600 font-mono">{config.yieldSummary.runtime}</p>
                </div>
                <div>
                  <p className="text-sm dark:text-white/30 text-slate-400">{t.agent.invested}</p>
                  <p className="mt-1 dark:text-white/80 text-slate-600 font-mono">{config.yieldSummary.invested}</p>
                </div>
                <div>
                  <p className="text-sm dark:text-white/30 text-slate-400">{t.agent.roi}</p>
                  <p className="mt-1 text-[var(--cm-success)] font-mono">{config.yieldSummary.roi}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>

      <Dialog
        open={Boolean(closeDialogPosition)}
        onOpenChange={(open) => {
          if (!open) {
            setCloseDialogPosition(null)
            setCloseMethod("all")
            setPartialPercent("50")
          }
        }}
      >
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{t.agent.closePositionReminder}</DialogTitle>
            <DialogDescription>
              {t.agent.closePositionDesc}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="dark:bg-black/40 dark:border dark:border-white/10 bg-white/80 border border-slate-200/60 rounded-xl px-4 py-3 card-glow">
              <div className="flex items-center justify-between">
                <p className="font-medium dark:text-white text-slate-700">{closeDialogPosition?.pair}</p>
                <Badge variant="outline">{closeDialogPosition?.side}</Badge>
              </div>
              <div className="mt-2 grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-[10px] dark:text-white/30 text-slate-400 uppercase">{t.table.tradeId}</p>
                  <p className="mt-1 font-mono dark:text-white/80 text-slate-600">{closeDialogPosition?.id}</p>
                </div>
                <div>
                  <p className="text-[10px] dark:text-white/30 text-slate-400 uppercase">{t.agent.buyAmount}</p>
                  <p className="mt-1 font-medium dark:text-white/80 text-slate-600">{closeDialogPosition?.buyAmount}</p>
                </div>
              </div>
            </div>

            <div className="dark:bg-black/40 dark:border dark:border-white/10 bg-white/80 border border-slate-200/60 rounded-xl px-4 py-3 card-glow">
              <div className="flex items-center justify-between">
                <span className="text-sm dark:text-white/30 text-slate-400">当前盈亏</span>
                <span className={`text-lg font-semibold ${closeDialogPosition?.pnl.startsWith("-") ? "text-[var(--cm-danger)]" : "text-[var(--cm-success)]"}`}>
                  {closeDialogPosition?.pnl}
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-sm font-medium dark:text-white text-slate-700">选择平仓方式</p>
              {/* Segmented Control 风格的选择器 */}
              <div className="dark:bg-black/40 dark:border dark:border-white/10 bg-white/80 border border-slate-200/60 rounded-xl p-1 card-glow">
                <div className="grid grid-cols-2 gap-1">
                  <button
                    type="button"
                    onClick={() => setCloseMethod("all")}
                    className={cn(
                      "flex flex-col items-center rounded-lg px-3 py-2.5 transition-all",
                      closeMethod === "all"
                        ? "bg-background shadow-sm"
                        : "hover:bg-muted/50"
                    )}
                  >
                    <span className={cn(
                      "text-sm font-medium",
                      closeMethod === "all" ? "text-foreground" : "text-muted-foreground"
                    )}>
                      {t.agent.closeAll}
                    </span>
                    <span className={cn(
                      "mt-0.5 text-xs",
                      closeMethod === "all" ? "text-muted-foreground" : "text-muted-foreground/60"
                    )}>
                      立即结算盈亏
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setCloseMethod("partial")}
                    className={cn(
                      "flex flex-col items-center rounded-lg px-3 py-2.5 transition-all",
                      closeMethod === "partial"
                        ? "bg-background shadow-sm"
                        : "hover:bg-muted/50"
                    )}
                  >
                    <span className={cn(
                      "text-sm font-medium",
                      closeMethod === "partial" ? "text-foreground" : "text-muted-foreground"
                    )}>
                      {t.agent.closePartial}
                    </span>
                    <span className={cn(
                      "mt-0.5 text-xs",
                      closeMethod === "partial" ? "text-muted-foreground" : "text-muted-foreground/60"
                    )}>
                      按比例平仓
                    </span>
                  </button>
                </div>
              </div>

              {/* 部分平仓时显示百分比输入 */}
              {closeMethod === "partial" && (
                <div className="rounded-lg border border-border/60 bg-muted/20 px-4 py-3 space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-muted-foreground">平掉</span>
                    <input
                      type="number"
                      value={partialPercent}
                      onChange={(e) => setPartialPercent(e.target.value)}
                      min="1"
                      max="100"
                      className="w-16 rounded-lg border border-border/60 bg-background px-2 py-1.5 text-center text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                    <span className="text-sm text-muted-foreground">% 仓位</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{t.agent.closePartialDesc}</p>
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCloseDialogPosition(null)}>
              {t.nav.cancel}
            </Button>
            <Button onClick={() => setCloseDialogPosition(null)}>{t.agent.confirmClose}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={Boolean(shareDialogPosition)}
        onOpenChange={(open) => {
          if (!open) {
            setShareDialogPosition(null)
          }
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t.agent.shareRecord}</DialogTitle>
            <DialogDescription>{t.agent.shareRecordDesc}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="rounded-xl border border-border/60 bg-muted/20 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{shareDialogPosition?.pair}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{shareDialogPosition?.side}</p>
                </div>
                <div className="text-right">
                  <p className={`text-lg font-semibold ${shareDialogPosition?.pnl.startsWith("-") ? "text-red-400" : "text-emerald-400"}`}>
                    {shareDialogPosition?.pnl}
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">收益率</p>
                </div>
              </div>

              <div className="mt-4 rounded-lg bg-card px-3 py-2">
                <div className="flex items-end justify-between gap-1 h-16">
                  {[35, 42, 38, 55, 48, 62, 58, 75, 68, 82].map((height, i) => (
                    <div
                      key={i}
                      className={`flex-1 rounded-sm ${shareDialogPosition?.pnl.startsWith("-") ? "bg-red-400/60" : "bg-emerald-400/60"}`}
                      style={{ height: `${height}%` }}
                    />
                  ))}
                </div>
                <div className="mt-2 flex justify-between text-[10px] text-muted-foreground">
                  <span>买入</span>
                  <span>持有期</span>
                  <span>平仓</span>
                </div>
              </div>

              <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-muted-foreground">{t.agent.entryPrice}</p>
                  <p className="font-medium">{shareDialogPosition?.entryPrice}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">{t.agent.exitPrice}</p>
                  <p className="font-medium">{shareDialogPosition?.exitPrice}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">{t.agent.buyAmount}</p>
                  <p className="font-medium">{shareDialogPosition?.buyAmount}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">{t.agent.addCount}</p>
                  <p className="font-medium">{shareDialogPosition?.addCount} 次</p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-sm font-medium">{t.agent.shareTo}</p>
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" className="justify-center">
                  <Share2Icon className="mr-2 size-4" />
                  Telegram
                </Button>
                <Button variant="outline" className="justify-center">
                  <Share2Icon className="mr-2 size-4" />
                  X / Twitter
                </Button>
                <Button variant="outline" className="justify-center">
                  <Share2Icon className="mr-2 size-4" />
                  微信
                </Button>
                <Button variant="outline" className="justify-center">
                  <Share2Icon className="mr-2 size-4" />
                  {t.agent.copyLink}
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isLeaderboardOpen} onOpenChange={setIsLeaderboardOpen}>
        <DialogContent className="sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>{t.home.revenueLeaderboard}</DialogTitle>
            <DialogDescription>
              展示当前周期内收益表现靠前的账户摘要，共展示前 100 名。
            </DialogDescription>
          </DialogHeader>
          <div className="max-h-[50vh] space-y-3 overflow-y-auto pr-1">
            {extendedLeaderboard.map((entry, index) => (
              <div
                key={entry.rank}
                className="flex items-center gap-4 rounded-xl border border-border/60 px-4 py-3"
              >
                <div
                  className={`flex size-9 shrink-0 items-center justify-center rounded-full text-sm font-medium ${
                    index === 0
                      ? "bg-[#ffd036] text-[#333333]"
                      : index === 1
                        ? "bg-[#e5e5e5] text-[#272727]"
                        : index === 2
                          ? "bg-[#905e3d] text-[#000000]"
                          : "bg-[rgba(95,95,95,0.15)] text-[#e2e8f0]"
                  }`}
                >
                  {entry.rank}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium">
                    {entry.name}
                  </div>
                  <div className="mt-0.5 text-xs text-muted-foreground">
                    {t.home.cumulativeDuration}{entry.runtime} · {t.home.roiLabel}{entry.roi}
                  </div>
                </div>
                <div className="shrink-0 text-right">
                  <div className="text-sm font-semibold">{entry.income}</div>
                  <div className="mt-0.5 text-xs text-muted-foreground">
                    {t.home.monthlyRevenue}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-border/60 pt-4">
            <p className="mb-2 text-xs font-medium text-muted-foreground">{t.home.myRank}</p>
            <div className="flex items-center gap-4 rounded-xl border border-primary/30 bg-primary/5 px-4 py-3">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-medium text-primary-foreground">
                {currentUserPosition.rank}
              </div>
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-medium">
                  {currentUserPosition.name}
                </div>
                <div className="mt-0.5 text-xs text-muted-foreground">
                  {t.home.cumulativeDuration}{currentUserPosition.runtime} · {t.home.roiLabel}{currentUserPosition.roi}
                </div>
              </div>
              <div className="shrink-0 text-right">
                <div className="text-sm font-semibold text-primary">{currentUserPosition.income}</div>
                <div className="mt-0.5 text-xs text-muted-foreground">
                  {t.home.monthlyRevenue}
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isAutoTradeConfigOpen} onOpenChange={setIsAutoTradeConfigOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t.agent.autoTradeConfig}</DialogTitle>
          </DialogHeader>

          <div className="space-y-5">
            {/* 一、金额配置 */}
            <div className="space-y-3">
              <p className="text-sm font-medium">{t.agent.amountConfig}</p>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setTradeAmountAuto(false)}
                  className={cn(
                    "rounded-full border px-3 py-1.5 text-sm transition-colors",
                    !tradeAmountAuto
                      ? "border-foreground/80 bg-foreground text-background"
                      : "border-border/60 bg-background text-muted-foreground hover:border-foreground/30"
                  )}
                >
                  {tradeAmount}
                </button>
                <button
                  type="button"
                  onClick={() => setTradeAmountAuto(true)}
                  className={cn(
                    "rounded-full border px-3 py-1.5 text-sm transition-colors",
                    tradeAmountAuto
                      ? "border-foreground/80 bg-foreground text-background"
                      : "border-border/60 bg-background text-muted-foreground hover:border-foreground/30"
                  )}
                >
                  {t.agent.aiAutoDecide}
                </button>
              </div>
              {!tradeAmountAuto && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">每笔交易对首次买入金额为交易账户里金额的</span>
                  <Input
                    value={tradeAmount}
                    onChange={(e) => setTradeAmount(e.target.value)}
                    placeholder="10%"
                    className="w-20 h-8 text-sm text-center"
                  />
                </div>
              )}
            </div>

            {/* 二、策略选型配置 */}
            <div className="space-y-3">
              <p className="text-sm font-medium">二、策略选型配置</p>
              <div className="flex flex-wrap gap-2">
                {(["稳健型", "平衡型", "成长型", "AI根据市场自动决策"] as const).map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setTradeStrategy(option === "AI根据市场自动决策" ? "auto" : option)}
                    className={cn(
                      "rounded-full border px-3 py-1.5 text-sm transition-colors",
                      (option === "AI根据市场自动决策" ? tradeStrategy === "auto" : tradeStrategy === option)
                        ? "border-foreground/80 bg-foreground text-background"
                        : "border-border/60 bg-background text-muted-foreground hover:border-foreground/30"
                    )}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            {/* 三、平仓配置 */}
            <div className="space-y-3">
              <p className="text-sm font-medium">{t.agent.closeThresholdConfig}</p>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setCloseThresholdAuto(false)}
                  className={cn(
                    "rounded-full border px-3 py-1.5 text-sm transition-colors",
                    !closeThresholdAuto
                      ? "border-foreground/80 bg-foreground text-background"
                      : "border-border/60 bg-background text-muted-foreground hover:border-foreground/30"
                  )}
                >
                  {closeThreshold}
                </button>
                <button
                  type="button"
                  onClick={() => setCloseThresholdAuto(true)}
                  className={cn(
                    "rounded-full border px-3 py-1.5 text-sm transition-colors",
                    closeThresholdAuto
                      ? "border-foreground/80 bg-foreground text-background"
                      : "border-border/60 bg-background text-muted-foreground hover:border-foreground/30"
                  )}
                >
                  {t.agent.aiAutoDecide}
                </button>
              </div>
              {!closeThresholdAuto && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">{t.agent.lessThanInvested}</span>
                  <Input
                    value={closeThreshold}
                    onChange={(e) => setCloseThreshold(e.target.value)}
                    placeholder="10%"
                    className="w-20 h-8 text-sm text-center"
                  />
                  <span className="text-sm text-muted-foreground">进行平仓</span>
                </div>
              )}
            </div>

            {/* 底部提示 */}
            <div className="rounded-lg bg-muted/50 px-3 py-2.5">
              <p className="text-xs text-muted-foreground">
                {t.agent.maWarning}
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAutoTradeConfigOpen(false)}>
              {t.nav.cancel}
            </Button>
            <Button
              onClick={() => {
                setIsAutoTradeEnabled(true)
                setIsAutoTradeConfigOpen(false)
              }}
            >
              {t.agent.confirmEnable}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
