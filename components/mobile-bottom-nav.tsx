"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useLocale } from "@/components/locale-provider"

export function MobileBottomNav() {
  const pathname = usePathname()
  const { t } = useLocale()

  const bottomNavItems = [
    { title: t.nav.home, url: "/", icon: "ri-home-5-line" },
    { title: t.nav.agent, url: "/agent", icon: "ri-inbox-archive-line" },
    { title: t.nav.wallet, url: "/wallet", icon: "ri-flag-line" },
    { title: t.nav.settings, url: "/settings", icon: "ri-settings-3-line" },
  ]

  function isActive(url: string) {
    if (url === "/") return pathname === "/"
    return pathname.startsWith(url)
  }

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-30 dark:bg-black/90 bg-white/80 backdrop-blur-xl border-t dark:border-white/10 border-slate-200/60 flex items-center justify-around h-16 px-2">
      {bottomNavItems.map((item) => {
        const active = isActive(item.url)
        return (
          <Link
            key={item.url}
            href={item.url === "/agent" ? "/agent/binance" : item.url}
            className={`flex flex-col items-center gap-1 py-2 px-3 transition-colors ${
              active
                ? "text-[var(--cm-primary)]"
                : "dark:text-white/40 text-slate-400 hover:text-[var(--cm-primary)]"
            }`}
          >
            <i className={`${item.icon} text-lg`} />
            <span className={`text-[10px] ${active ? "font-bold" : ""}`}>{item.title}</span>
          </Link>
        )
      })}
    </nav>
  )
}
