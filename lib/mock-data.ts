export type HomeMetric = {
  title: string
  value: string
  delta: string
  trend: "up" | "down"
  detail: string
}

export type ChartPoint = {
  date: string
  income: number
  volume: number
}

export type LeaderboardEntry = {
  rank: number
  name: string
  runtime: string
  roi: string
  income: string
}

export type TradeRecord = {
  id: string
  skill: string
  type: string
  amount: string
  pair: string
  status: string
  time: string
  profit?: string
  price?: string
  maCost?: string
}

export type AnnouncementItem = {
  id: string
  title: string
  content: string
}

export type Announcement = {
  id: string
  badge: string
  title: string
  summary: string
  date: string
  body: string
  items?: AnnouncementItem[]
}

export type AgentPosition = {
  id: string
  pair: string
  side: "做多" | "做空"
  buyAmount: string
  entryPrice: string
  currentPrice?: string
  exitPrice?: string
  pnl: string
  condition: string
  addCount: number
  status: "进行中" | "已完成"
}

export type AgentConfig = {
  slug: AgentChannel
  title: string
  badge: string
  statusNote: string
  latestPrice: string
  markPrice: string
  tradeId: string
  trigger: string
  investRange: string
  maxAdd: string
  maCost: string
  defaultAmount: string
  strategyConversation: string[]
  normalConversation: string[]
  history: string[]
  positions: AgentPosition[]
  trades: TradeRecord[]
  accountSummary: {
    accountName: string
    totalAssets: string
    fundingAssets: string
    tradingAssets: string
  }
  yieldSummary: {
    strategies: string
    runtime: string
    invested: string
    roi: string
  }
}

export type WalletRecord = {
  id: string
  target: string
  type: string
  price: string
  amount: string
  tradePair: string
  maCost: string
  time: string
  revenue?: string
}

export type WalletTransferRecord = {
  id: string
  targetAddress: string
  type: string
  amount: string
  maCost: string
  time: string
}

export type ApiProviderConfig = {
  id: string
  name: string
  status: "已配置" | "未配置"
  helper: string
}

export type LeaderboardUserPosition = {
  rank: number
  name: string
  runtime: string
  roi: string
  income: string
  isCurrentUser: boolean
}

export type ChainOption = {
  id: string
  name: string
  network: string
  fee: string
  confirmTime: string
}

export type AutoTradeConfig = {
  amount: number
  strategy: "保守" | "稳健" | "激进"
  maxPositions: number
  stopLoss: number
  takeProfit: number
  autoCloseEnabled: boolean
}

export type AccountSettingItem = {
  id: string
  title: string
  description: string
  action: string
}

export const agentChannels = ["binance", "okx", "madex"] as const
export type AgentChannel = (typeof agentChannels)[number]

export const homeMetrics: HomeMetric[] = [
  {
    title: "昨日交易笔数",
    value: "89,138",
    delta: "+25",
    trend: "up",
    detail: "较昨日继续放量",
  },
  {
    title: "昨日收益",
    value: "9,638 U",
    delta: "+45 U",
    trend: "up",
    detail: "策略回撤维持稳定",
  },
  {
    title: "智能体数量",
    value: "3",
    delta: "+1",
    trend: "up",
    detail: "当前运行中的核心渠道",
  },
  {
    title: "累计收益",
    value: "965,241 U",
    delta: "+6.8%",
    trend: "up",
    detail: "平台累计交易收益",
  },
]

export const homeChartData: ChartPoint[] = [
  { date: "2026-03-10", income: 32, volume: 51 },
  { date: "2026-03-11", income: 64, volume: 73 },
  { date: "2026-03-12", income: 84, volume: 70 },
  { date: "2026-03-13", income: 71, volume: 22 },
  { date: "2026-03-14", income: 79, volume: 62 },
  { date: "2026-03-15", income: 28, volume: 58 },
  { date: "2026-03-16", income: 69, volume: 46 },
  { date: "2026-03-17", income: 43, volume: 25 },
  { date: "2026-03-18", income: 22, volume: 51 },
  { date: "2026-03-19", income: 74, volume: 19 },
]

export const leaderboard: LeaderboardEntry[] = [
  { rank: 1, name: "CryptoKing", runtime: "186h", roi: "94%", income: "23,412,542 U" },
  { rank: 2, name: "Labubu", runtime: "172h", roi: "88%", income: "19,608,231 U" },
  { rank: 3, name: "Moonlane", runtime: "160h", roi: "84%", income: "16,942,118 U" },
  { rank: 4, name: "ETH Pilot", runtime: "148h", roi: "77%", income: "14,508,433 U" },
  { rank: 5, name: "BNB Cycle", runtime: "135h", roi: "72%", income: "12,194,020 U" },
  { rank: 6, name: "Delta Wolf", runtime: "128h", roi: "69%", income: "10,842,116 U" },
  { rank: 7, name: "Quant Mist", runtime: "121h", roi: "66%", income: "9,774,530 U" },
  { rank: 8, name: "Signal Forge", runtime: "116h", roi: "62%", income: "8,996,214 U" },
  { rank: 9, name: "Orion Path", runtime: "108h", roi: "58%", income: "7,618,409 U" },
  { rank: 10, name: "North Grid", runtime: "96h", roi: "53%", income: "6,204,880 U" },
]

export const extendedLeaderboard: LeaderboardEntry[] = [
  ...leaderboard,
  { rank: 11, name: "Alpha Wave", runtime: "92h", roi: "51%", income: "5,842,116 U" },
  { rank: 12, name: "Crypto Nova", runtime: "88h", roi: "49%", income: "5,421,880 U" },
  { rank: 13, name: "Steady Gain", runtime: "85h", roi: "47%", income: "5,108,433 U" },
  { rank: 14, name: "Risk Master", runtime: "82h", roi: "45%", income: "4,896,214 U" },
  { rank: 15, name: "Trend Rider", runtime: "78h", roi: "43%", income: "4,618,409 U" },
  { rank: 16, name: "Market Pulse", runtime: "75h", roi: "41%", income: "4,342,542 U" },
  { rank: 17, name: "Volatility Pro", runtime: "72h", roi: "39%", income: "4,108,231 U" },
  { rank: 18, name: "Swing Trader", runtime: "68h", roi: "37%", income: "3,842,118 U" },
  { rank: 19, name: "Momentum X", runtime: "65h", roi: "35%", income: "3,608,433 U" },
  { rank: 20, name: "Grid Master", runtime: "62h", roi: "33%", income: "3,396,214 U" },
  { rank: 21, name: "Scalp King", runtime: "58h", roi: "31%", income: "3,118,409 U" },
  { rank: 22, name: "Arbitrage Bot", runtime: "55h", roi: "29%", income: "2,942,542 U" },
  { rank: 23, name: "HODL Pro", runtime: "52h", roi: "27%", income: "2,708,231 U" },
  { rank: 24, name: "DCA Master", runtime: "48h", roi: "25%", income: "2,542,118 U" },
  { rank: 25, name: "Breakout Hunter", runtime: "45h", roi: "23%", income: "2,308,433 U" },
  { rank: 26, name: "Penny Hunter", runtime: "42h", roi: "21%", income: "2,104,221 U" },
  { rank: 27, name: "Chain Breaker", runtime: "40h", roi: "19%", income: "1,928,445 U" },
  { rank: 28, name: "Flash Trade", runtime: "38h", roi: "17%", income: "1,786,332 U" },
  { rank: 29, name: "Bull Run", runtime: "36h", roi: "15%", income: "1,654,118 U" },
  { rank: 30, name: "Bear Trap", runtime: "34h", roi: "13%", income: "1,512,906 U" },
  { rank: 31, name: "Token Scanner", runtime: "32h", roi: "11%", income: "1,398,742 U" },
  { rank: 32, name: "Alpha Seeker", runtime: "30h", roi: "9%", income: "1,286,554 U" },
  { rank: 33, name: "Bit Rider", runtime: "28h", roi: "8%", income: "1,162,331 U" },
  { rank: 34, name: "Ether Edge", runtime: "26h", roi: "7%", income: "1,048,227 U" },
  { rank: 35, name: "Sol Scout", runtime: "24h", roi: "6%", income: "942,115 U" },
  { rank: 36, name: "Chain Charmer", runtime: "22h", roi: "5%", income: "836,902 U" },
  { rank: 37, name: "Moon Walker", runtime: "20h", roi: "4%", income: "724,668 U" },
  { rank: 38, name: "Star Gazer", runtime: "19h", roi: "3%", income: "618,445 U" },
  { rank: 39, name: "Degen King", runtime: "18h", roi: "2%", income: "512,332 U" },
  { rank: 40, name: "Whale Watcher", runtime: "17h", roi: "1%", income: "408,119 U" },
  { rank: 41, name: "Fomo Finder", runtime: "16h", roi: "0.8%", income: "312,556 U" },
  { rank: 42, name: "Sniper Bot", runtime: "15h", roi: "0.6%", income: "228,441 U" },
  { rank: 43, name: "Lambo Dream", runtime: "14h", roi: "0.4%", income: "156,328 U" },
  { rank: 44, name: "To The Moon", runtime: "13h", roi: "0.3%", income: "98,215 U" },
  { rank: 45, name: "Diamond Hands", runtime: "12h", roi: "0.2%", income: "62,104 U" },
  { rank: 46, name: "Paper Hands", runtime: "11h", roi: "0.1%", income: "38,992 U" },
  { rank: 47, name: "Quick Profit", runtime: "10h", roi: "0.06%", income: "21,442 U" },
  { rank: 48, name: "First Step", runtime: "9h", roi: "0.02%", income: "8,768 U" },
  { rank: 49, name: "Baby Whale", runtime: "8h", roi: "0.01%", income: "3,654 U" },
  { rank: 50, name: "Tiny Fish", runtime: "7h", roi: "0.005%", income: "1,542 U" },
]

export const currentUserPosition: LeaderboardUserPosition = {
  rank: 47,
  name: "CryptoKing",
  runtime: "36h",
  roi: "68.3%",
  income: "1,826.00 U",
  isCurrentUser: true,
}

export const chainOptions: ChainOption[] = [
  { id: "clawmask", name: "Clawmask Chain", network: "Clawmask", fee: "0 MA", confirmTime: "~3 confirmations" },
  { id: "erc20", name: "ETH (ERC20)", network: "Ethereum", fee: "0.005 ETH", confirmTime: "~12 confirmations" },
  { id: "bep20", name: "BNB (BEP20)", network: "BNB Smart Chain", fee: "0.001 BNB", confirmTime: "~15 confirmations" },
  { id: "trc20", name: "TRX (TRC20)", network: "Tron", fee: "1 TRX", confirmTime: "~20 confirmations" },
  { id: "matic", name: "MATIC (Polygon)", network: "Polygon", fee: "0.001 MATIC", confirmTime: "~128 confirmations" },
  { id: "kyc", name: "KYC(KYC)", network: "KYC", fee: "0 KYC", confirmTime: "~1 confirmation" },
]

export const defaultAutoTradeConfig: AutoTradeConfig = {
  amount: 100,
  strategy: "稳健",
  maxPositions: 5,
  stopLoss: 2,
  takeProfit: 5,
  autoCloseEnabled: true,
}

export const homeTrades: TradeRecord[] = [
  {
    id: "TVVDFAE89765",
    skill: "欧易智能体 Skill",
    type: "买入",
    amount: "1,280 U",
    pair: "USDT/BTC 永续",
    status: "已完成",
    time: "2026-03-10 10:21:18",
    profit: "+0.18 MA",
  },
  {
    id: "TVVDFAE89766",
    skill: "币安智能体 Skill",
    type: "卖出",
    amount: "1,000 U",
    pair: "USDT/BNB 永续",
    status: "已完成",
    time: "2026-03-10 10:20:00",
    profit: "+128.0 U",
  },
  {
    id: "TVVDFAE89767",
    skill: "MADEX 智能体 Skill",
    type: "平仓",
    amount: "1,998 U",
    pair: "USDT/ETH 永续",
    status: "已完成",
    time: "2026-03-10 10:19:38",
    profit: "+228.6 U",
  },
  {
    id: "TVVDFAE89768",
    skill: "币安智能体 Skill",
    type: "平仓",
    amount: "1,998 U",
    pair: "USDT/ETH 永续",
    status: "处理中",
    time: "2026-03-10 10:10:38",
    profit: "+28.6 U",
  },
  {
    id: "TVVDFAE89769",
    skill: "欧易智能体 Skill",
    type: "买入",
    amount: "860 U",
    pair: "USDT/SOL 永续",
    status: "已完成",
    time: "2026-03-10 10:06:12",
    profit: "+63.0 U",
  },
  {
    id: "TVVDFAE89770",
    skill: "MADEX 智能体 Skill",
    type: "卖出",
    amount: "1,120 U",
    pair: "USDT/MA 永续",
    status: "已完成",
    time: "2026-03-10 10:02:47",
    profit: "+84.5 U",
  },
  {
    id: "TVVDFAE89771",
    skill: "币安智能体 Skill",
    type: "平仓",
    amount: "2,240 U",
    pair: "USDT/BTC 永续",
    status: "已完成",
    time: "2026-03-10 09:58:30",
    profit: "+201.2 U",
  },
  {
    id: "TVVDFAE89772",
    skill: "欧易智能体 Skill",
    type: "买入",
    amount: "780 U",
    pair: "USDT/ETH 永续",
    status: "处理中",
    time: "2026-03-10 09:53:08",
    profit: "+12.4 U",
  },
  {
    id: "TVVDFAE89773",
    skill: "MADEX 智能体 Skill",
    type: "卖出",
    amount: "640 U",
    pair: "USDT/BNB 永续",
    status: "已完成",
    time: "2026-03-10 09:47:55",
    profit: "+39.7 U",
  },
  {
    id: "TVVDFAE89774",
    skill: "币安智能体 Skill",
    type: "买入",
    amount: "1,560 U",
    pair: "USDT/XRP 永续",
    status: "已完成",
    time: "2026-03-10 09:42:19",
    profit: "+92.0 U",
  },
  {
    id: "TVVDFAE89775",
    skill: "欧易智能体 Skill",
    type: "平仓",
    amount: "980 U",
    pair: "USDT/ADA 永续",
    status: "已完成",
    time: "2026-03-10 09:36:41",
    profit: "+47.8 U",
  },
  {
    id: "TVVDFAE89776",
    skill: "MADEX 智能体 Skill",
    type: "买入",
    amount: "1,320 U",
    pair: "USDT/ETH 永续",
    status: "处理中",
    time: "2026-03-10 09:31:16",
    profit: "+18.3 U",
  },
]

export const announcements: Announcement[] = [
  {
    id: "notice-1",
    badge: "系统",
    title: "关于系统升级维护通知",
    summary: "为了提升平台稳定性和用户体验，我们将在 3 月 18 日进行系统升级，期间部分策略会短暂停止执行。",
    date: "2026-03-10",
    body: "为了提升平台稳定性和用户体验，我们将在 3 月 18 日进行系统升级，预计持续 3 个小时。维护期间，部分正在执行中的策略会被系统自动暂停，待维护结束后恢复运行。",
    items: [
      {
        id: "notice-1-item-1",
        title: "升级时间",
        content: "系统升级将于 2026 年 3 月 18 日凌晨 02:00 开始，预计持续 3 小时，届时用户无法登录和进行交易操作。请提前做好仓位管理。",
      },
      {
        id: "notice-1-item-2",
        title: "受影响功能",
        content: "升级期间，以下功能将暂时不可用：账户登录、策略创建与修改、自动交易执行、实时行情查看、收益数据更新。数据同步将在升级完成后自动恢复。",
      },
      {
        id: "notice-1-item-3",
        title: "恢复说明",
        content: "升级完成后，所有暂停的策略将自动恢复运行，无需手动操作。如遇到异常情况，请联系客服处理。",
      },
    ],
  },
  {
    id: "notice-2",
    badge: "公告",
    title: "新增欧易智能体 Skill 交易能力",
    summary: "平台已新增欧易智能体 Skill，支持策略推荐、自动交易与结果分享。",
    date: "2026-03-09",
    body: "平台已新增欧易智能体 Skill，当前支持永续交易策略推荐、自动化参数配置、仓位结果查看与战绩分享。后续将扩展更丰富的后台策略类型。",
    items: [
      {
        id: "notice-2-item-1",
        title: "永续交易策略",
        content: "全新上线的永续交易策略支持做多/做空双向操作，用户可根据市场行情选择合适的开仓方向，系统会自动管理仓位和止盈止损。",
      },
      {
        id: "notice-2-item-2",
        title: "自动化参数配置",
        content: "提供灵活的参数设置，包括开仓比例、加仓次数、止盈止损点位等。用户可自定义风险偏好，系统会根据设置自动执行交易。",
      },
      {
        id: "notice-2-item-3",
        title: "战绩分享功能",
        content: "用户可将智能体的交易战绩生成分享图片，展示收益率和成功率。分享内容包括账户昵称、收益率和交易周期等关键信息。",
      },
    ],
  },
  {
    id: "notice-3",
    badge: "公告",
    title: "排行榜统计口径更新",
    summary: "收益排行榜已统一为按本月已结算收益排序，历史未结算仓位不计入榜单。",
    date: "2026-03-08",
    body: "为了让收益表现更具可比性，平台已将排行榜统计口径调整为按本月已结算收益排序，未平仓位收益不会纳入当前榜单。调整后，各渠道智能体的榜单展示将保持一致。",
    items: [
      {
        id: "notice-3-item-1",
        title: "统计规则说明",
        content: "排行榜仅统计已平仓的收益，未平仓位的浮动盈亏不计入排名。这确保了榜单数据的公平性和准确性，避免虚高收益误导用户。",
      },
      {
        id: "notice-3-item-2",
        title: "时间周期",
        content: "榜单按月统计，每月1日00:00重新开始计算。每月的收益数据将在次月第一天凌晨更新并生成新榜单。",
      },
      {
        id: "notice-3-item-3",
        title: "多渠道统一",
        content: "此次调整后，APP、Web 和 API 三个渠道的排行榜数据将保持完全一致，用户可在任意平台查看相同排名信息。",
      },
    ],
  },
  {
    id: "notice-4",
    badge: "系统",
    title: "夜间数据同步窗口提醒",
    summary: "每日 02:00 至 02:15 将执行账户与成交数据同步，期间部分统计数据可能延迟更新。",
    date: "2026-03-07",
    body: "为保证账户资产、交易流水和排行榜统计的一致性，平台会在每日 02:00 至 02:15 执行夜间同步。同步期间，首页交易记录和收益图表可能存在短暂延迟，完成后会自动恢复正常。",
    items: [
      {
        id: "notice-4-item-1",
        title: "同步内容",
        content: "每日凌晨进行的同步操作包括：账户余额更新、成交记录归档、排行榜数据计算、收益统计汇总。同步完成后，所有数据将保持一致。",
      },
      {
        id: "notice-4-item-2",
        title: "用户注意事项",
        content: "在同步期间（02:00-02:15），建议避免进行重要操作。部分实时数据可能出现短暂差异，同步完成后将自动修正。",
      },
    ],
  },
  {
    id: "notice-5",
    badge: "公告",
    title: "新增交易记录详情字段",
    summary: "交易记录已支持展示收益字段，便于快速判断单笔策略表现。",
    date: "2026-03-06",
    body: "平台已在交易记录中补充收益字段，方便在首页和详情弹窗中快速查看单笔成交表现。后续还会继续补充更多摘要字段，但不会影响现有页面结构和使用节奏。",
    items: [
      {
        id: "notice-5-item-1",
        title: "收益字段说明",
        content: "交易记录新增「收益」字段，直接显示每笔交易的盈利或亏损金额。正数表示盈利，负数表示亏损，一目了然。",
      },
      {
        id: "notice-5-item-2",
        title: "收益计算方式",
        content: "收益按照平仓价格与开仓价格的差额计算，并扣除交易手续费。用户可在详情弹窗中查看完整的收益计算明细。",
      },
      {
        id: "notice-5-item-3",
        title: "后续规划",
        content: "平台将持续优化交易记录展示，后续计划添加收益率、持仓时长、风控触发记录等字段，帮助用户更全面地分析交易表现。",
      },
    ],
  },
]

const sharedPositions: AgentPosition[] = [
  {
    id: "ma587765461",
    pair: "USDT/ETH 永续",
    side: "做多",
    buyAmount: "100 U",
    entryPrice: "1205.00",
    currentPrice: "1365",
    pnl: "+28.01 U",
    condition: "跌 0.5% 加仓，单周期止盈盈利 1%",
    addCount: 2,
    status: "进行中",
  },
  {
    id: "ma587765463",
    pair: "USDT/MA 永续",
    side: "做空",
    buyAmount: "100 U",
    entryPrice: "1205.00",
    currentPrice: "1365",
    pnl: "+128.01 U",
    condition: "跌 0.5% 加仓，单周期止盈盈利 1%",
    addCount: 2,
    status: "进行中",
  },
  {
    id: "ma587765465",
    pair: "USDT/BNB 永续",
    side: "做多",
    buyAmount: "100 U",
    entryPrice: "1205.00",
    exitPrice: "1365",
    pnl: "-8.01 U",
    condition: "跌 0.5% 加仓，单周期止盈盈利 1%",
    addCount: 2,
    status: "已完成",
  },
]

export const agentConfigs: Record<AgentChannel, AgentConfig> = {
  binance: {
    slug: "binance",
    title: "币安智能体 Skill",
    badge: "Binance",
    statusNote: "智能体启动中，5 秒之后开始推送交易策略",
    latestPrice: "2042.49",
    markPrice: "2042.45",
    tradeId: "MA587765461",
    trigger: "跌 0.5% 加仓，单周期止盈盈利 1%",
    investRange: "最低 10 U，最高 5000 U",
    maxAdd: "8",
    maCost: "0.18 MA",
    defaultAmount: "10",
    strategyConversation: [
      "已为你选择更偏稳健的 ETH 永续交易建议。",
      "如果开启 AI 自动化交易，我会按后台配置继续推送策略。",
    ],
    normalConversation: [
      "今天整体波动偏高，建议留意加仓节奏。",
      "当前收益率表现稳定，可以观察已完成仓位的回收情况。",
    ],
    history: [
      "09:30 推送 ETH 做多策略",
      "09:45 平掉上一周期 BTC 仓位",
      "10:00 新增 BNB 跟随单",
    ],
    positions: sharedPositions,
    trades: homeTrades,
    accountSummary: {
      accountName: "CryptoKing",
      totalAssets: "100,000 U",
      fundingAssets: "50,000 U",
      tradingAssets: "50,000 U",
    },
    yieldSummary: {
      strategies: "18",
      runtime: "36 小时",
      invested: "1826.00",
      roi: "68.3%",
    },
  },
  okx: {
    slug: "okx",
    title: "欧易智能体 Skill",
    badge: "OKX",
    statusNote: "欧易策略池已同步，等待下一轮推送",
    latestPrice: "1986.24",
    markPrice: "1985.88",
    tradeId: "OKX227654301",
    trigger: "上破区间后跟随，回撤 0.4% 补仓",
    investRange: "最低 20 U，最高 3000 U",
    maxAdd: "6",
    maCost: "0.15 MA",
    defaultAmount: "20",
    strategyConversation: [
      "欧易渠道当前偏好更快节奏的趋势单。",
      "系统已减少加仓次数，提高策略回收效率。",
    ],
    normalConversation: [
      "如果你偏好更保守的结果，可以只保留手动执行。",
      "当前资金账户健康，可以继续观察新策略。",
    ],
    history: [
      "08:50 推送 BTC 趋势策略",
      "09:20 新增 ETH 回撤跟随策略",
      "10:05 平掉上一轮短线单",
    ],
    positions: sharedPositions.map((item, index) => ({
      ...item,
      id: `${item.id}-okx-${index}`,
      pnl: index === 1 ? "+96.40 U" : item.pnl,
    })),
    trades: homeTrades.map((trade) => ({
      ...trade,
      skill: "欧易智能体 Skill",
    })),
    accountSummary: {
      accountName: "CryptoKing",
      totalAssets: "86,240 U",
      fundingAssets: "41,240 U",
      tradingAssets: "45,000 U",
    },
    yieldSummary: {
      strategies: "12",
      runtime: "24 小时",
      invested: "1360.00",
      roi: "52.4%",
    },
  },
  madex: {
    slug: "madex",
    title: "MADEX 智能体 Skill",
    badge: "MADEX",
    statusNote: "MADEX 渠道策略以后台演示数据为主",
    latestPrice: "1.42",
    markPrice: "1.39",
    tradeId: "MDX771065021",
    trigger: "量能放大后进入，跌 0.3% 补仓",
    investRange: "最低 30 U，最高 2000 U",
    maxAdd: "5",
    maCost: "0.12 MA",
    defaultAmount: "30",
    strategyConversation: [
      "MADEX 渠道当前以 Demo 策略演示为主。",
      "建议保留字段结构，后续由后台替换正式策略。",
    ],
    normalConversation: [
      "当前内容主要展示前端承接能力，不强调策略细节。",
      "你可以继续用这套页面展示多渠道统一体验。",
    ],
    history: [
      "09:10 展示 Demo 永续策略",
      "09:50 更新演示收益数据",
      "10:15 新增 MA 相关交易对",
    ],
    positions: sharedPositions.map((item, index) => ({
      ...item,
      id: `${item.id}-mdx-${index}`,
      pair: index === 1 ? "MA/USDT 永续" : item.pair,
    })),
    trades: homeTrades.map((trade, index) => ({
      ...trade,
      id: `MAD-${index + 1}`,
      skill: "MADEX 智能体 Skill",
    })),
    accountSummary: {
      accountName: "CryptoKing",
      totalAssets: "65,300 U",
      fundingAssets: "25,300 U",
      tradingAssets: "40,000 U",
    },
    yieldSummary: {
      strategies: "9",
      runtime: "18 小时",
      invested: "960.00",
      roi: "41.8%",
    },
  },
}

export const walletSummary = {
  owner: "CryptoKing",
  address: "MA654165******1d6E5",
  balance: "300 MA",
  howToEarn: "如何赚取 MA？",
}

export const walletTradeRecords: WalletRecord[] = [
  { id: "MA587765461", target: "币安智能体 Skill", type: "买入", price: "2,042.49", amount: "1,280 U", tradePair: "USDT/BTC 永续", maCost: "-0.18 MA", time: "2026-03-10 10:21:18", revenue: "+128.0 U" },
  { id: "MA587765462", target: "币安智能体 Skill", type: "卖出", price: "1,986.24", amount: "1,000 U", tradePair: "USDT/BNB 永续", maCost: "-0.18 MA", time: "2026-03-10 10:20:00", revenue: "+45.2 U" },
  { id: "MA587765463", target: "欧易智能体 Skill", type: "平台", price: "1,205.00", amount: "1,998 U", tradePair: "USDT/ETH 永续", maCost: "-0.18 MA", time: "2026-03-10 10:19:38", revenue: "+28.6 U" },
  { id: "MA587765464", target: "MADEX 智能体 Skill", type: "买入", price: "1.42", amount: "1,280 U", tradePair: "USDT/MA 永续", maCost: "-0.18 MA", time: "2026-03-10 10:10:38", revenue: "-" },
]

export const walletTransferRecords: WalletTransferRecord[] = [
  { id: "MA587765461", targetAddress: "MA654165*****1d6E5", type: "充币", amount: "280 MA", maCost: "-1.18 MA", time: "2026-03-10 10:21:18" },
  { id: "MA587765462", targetAddress: "MA654165*****1d6E5", type: "充币", amount: "000 MA", maCost: "1.18 MA", time: "2026-03-10 10:20:00" },
  { id: "MA587765463", targetAddress: "MA654165*****1d6E5", type: "平仓", amount: "998 MA", maCost: "", time: "2026-03-10 10:19:38" },
  { id: "MA587765464", targetAddress: "MA654165*****1d6E5", type: "充币", amount: "1,998 MA", maCost: "", time: "2026-03-10 10:10:38" },
  { id: "MA587765465", targetAddress: "MA654165*****1d6E5", type: "提币", amount: "1,280 MA", maCost: "", time: "2026-03-10 10:21:18" },
  { id: "MA587765466", targetAddress: "MA654165*****1d6E5", type: "提币", amount: "1,000 MA", maCost: "", time: "2026-03-10 10:20:00" },
  { id: "MA587765467", targetAddress: "MA654165*****1d6E5", type: "转账", amount: "1,280 MA", maCost: "", time: "2026-03-10 10:19:38" },
  { id: "MA587765468", targetAddress: "MA654165*****1d6E5", type: "转账", amount: "1,280 MA", maCost: "", time: "2026-03-10 10:10:38" },
]

export const settingsOverview = [
  { title: "API 配置状态", value: "2 / 2", helper: "币安与欧易均已接入" },
  { title: "账户安全状态", value: "良好", helper: "建议定期更新登录与资金密码" },
]

export const apiProviders: ApiProviderConfig[] = [
  { id: "binance", name: "币安 API", status: "已配置", helper: "配置您的交易 API，即可使用智能体交易" },
  { id: "okx", name: "欧易 API", status: "未配置", helper: "建议完成连接测试后再开启自动化交易" },
]

export const accountSettings: AccountSettingItem[] = [
  { id: "phone", title: "变更手机号", description: "当前手机号：133****6589", action: "修改" },
  { id: "login-password", title: "修改登录密码", description: "定期修改密码，保护账户安全", action: "修改" },
  { id: "email", title: "绑定邮箱", description: "绑定邮箱，接收重要通知", action: "绑定" },
  { id: "username", title: "修改用户名", description: "当前用户名：MA168746516", action: "修改" },
  { id: "fund-password", title: "修改资金密码", description: "定期修改密码，保护资金安全", action: "修改" },
]
