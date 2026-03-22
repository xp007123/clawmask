"use client"

import * as React from "react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { SidebarGroup, SidebarGroupContent } from "@/components/ui/sidebar"
import { BellIcon, CalendarDaysIcon } from "lucide-react"

type TradeMode = "模拟" | "正式"

const TRADE_MODE_STORAGE_KEY = "clawmask_trade_mode"

export function SidebarTools() {
  const [mode, setMode] = React.useState<TradeMode>("正式")
  const [pendingMode, setPendingMode] = React.useState<TradeMode | null>(null)
  const currentDate = new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date())

  React.useEffect(() => {
    const savedMode = window.localStorage.getItem(TRADE_MODE_STORAGE_KEY)

    if (savedMode === "模拟" || savedMode === "正式") {
      setMode(savedMode)
    }
  }, [])

  const nextMode = mode === "正式" ? "模拟" : "正式"
  const actionLabel =
    mode === "正式" ? "切换为模拟环境" : "返回正式环境"
  const dialogTitle =
    nextMode === "模拟" ? "切换到模拟环境？" : "返回正式环境？"
  const dialogDescription =
    nextMode === "模拟"
      ? "模拟环境不会发起真实交易。"
      : "将切换回正式交易环境。"

  function confirmSwitch() {
    if (!pendingMode) {
      return
    }

    setMode(pendingMode)
    window.localStorage.setItem(TRADE_MODE_STORAGE_KEY, pendingMode)
    setPendingMode(null)
    toast.success(
      pendingMode === "模拟" ? "已切换到模拟环境" : "已返回正式环境"
    )
  }

  return (
    <SidebarGroup className="pt-0">
      <SidebarGroupContent className="space-y-3 rounded-lg border border-sidebar-border/70 bg-sidebar-accent/30 p-3">
        <div>
          <Button
            variant="outline"
            size="sm"
            className="w-full justify-center border-sidebar-border/70 bg-sidebar text-xs hover:bg-sidebar-accent"
            onClick={() => setPendingMode(nextMode)}
          >
            {actionLabel}
          </Button>
        </div>

        <div className="flex items-center justify-between gap-2 text-xs text-sidebar-foreground/70">
          <div className="flex items-center gap-2">
            <CalendarDaysIcon className="size-3.5" />
            <span>{currentDate}</span>
          </div>
          <Button size="icon-sm" variant="ghost" className="size-7 rounded-md">
            <BellIcon className="size-3.5" />
            <span className="sr-only">消息入口</span>
          </Button>
        </div>
      </SidebarGroupContent>

      <Dialog
        open={Boolean(pendingMode)}
        onOpenChange={(open) => {
          if (!open) {
            setPendingMode(null)
          }
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{dialogTitle}</DialogTitle>
            <DialogDescription>{dialogDescription}</DialogDescription>
          </DialogHeader>

          <div className="rounded-lg border border-border/60 bg-muted/20 px-4 py-3 text-sm">
            <div className="flex items-center justify-between gap-4">
              <span className="text-muted-foreground">当前</span>
              <span className="font-medium">{mode}环境</span>
            </div>
            <div className="mt-3 flex items-center justify-between gap-4">
              <span className="text-muted-foreground">切换后</span>
              <span className="font-medium">{pendingMode}环境</span>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setPendingMode(null)}>
              取消
            </Button>
            <Button onClick={confirmSwitch}>{actionLabel}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </SidebarGroup>
  )
}
