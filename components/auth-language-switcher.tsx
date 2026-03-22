"use client"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select"
import { useLocale } from "@/components/locale-provider"
import { localeOptions, type Locale } from "@/lib/i18n"

export function AuthLanguageSwitcher() {
  const { locale, setLocale } = useLocale()
  const currentLabel =
    localeOptions.find((option) => option.value === locale)?.label ?? "中文"

  return (
    <Select
      value={locale}
      onValueChange={(nextValue) => {
        if (nextValue) {
          setLocale(nextValue as Locale)
        }
      }}
    >
      <SelectTrigger
        size="sm"
        aria-label="切换语言"
        className="w-auto justify-between border-transparent px-0 text-muted-foreground hover:text-foreground dark:bg-transparent"
      >
        <span className="truncate">{currentLabel}</span>
      </SelectTrigger>
      <SelectContent align="end">
        {localeOptions.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
