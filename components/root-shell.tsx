"use client"

import { useState, type ReactNode } from "react"
import { usePathname } from "next/navigation"
import { ThemeProvider } from "next-themes"

import { CyberpunkSidebar } from "@/components/cyberpunk-sidebar"
import { CyberpunkHeader } from "@/components/cyberpunk-header"
import { MobileBottomNav } from "@/components/mobile-bottom-nav"
import { LocaleProvider } from "@/components/locale-provider"
import { HtmlLangSync } from "@/components/html-lang-sync"
import { Toaster } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import { isAuthRoute } from "@/lib/auth"

export function RootShell({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const authRoute = isAuthRoute(pathname)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  function toggleSidebar() {
    setSidebarOpen((prev) => !prev)
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <LocaleProvider>
      <HtmlLangSync />
      <TooltipProvider>
        {authRoute ? (
          children
        ) : (
          <div className="w-full h-screen flex overflow-hidden dark:bg-[#050505] bg-[#F5F3FF]" style={{
            background: "var(--shell-bg)",
          }}>
            {/* Mobile sidebar overlay */}
            {sidebarOpen && (
              <div
                className="fixed inset-0 dark:bg-black/60 bg-slate-900/20 dark:backdrop-blur-none backdrop-blur-sm z-40 md:hidden"
                onClick={() => setSidebarOpen(false)}
              />
            )}

            {/* Sidebar */}
            <aside
              className={`${
                sidebarOpen ? "translate-x-0" : "-translate-x-full"
              } md:!translate-x-0 fixed md:relative z-50 w-[240px] flex-shrink-0 flex flex-col h-full border-r dark:border-white/5 border-white/60 dark:bg-black/90 bg-white/70 md:dark:bg-black/40 md:bg-white/50 backdrop-blur-2xl transition-transform duration-300 ease-in-out`}
            >
              <CyberpunkSidebar onClose={() => setSidebarOpen(false)} />
            </aside>

            {/* Main content area */}
            <div className="flex-1 flex flex-col h-full min-w-0">
              <CyberpunkHeader onMenuToggle={toggleSidebar} />

              <main className="flex-1 overflow-y-auto p-3 md:p-6 pb-20 md:pb-6">
                {children}
              </main>
            </div>

            {/* Mobile bottom nav */}
            <MobileBottomNav />
          </div>
        )}
        <Toaster richColors position="top-right" />
      </TooltipProvider>
      </LocaleProvider>
    </ThemeProvider>
  )
}