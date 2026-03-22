"use client"

import * as React from "react"

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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  chainOptions,
  walletSummary,
  walletTradeRecords,
  walletTransferRecords,
  type WalletRecord,
  type WalletTransferRecord,
} from "@/lib/mock-data"
import { QrCodeIcon, ShareIcon } from "lucide-react"
import { useLocale } from "@/components/locale-provider"

type WalletDialog = "deposit" | "withdraw" | "transfer" | null

export function WalletDashboard() {
  const { t } = useLocale()

  const tradeTypeMap: Record<string, string> = {
    "买入": t.trade.type.buy,
    "卖出": t.trade.type.sell,
    "充币": t.trade.type.deposit,
    "提币": t.trade.type.withdraw,
  }

  const [tab, setTab] = React.useState<"trade" | "transfer">("trade")
  const [dialog, setDialog] = React.useState<WalletDialog>(null)
  const [selectedChain, setSelectedChain] = React.useState("clawmask")
  const [withdrawChain, setWithdrawChain] = React.useState("clawmask")
  const [depositCurrency, setDepositCurrency] = React.useState("MA")
  const [withdrawCurrency, setWithdrawCurrency] = React.useState("MA")
  const [transferCurrency, setTransferCurrency] = React.useState("MA")
  const records = (tab === "trade" ? walletTradeRecords : walletTransferRecords) as WalletRecord[] | WalletTransferRecord[]
  const selectedChainOption = chainOptions.find((c) => c.id === selectedChain)
  const withdrawChainOption = chainOptions.find((c) => c.id === withdrawChain)
  const currencyOptions = [
    { id: "MA", name: "MA" },
    { id: "KYC", name: "KYC" },
  ]

  return (
    <>
    <div className="dark:bg-white/5 bg-white/60 backdrop-blur-3xl rounded-2xl md:rounded-[32px] border dark:border-white/10 border-white/80 min-h-full p-4 md:p-8 dark:shadow-none card-glow">

          {/* User info */}
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 md:mb-8 gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 md:gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[var(--cm-primary)]/10 border border-[var(--cm-primary)]/30 text-[var(--cm-primary)] flex items-center justify-center dark:neon-border accent-glow">
                  <i className="ri-user-fill text-xl" />
                </div>
                <h2 className="text-base md:text-lg font-bold dark:text-white text-slate-800 tracking-tight">{walletSummary.owner}</h2>
              </div>
              <div className="flex items-center gap-2 text-xs md:text-sm flex-wrap">
                <span className="dark:text-white/30 text-slate-400">{t.wallet.walletAddress} :</span>
                <span className="text-[var(--cm-primary)]/80 font-mono text-xs">{walletSummary.address}</span>
                <button className="dark:text-white/40 text-slate-400 hover:text-[var(--cm-primary)] ml-1 text-xs transition-colors">{t.wallet.copy}</button>
                <button className="dark:text-white/40 text-slate-400 hover:text-[var(--cm-primary)] ml-1 text-xs transition-colors">{t.wallet.qrCode}</button>
              </div>
            </div>
            <span className="text-[var(--cm-primary)] text-xs font-bold hover:underline tracking-widest uppercase cursor-pointer">{t.wallet.earnMa}</span>
          </div>

          {/* Balance box */}
          <div className="w-full flex flex-col sm:flex-row items-center gap-3 sm:gap-0 mb-6 md:mb-8">
            <div className="w-full sm:w-[300px] flex items-center rounded-xl h-14 px-4 dark:bg-black/40 dark:border dark:border-white/10 dark:shadow-[0_0_10px_rgba(0,212,255,0.2),inset_0_0_5px_rgba(0,212,255,0.1)] bg-white/80 border border-slate-200/60 card-glow">
              <div className="flex items-center gap-2 dark:text-white/70 text-slate-500 border-r dark:border-white/10 border-slate-200 pr-4 mr-4 h-full py-2">
                <div className="w-6 h-6 dark:bg-white/10 bg-[var(--cm-primary)]/10 rounded-md text-[10px] text-[var(--cm-primary)] flex items-center justify-center font-bold border dark:border-white/5 border-[var(--cm-primary)]/15">C</div>
                <span className="text-sm font-bold dark:text-white/50 text-slate-400">MA</span>
              </div>
              <span className="text-xl font-bold dark:text-white text-slate-800 font-mono">{walletSummary.balance.replace(" MA", ".00")}</span>
            </div>
            <div className="w-full sm:w-[300px] flex items-center rounded-xl h-14 px-4 dark:bg-black/40 dark:border dark:border-white/10 dark:shadow-[0_0_10px_rgba(16,185,129,0.2),inset_0_0_5px_rgba(16,185,129,0.1)] bg-white/80 border border-slate-200/60 card-glow">
              <div className="flex items-center gap-2 dark:text-white/70 text-slate-500 border-r dark:border-white/10 border-slate-200 pr-4 mr-4 h-full py-2">
                <div className="w-6 h-6 dark:bg-white/10 bg-emerald-500/10 rounded-md text-[10px] text-emerald-500 flex items-center justify-center font-bold border dark:border-white/5 border-emerald-500/15">K</div>
                <span className="text-sm font-bold dark:text-white/50 text-slate-400">KYC</span>
              </div>
              <span className="text-xl font-bold dark:text-white text-slate-800 font-mono">300.00</span>
            </div>
          </div>

          {/* Action cards - 3 col grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 mb-8 md:mb-12">
            {/* Deposit card */}
            <div
              className="border border-[var(--cm-success)]/20 rounded-2xl md:rounded-3xl p-5 md:p-8 flex flex-row sm:flex-col items-center sm:justify-center sm:text-center hover:border-[var(--cm-success)]/50 transition-all group gap-4 sm:gap-0 cursor-pointer bg-gradient-to-br from-emerald-50 to-white dark:[background:rgba(0,0,0,0.4)]"
              onClick={() => setDialog("deposit")}
            >
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-[var(--cm-success)]/10 text-[var(--cm-success)] flex items-center justify-center sm:mb-4 border border-[var(--cm-success)]/30 group-hover:neon-green-glow transition-all flex-shrink-0">
                <i className="ri-arrow-down-line text-2xl sm:text-3xl font-bold" />
              </div>
              <div className="flex-1 sm:flex-initial">
                <h3 className="text-sm sm:text-base font-bold dark:text-white text-slate-700 sm:mb-2">{t.wallet.deposit}</h3>
                <p className="text-xs dark:text-white/30 text-slate-400 sm:mb-6">{t.wallet.depositDesc}</p>
              </div>
              <button
                className="w-auto sm:w-full px-5 sm:px-0 h-9 sm:h-10 rounded-xl bg-[var(--cm-success)] dark:text-black text-white text-xs sm:text-sm font-bold transition-all hover:scale-105 neon-green-glow flex-shrink-0"
                onClick={(e) => { e.stopPropagation(); setDialog("deposit") }}
              >
                {t.wallet.depositNow}
              </button>
            </div>

            {/* Withdraw card */}
            <div
              className="border border-[var(--cm-danger)]/20 rounded-2xl md:rounded-3xl p-5 md:p-8 flex flex-row sm:flex-col items-center sm:justify-center sm:text-center hover:border-[var(--cm-danger)]/50 transition-all group gap-4 sm:gap-0 cursor-pointer bg-gradient-to-br from-rose-50 to-white dark:[background:rgba(0,0,0,0.4)]"
              onClick={() => setDialog("withdraw")}
            >
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-[var(--cm-danger)]/10 text-[var(--cm-danger)] flex items-center justify-center sm:mb-4 border border-[var(--cm-danger)]/30 group-hover:neon-pink-glow transition-all flex-shrink-0">
                <i className="ri-arrow-up-line text-2xl sm:text-3xl font-bold" />
              </div>
              <div className="flex-1 sm:flex-initial">
                <h3 className="text-sm sm:text-base font-bold dark:text-white text-slate-700 sm:mb-2">{t.wallet.withdraw}</h3>
                <p className="text-xs dark:text-white/30 text-slate-400 sm:mb-6">{t.wallet.withdrawDesc}</p>
              </div>
              <button
                className="w-auto sm:w-full px-5 sm:px-0 h-9 sm:h-10 rounded-xl bg-[var(--cm-danger)] text-white text-xs sm:text-sm font-bold transition-all hover:scale-105 neon-pink-glow flex-shrink-0"
                onClick={(e) => { e.stopPropagation(); setDialog("withdraw") }}
              >
                {t.wallet.withdrawNow}
              </button>
            </div>

            {/* Transfer card */}
            <div
              className="border border-[var(--cm-primary)]/20 rounded-2xl md:rounded-3xl p-5 md:p-8 flex flex-row sm:flex-col items-center sm:justify-center sm:text-center hover:border-[var(--cm-primary)]/50 transition-all group gap-4 sm:gap-0 cursor-pointer bg-gradient-to-br from-violet-50 to-white dark:[background:rgba(0,0,0,0.4)]"
              onClick={() => setDialog("transfer")}
            >
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-[var(--cm-primary)]/10 text-[var(--cm-primary)] flex items-center justify-center sm:mb-4 border border-[var(--cm-primary)]/30 group-hover:neon-blue-glow transition-all flex-shrink-0">
                <i className="ri-arrow-left-right-line text-2xl sm:text-3xl font-bold" />
              </div>
              <div className="flex-1 sm:flex-initial">
                <h3 className="text-sm sm:text-base font-bold dark:text-white text-slate-700 sm:mb-2">{t.wallet.transfer}</h3>
                <p className="text-xs dark:text-white/30 text-slate-400 sm:mb-6">{t.wallet.transferDesc}</p>
              </div>
              <button
                className="w-auto sm:w-full px-5 sm:px-0 h-9 sm:h-10 rounded-xl bg-[var(--cm-primary)] dark:text-black text-white text-xs sm:text-sm font-bold transition-all hover:scale-105 neon-blue-glow flex-shrink-0"
                onClick={(e) => { e.stopPropagation(); setDialog("transfer") }}
              >
                {t.wallet.transferNow}
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex items-center justify-between border-b dark:border-white/5 border-slate-200/60 mb-6">
            <div className="flex gap-4 md:gap-8">
              <button
                className={`pb-3 text-xs md:text-sm font-bold relative top-[2px] transition-colors ${tab === "trade" ? "text-[var(--cm-primary)] border-b-2 border-[var(--cm-primary)]" : "dark:text-white/30 text-slate-400 dark:hover:text-white hover:text-slate-600"}`}
                onClick={() => setTab("trade")}
              >
                {t.wallet.tradeRecords}
              </button>
              <button
                className={`pb-3 text-xs md:text-sm font-medium transition-colors ${tab === "transfer" ? "text-[var(--cm-primary)] border-b-2 border-[var(--cm-primary)] font-bold relative top-[2px]" : "dark:text-white/30 text-slate-400 dark:hover:text-white hover:text-slate-600"}`}
                onClick={() => setTab("transfer")}
              >
                {t.wallet.transferRecords}
              </button>
            </div>
            <span className="text-[var(--cm-primary)]/60 text-xs font-bold hover:text-[var(--cm-primary)] transition-colors pb-3 uppercase tracking-widest cursor-pointer">{t.wallet.viewAll}</span>
          </div>

          {/* Desktop table */}
          <div className="w-full overflow-x-auto hidden md:block">
            <table className="w-full text-left whitespace-nowrap">
              <thead>
                <tr>
                  {tab === "trade" ? (
                    <>
                      <th className="py-4 text-[10px] font-bold dark:text-white/30 text-slate-400 border-b dark:border-white/5 border-slate-100 uppercase tracking-widest">{t.table.tradeId}</th>
                      <th className="py-4 text-[10px] font-bold dark:text-white/30 text-slate-400 border-b dark:border-white/5 border-slate-100 uppercase tracking-widest">{t.table.agent}</th>
                      <th className="py-4 text-[10px] font-bold dark:text-white/30 text-slate-400 border-b dark:border-white/5 border-slate-100 uppercase tracking-widest">{t.table.tradeType}</th>
                      <th className="py-4 text-[10px] font-bold dark:text-white/30 text-slate-400 border-b dark:border-white/5 border-slate-100 uppercase tracking-widest">{t.table.price}</th>
                      <th className="py-4 text-[10px] font-bold dark:text-white/30 text-slate-400 border-b dark:border-white/5 border-slate-100 uppercase tracking-widest">{t.table.amount}</th>
                      <th className="py-4 text-[10px] font-bold dark:text-white/30 text-slate-400 border-b dark:border-white/5 border-slate-100 uppercase tracking-widest">{t.table.tradePair}</th>
                      <th className="py-4 text-[10px] font-bold dark:text-white/30 text-slate-400 border-b dark:border-white/5 border-slate-100 uppercase tracking-widest">{t.table.maCost}</th>
                      <th className="py-4 text-[10px] font-bold dark:text-white/30 text-slate-400 border-b dark:border-white/5 border-slate-100 uppercase tracking-widest">{t.table.time}</th>
                    </>
                  ) : (
                    <>
                      <th className="py-4 text-[10px] font-bold dark:text-white/30 text-slate-400 border-b dark:border-white/5 border-slate-100 uppercase tracking-widest">{t.table.tradeId}</th>
                      <th className="py-4 text-[10px] font-bold dark:text-white/30 text-slate-400 border-b dark:border-white/5 border-slate-100 uppercase tracking-widest">{t.table.targetAddress}</th>
                      <th className="py-4 text-[10px] font-bold dark:text-white/30 text-slate-400 border-b dark:border-white/5 border-slate-100 uppercase tracking-widest">{t.table.tradeType}</th>
                      <th className="py-4 text-[10px] font-bold dark:text-white/30 text-slate-400 border-b dark:border-white/5 border-slate-100 uppercase tracking-widest">{t.table.amount}</th>
                      <th className="py-4 text-[10px] font-bold dark:text-white/30 text-slate-400 border-b dark:border-white/5 border-slate-100 uppercase tracking-widest">{t.table.maCost}</th>
                      <th className="py-4 text-[10px] font-bold dark:text-white/30 text-slate-400 border-b dark:border-white/5 border-slate-100 uppercase tracking-widest">{t.table.time}</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody className="text-xs font-mono">
                {records.map((record) => (
                  <tr key={record.id} className="hover:bg-[var(--cm-primary)]/5 transition-colors border-b dark:border-white/5 border-slate-100">
                    {tab === "trade" ? (
                      <>
                        <td className="py-4 dark:text-white/80 text-slate-600">{record.id}</td>
                        <td className="py-4 text-[var(--cm-primary)]/60">{record.target}</td>
                        <td className={`py-4 ${record.type === "买入" || record.type === "充币" ? "text-[var(--cm-success)]" : record.type === "卖出" || record.type === "提币" ? "text-[var(--cm-danger)]" : "dark:text-white/40 text-slate-400"}`}>
                          {record.type}
                        </td>
                        <td className="py-4 dark:text-white/40 text-slate-500">{record.price ?? "-"}</td>
                        <td className="py-4 dark:text-white/40 text-slate-500">{record.amount}</td>
                        <td className="py-4 text-[var(--cm-primary)]/60">{record.tradePair ?? "-"}</td>
                        <td className="py-4 text-[var(--cm-success)] font-bold">{record.maCost}</td>
                        <td className="py-4 dark:text-white/30 text-slate-400">{record.time}</td>
                      </>
                    ) : (
                      <>
                        <td className="py-4 dark:text-white/80 text-slate-600">{record.id}</td>
                        <td className="py-4 text-[var(--cm-primary)]/60">{record.targetAddress}</td>
                        <td className={`py-4 ${record.type === "买入" || record.type === "充币" ? "text-[var(--cm-success)]" : record.type === "卖出" || record.type === "提币" ? "text-[var(--cm-danger)]" : "dark:text-white/40 text-slate-400"}`}>
                          {record.type}
                        </td>
                        <td className="py-4 dark:text-white/40 text-slate-500">{record.amount}</td>
                        <td className="py-4 text-[var(--cm-success)] font-bold">{record.maCost || "-"}</td>
                        <td className="py-4 dark:text-white/30 text-slate-400">{record.time}</td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile transaction cards */}
          <div className="flex flex-col gap-3 md:hidden">
            {records.map((record) => (
              <div key={record.id} className="dark:bg-black/40 bg-white/80 border dark:border-white/10 border-slate-200/60 rounded-xl p-4 card-glow">
                {tab === "trade" ? (
                  <>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-mono dark:text-white/80 text-slate-600">{record.id}</span>
                      <span className="text-xs text-[var(--cm-primary)]/60">{record.target}</span>
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] dark:text-white/30 text-slate-400 uppercase">{t.table.tradeType}</span>
                      <span className={`text-xs font-bold ${record.type === "买入" || record.type === "充币" ? "text-[var(--cm-success)]" : record.type === "卖出" || record.type === "提币" ? "text-[var(--cm-danger)]" : "dark:text-white/40 text-slate-400"}`}>
                        {tradeTypeMap[record.type] || record.type}
                      </span>
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] dark:text-white/30 text-slate-400 uppercase">{t.table.price}</span>
                      <span className="text-xs dark:text-white/40 text-slate-500 font-mono">{record.price ?? "-"}</span>
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] dark:text-white/30 text-slate-400 uppercase">{t.table.amount}</span>
                      <span className="text-xs dark:text-white/40 text-slate-500 font-mono">{record.amount}</span>
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] dark:text-white/30 text-slate-400 uppercase">{t.table.tradePair}</span>
                      <span className="text-xs text-[var(--cm-primary)]/60 font-mono">{record.tradePair ?? "-"}</span>
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] dark:text-white/30 text-slate-400 uppercase">{t.table.maCost}</span>
                      <span className="text-xs text-[var(--cm-success)] font-bold font-mono">{record.maCost}</span>
                    </div>
                    <div className="mt-3 pt-3 border-t dark:border-white/5 border-slate-100 text-[10px] dark:text-white/30 text-slate-400 font-mono">{record.time}</div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-mono dark:text-white/80 text-slate-600">{record.id}</span>
                      <span className="text-xs text-[var(--cm-primary)]/60 truncate max-w-[180px]">{record.targetAddress}</span>
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] dark:text-white/30 text-slate-400 uppercase">{t.table.tradeType}</span>
                      <span className={`text-xs font-bold ${record.type === "买入" || record.type === "充币" ? "text-[var(--cm-success)]" : record.type === "卖出" || record.type === "提币" ? "text-[var(--cm-danger)]" : "dark:text-white/40 text-slate-400"}`}>
                        {tradeTypeMap[record.type] || record.type}
                      </span>
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] dark:text-white/30 text-slate-400 uppercase">{t.table.amount}</span>
                      <span className="text-xs dark:text-white/40 text-slate-500 font-mono">{record.amount}</span>
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] dark:text-white/30 text-slate-400 uppercase">{t.table.maCost}</span>
                      <span className="text-xs text-[var(--cm-success)] font-bold font-mono">{record.maCost || "-"}</span>
                    </div>
                    <div className="mt-3 pt-3 border-t dark:border-white/5 border-slate-100 text-[10px] dark:text-white/30 text-slate-400 font-mono">{record.time}</div>
                  </>
                )}
              </div>
            ))}
          </div>

        </div>

      {/* Deposit Dialog */}
      <Dialog open={dialog === "deposit"} onOpenChange={(open) => !open && setDialog(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t.wallet.depositTitle}</DialogTitle>
            <DialogDescription>{t.wallet.depositDialogDesc}</DialogDescription>
          </DialogHeader>
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-3">
                <label className="text-sm font-medium">{t.wallet.selectNetwork}</label>
                <Select value={selectedChain} onValueChange={(value) => value && setSelectedChain(value)}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={t.wallet.selectNetwork}>{selectedChainOption?.name}</SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {chainOptions.map((chain) => (
                      <SelectItem key={chain.id} value={chain.id}>{chain.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-3">
                <label className="text-sm font-medium">{t.wallet.selectCurrency}</label>
                <Select value={depositCurrency} onValueChange={(value) => value && setDepositCurrency(value)}>
                  <SelectTrigger className="w-full">
                    <SelectValue>{depositCurrency}</SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {currencyOptions.map((currency) => (
                      <SelectItem key={currency.id} value={currency.id}>{currency.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex items-center justify-center rounded-xl border border-dashed border-white/10 bg-black/20 p-6">
              <div className="flex flex-col items-center gap-3">
                <div className="size-36 rounded-lg border border-white/10 bg-black/40" />
                <div className="flex items-center gap-2 text-xs text-white/40">
                  <QrCodeIcon className="size-4" />
                  <span>{t.wallet.scanQr}</span>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="rounded-lg dark:border-white/10 border-slate-200 dark:bg-black/20 bg-slate-50 px-4 py-3 text-sm">
                <p className="dark:text-white/40 text-slate-500">{t.wallet.walletAddressLabel}</p>
                <p className="mt-1 font-medium font-mono break-all dark:text-white/80 text-slate-700">{walletSummary.address}</p>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button className="w-full sm:w-auto">
              <ShareIcon className="mr-2 size-4" />
              {t.wallet.share}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Withdraw Dialog */}
      <Dialog open={dialog === "withdraw"} onOpenChange={(open) => !open && setDialog(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{t.wallet.withdrawTitle}</DialogTitle>
            <DialogDescription>{t.wallet.withdrawDialogDesc}</DialogDescription>
          </DialogHeader>
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-3">
                <label className="text-sm font-medium">{t.wallet.selectNetwork}</label>
                <Select value={withdrawChain} onValueChange={(value) => value && setWithdrawChain(value)}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={t.wallet.selectNetwork}>{withdrawChainOption?.name}</SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {chainOptions.map((chain) => (
                      <SelectItem key={chain.id} value={chain.id}>{chain.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-3">
                <label className="text-sm font-medium">{t.wallet.selectCurrency}</label>
                <Select value={withdrawCurrency} onValueChange={(value) => value && setWithdrawCurrency(value)}>
                  <SelectTrigger className="w-full">
                    <SelectValue>{withdrawCurrency}</SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {currencyOptions.map((currency) => (
                      <SelectItem key={currency.id} value={currency.id}>{currency.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">{t.wallet.recipientAddress}</label>
              <Input placeholder={t.wallet.recipientAddressPlaceholder} />
              <p className="text-xs text-white/40">{t.wallet.addressNetworkWarning}</p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">{t.wallet.withdrawAmount}</label>
              <div className="flex items-center gap-3">
                <Input placeholder={t.wallet.withdrawAmountPlaceholder} type="number" />
                <Badge variant="outline" className="cursor-pointer hover:bg-white/5">{t.wallet.all}</Badge>
              </div>
            </div>
            <div className="space-y-2 rounded-lg dark:border-white/10 border-slate-200 dark:bg-black/20 bg-slate-50 px-4 py-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="dark:text-white/40 text-slate-500">{t.wallet.fee}</span>
                <span className="dark:text-white text-slate-700">0.00 MA</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="dark:text-white/40 text-slate-500">{t.wallet.actualArrival}</span>
                <span className="font-medium dark:text-white text-slate-700">-- MA</span>
              </div>
              <div className="flex items-center justify-between dark:border-white/5 border-slate-200 pt-2">
                <span className="dark:text-white/40 text-slate-500">{t.wallet.availableBalance}</span>
                <span className="dark:text-white text-slate-700">{walletSummary.balance}</span>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialog(null)}>{t.nav.cancel}</Button>
            <Button onClick={() => setDialog(null)}>{t.wallet.confirmWithdraw}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Transfer Dialog */}
      <Dialog open={dialog === "transfer"} onOpenChange={(open) => !open && setDialog(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{t.wallet.transferTitle}</DialogTitle>
            <DialogDescription>{t.wallet.transferDialogDesc}</DialogDescription>
          </DialogHeader>
          <div className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-medium">{t.wallet.recipientPhone}</label>
              <Input placeholder={t.wallet.recipientPhonePlaceholder} type="tel" />
              <p className="text-xs text-white/40">{t.wallet.recipientPhoneHint}</p>
            </div>
            <div className="space-y-3">
              <label className="text-sm font-medium">{t.wallet.selectCurrency}</label>
              <Select value={transferCurrency} onValueChange={(value) => value && setTransferCurrency(value)}>
                <SelectTrigger className="w-fit min-w-32">
                  <SelectValue>{transferCurrency}</SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {currencyOptions.map((currency) => (
                    <SelectItem key={currency.id} value={currency.id}>{currency.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">{t.wallet.transferAmount}</label>
              <div className="flex items-center gap-3">
                <Input placeholder={t.wallet.transferAmountPlaceholder} type="number" />
                <Badge variant="outline" className="cursor-pointer hover:bg-white/5">{t.wallet.all}</Badge>
              </div>
            </div>
            <div className="space-y-2 rounded-lg dark:border-white/10 border-slate-200 dark:bg-black/20 bg-slate-50 px-4 py-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="dark:text-white/40 text-slate-500">{t.wallet.fee}</span>
                <span className="text-[#00FF88]">{t.wallet.free}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="dark:text-white/40 text-slate-500">{t.wallet.actualArrival}</span>
                <span className="font-medium dark:text-white text-slate-700">-- MA</span>
              </div>
              <div className="flex items-center justify-between dark:border-white/5 border-slate-200 pt-2">
                <span className="dark:text-white/40 text-slate-500">{t.wallet.availableBalance}</span>
                <span className="dark:text-white text-slate-700">{walletSummary.balance}</span>
              </div>
            </div>
            <div className="rounded-lg bg-amber-500/10 px-4 py-3 text-sm text-amber-400">
              <p>{t.wallet.transferWarning}</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialog(null)}>{t.nav.cancel}</Button>
            <Button onClick={() => setDialog(null)}>{t.wallet.confirmTransfer}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
