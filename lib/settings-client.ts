"use client"

export type SettingsProviderId = "binance" | "okx"

export type StoredApiConfig = {
  apiKey: string
  secretKey: string
  configured: boolean
  lastTestedAt: string | null
}

export type StoredApiConfigMap = Record<SettingsProviderId, StoredApiConfig>

const SETTINGS_API_STORAGE_KEY = "clawmask_settings_api"

const defaultApiConfigs: StoredApiConfigMap = {
  binance: {
    apiKey: "",
    secretKey: "",
    configured: false,
    lastTestedAt: null,
  },
  okx: {
    apiKey: "",
    secretKey: "",
    configured: false,
    lastTestedAt: null,
  },
}

export function getStoredApiConfigs(): StoredApiConfigMap {
  if (typeof window === "undefined") {
    return defaultApiConfigs
  }

  const raw = window.localStorage.getItem(SETTINGS_API_STORAGE_KEY)

  if (!raw) {
    return defaultApiConfigs
  }

  try {
    const parsed = JSON.parse(raw) as Partial<StoredApiConfigMap>

    return {
      binance: {
        ...defaultApiConfigs.binance,
        ...parsed.binance,
      },
      okx: {
        ...defaultApiConfigs.okx,
        ...parsed.okx,
      },
    }
  } catch {
    return defaultApiConfigs
  }
}

export function saveStoredApiConfigs(configs: StoredApiConfigMap) {
  window.localStorage.setItem(SETTINGS_API_STORAGE_KEY, JSON.stringify(configs))
}

export function updateStoredApiConfig(
  providerId: SettingsProviderId,
  config: StoredApiConfig
) {
  const current = getStoredApiConfigs()
  const next = {
    ...current,
    [providerId]: config,
  }

  saveStoredApiConfigs(next)

  return next
}
