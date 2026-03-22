export const LOCALE_STORAGE_KEY = "clawmask_locale"

export type Locale = "zh-CN" | "en"

export const localeOptions: { value: Locale; label: string }[] = [
  { value: "zh-CN", label: "中文" },
  { value: "en", label: "English" },
]

export function getStoredLocale(): Locale {
  if (typeof window === "undefined") return "zh-CN"
  const stored = window.localStorage.getItem(LOCALE_STORAGE_KEY)
  if (stored === "en") return "en"
  return "zh-CN"
}

export function setStoredLocale(locale: Locale) {
  window.localStorage.setItem(LOCALE_STORAGE_KEY, locale)
  window.dispatchEvent(new Event("clawmask-locale-change"))
}
