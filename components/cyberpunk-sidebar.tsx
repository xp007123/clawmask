"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { clearClientSession } from "@/lib/auth-client"
import { useLocale } from "@/components/locale-provider"

export function CyberpunkSidebar({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname()
  const router = useRouter()
  const { t } = useLocale()
  const [logoutOpen, setLogoutOpen] = useState(false)

  const navItems = [
    { title: t.nav.home, url: "/", icon: "ri-home-5-line" },
    { title: t.nav.binanceAgent, url: "/agent/binance", icon: "ri-inbox-archive-line" },
    { title: t.nav.okxAgent, url: "/agent/okx", icon: "ri-battery-charge-line" },
    { title: t.nav.madexAgent, url: "/agent/madex", icon: "ri-battery-charge-line" },
    { title: t.nav.wallet, url: "/wallet", icon: "ri-flag-line" },
    { title: t.nav.settings, url: "/settings", icon: "ri-settings-3-line" },
  ]

  function isActive(url: string) {
    if (url === "/") return pathname === "/"
    return pathname.startsWith(url)
  }

  function handleLogout() {
    clearClientSession()
    setLogoutOpen(false)
    router.push("/login")
  }

  return (
    <>
      {/* Logo */}
      <div className="h-24 flex items-center justify-center mt-4 mb-4">
        <h1 className="text-[32px] font-bold tracking-tighter lowercase italic text-[var(--cm-primary)] dark:[text-shadow:0_0_10px_#00D4FF]">
          <span className="dark:inline hidden">clawmask</span>
          <span className="dark:hidden bg-gradient-to-r from-[#6D5DFC] to-[#a78bfa] bg-clip-text text-transparent">clawmask</span>
        </h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 flex flex-col gap-1.5 overflow-y-auto">
        {navItems.map((item) => {
          const active = isActive(item.url)
          return (
            <Link
              key={item.url}
              href={item.url}
              onClick={onClose}
              className={
                active
                  ? "flex items-center gap-3 w-full px-4 py-3 text-sm font-bold rounded-xl transition-all text-[var(--cm-primary)] dark:bg-[var(--cm-primary)]/20 bg-[var(--cm-primary)]/8 border dark:border-[var(--cm-primary)]/40 border-[var(--cm-primary)]/20 dark:neon-border accent-glow"
                  : "flex items-center gap-3 px-4 py-3 text-sm rounded-xl transition-all border border-transparent dark:text-white/50 text-slate-400 hover:text-[var(--cm-primary)] dark:hover:bg-[var(--cm-primary)]/10 hover:bg-[var(--cm-primary)]/5 dark:hover:border-[var(--cm-primary)]/30 hover:border-[var(--cm-primary)]/15"
              }
            >
              <i className={`${item.icon} text-lg`} />
              <span>{item.title}</span>
            </Link>
          )
        })}
      </nav>

      {/* Bottom section */}
      <div className="mt-auto px-4 pb-8 pt-4 flex flex-col items-center">
        <div className="flex items-center gap-2 text-sm dark:text-white/40 text-slate-400 mb-6">
          <i className="ri-customer-service-2-line text-xl" />
          <span>{t.nav.customerService}</span>
        </div>

        <div className="flex items-center gap-4 mb-8">
          <a href="#" className="w-8 h-8 rounded-full dark:bg-white/5 bg-[var(--cm-primary)]/5 border dark:border-white/10 border-[var(--cm-primary)]/15 text-[var(--cm-primary)] flex items-center justify-center dark:hover:bg-[var(--cm-primary)]/20 hover:bg-[var(--cm-primary)]/10 transition-all">
            <i className="ri-telegram-fill text-lg" />
          </a>
          <a href="#" className="w-8 h-8 rounded-full dark:bg-white/5 bg-slate-100 border dark:border-white/10 border-slate-200 dark:text-white text-slate-500 flex items-center justify-center dark:hover:bg-white/20 hover:bg-slate-200 transition-all">
            <i className="ri-twitter-x-fill text-sm" />
          </a>
        </div>

        <button
          onClick={() => setLogoutOpen(true)}
          className="w-full flex items-center justify-center gap-2 py-2.5 dark:bg-[var(--cm-danger)]/10 bg-[var(--cm-danger)]/8 dark:hover:bg-[var(--cm-danger)]/20 hover:bg-[var(--cm-danger)]/15 text-[var(--cm-danger)] rounded-xl text-sm transition-all border dark:border-[var(--cm-danger)]/30 border-[var(--cm-danger)]/15"
        >
          <i className="ri-logout-box-r-line text-lg" />
          <span className="font-bold">{t.nav.logout}</span>
        </button>
      </div>

      {/* Logout confirmation dialog */}
      <Dialog open={logoutOpen} onOpenChange={setLogoutOpen}>
        <DialogContent className="dark:bg-black/90 dark:border-white/10 dark:backdrop-blur-2xl">
          <DialogHeader>
            <DialogTitle>{t.nav.logoutConfirm}</DialogTitle>
            <DialogDescription>{t.nav.logoutDesc}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setLogoutOpen(false)}>
              {t.nav.cancel}
            </Button>
            <Button variant="destructive" onClick={handleLogout}>
              {t.nav.logout}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
