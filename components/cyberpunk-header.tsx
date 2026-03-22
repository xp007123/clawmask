"use client"

import { useTheme } from "next-themes"
import { getClientProfile } from "@/lib/auth-client"
import { useLocale } from "@/components/locale-provider"

export function CyberpunkHeader({ onMenuToggle }: { onMenuToggle: () => void }) {
  const { theme, setTheme } = useTheme()
  const { locale, t, setLocale } = useLocale()
  const profile = typeof window !== "undefined" ? getClientProfile() : null
  const initial = profile?.name?.charAt(0)?.toUpperCase() || "C"

  return (
    <header className="h-[56px] md:h-[72px] dark:bg-black/20 bg-white/40 backdrop-blur-xl border-b dark:border-white/5 border-white/60 flex items-center justify-between md:justify-end px-4 md:px-8 gap-3 md:gap-6 flex-shrink-0">
      {/* Mobile hamburger */}
      <button
        className="md:hidden dark:text-white/60 text-slate-400 hover:text-[var(--cm-primary)] transition-colors"
        onClick={onMenuToggle}
      >
        <i className="ri-menu-line text-2xl" />
      </button>

      {/* Mobile logo */}
      <h1 className="md:hidden text-lg font-bold tracking-tighter lowercase italic text-[var(--cm-primary)]">
        <span className="dark:inline hidden" style={{ textShadow: "0 0 10px #00D4FF" }}>clawmask</span>
        <span className="dark:hidden bg-gradient-to-r from-[#6D5DFC] to-[#a78bfa] bg-clip-text text-transparent">clawmask</span>
      </h1>

      <div className="flex items-center gap-3 md:gap-6">
        {/* Simulator mode badge */}
        <button className="hidden md:block px-4 py-1.5 rounded-lg bg-[var(--cm-success)]/10 border border-[var(--cm-success)]/30 text-[var(--cm-success)] text-xs font-bold uppercase tracking-widest hover:bg-[var(--cm-success)]/20 transition-all dark:neon-green-glow green-glow">
          {t.header.simulatorMode}
        </button>

        {/* Date */}
        <span className="hidden md:block text-sm dark:text-white/40 text-slate-400 font-mono">
          {new Date().toLocaleDateString(locale, { year: "numeric", month: "2-digit", day: "2-digit" }).replace(/\//g, "/")}
        </span>

        {/* Language toggle */}
        <button
          onClick={() => setLocale(locale === "zh-CN" ? "en" : "zh-CN")}
          className="dark:text-white/40 text-slate-400 hover:text-[var(--cm-primary)] transition-colors text-xs font-bold uppercase tracking-wider"
          title={locale === "zh-CN" ? "Switch to English" : "切换到中文"}
        >
          {locale === "zh-CN" ? "EN" : "中"}
        </button>

        {/* Theme toggle */}
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="dark:text-white/40 text-slate-400 hover:text-[var(--cm-primary)] transition-colors"
          title={t.header.toggleTheme}
        >
          <i className={`${theme === "dark" ? "ri-sun-line" : "ri-moon-line"} text-xl`} />
        </button>

        {/* Message icon */}
        <button className="dark:text-white/40 text-slate-400 hover:text-[var(--cm-primary)] transition-colors">
          <i className="ri-message-3-line text-xl" />
        </button>

        {/* Avatar */}
        <div className="w-8 h-8 rounded-lg dark:bg-[var(--cm-danger)]/20 bg-gradient-to-br from-[var(--cm-primary)]/20 to-[var(--cm-danger)]/20 border dark:border-[var(--cm-danger)]/40 border-[var(--cm-primary)]/20 text-[var(--cm-danger)] dark:text-[var(--cm-danger)] flex items-center justify-center text-sm font-bold dark:neon-pink-glow">
          {initial}
        </div>
      </div>
    </header>
  )
}
