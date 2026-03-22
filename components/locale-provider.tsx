"use client"

import {
  createContext,
  useCallback,
  useContext,
  useSyncExternalStore,
  type ReactNode,
} from "react"
import { type Locale, getStoredLocale, setStoredLocale, LOCALE_STORAGE_KEY } from "@/lib/i18n"
import zhCN from "@/lib/dictionaries/zh-CN"
import en from "@/lib/dictionaries/en"

type Dictionary = typeof zhCN

const dictionaries: Record<Locale, Dictionary> = { "zh-CN": zhCN, en }

type LocaleContextValue = {
  locale: Locale
  t: Dictionary
  setLocale: (locale: Locale) => void
}

const LocaleContext = createContext<LocaleContextValue>({
  locale: "zh-CN",
  t: zhCN,
  setLocale: () => {},
})

function subscribe(onStoreChange: () => void) {
  window.addEventListener("storage", onStoreChange)
  window.addEventListener("clawmask-locale-change", onStoreChange)
  return () => {
    window.removeEventListener("storage", onStoreChange)
    window.removeEventListener("clawmask-locale-change", onStoreChange)
  }
}

export function LocaleProvider({ children }: { children: ReactNode }) {
  const locale = useSyncExternalStore(
    subscribe,
    () => getStoredLocale(),
    () => "zh-CN" as Locale
  )

  const handleSetLocale = useCallback((next: Locale) => {
    setStoredLocale(next)
  }, [])

  return (
    <LocaleContext.Provider value={{ locale, t: dictionaries[locale], setLocale: handleSetLocale }}>
      {children}
    </LocaleContext.Provider>
  )
}

export function useLocale() {
  return useContext(LocaleContext)
}
