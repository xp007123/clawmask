export const AUTH_COOKIE_NAME = "clawmask_session"
export const AUTH_PROFILE_COOKIE_NAME = "clawmask_profile"
export const AUTH_LOCALE_STORAGE_KEY = "clawmask_auth_locale"
export const AUTH_USERS_STORAGE_KEY = "clawmask_auth_users"
export const AUTH_RESET_PHONE_STORAGE_KEY = "clawmask_auth_reset_phone"

export const DEMO_INVITE_CODE = "CLAWMASK"
export const DEMO_VERIFICATION_CODE = "123456"

export const LOGIN_PASSWORD_MIN_LENGTH = 6
export const PAYMENT_PASSWORD_PATTERN = /^\d{6}$/
export const PHONE_PATTERN = /^\+?\d{6,15}$/

export type StoredAuthUser = {
  phone: string
  password: string
  paymentPassword: string
  inviteCode: string
  name?: string
  email?: string
  createdAt: string
}

export const DEFAULT_TEST_USER: StoredAuthUser = {
  phone: "13900000001",
  password: "abc12345",
  paymentPassword: "123456",
  inviteCode: DEMO_INVITE_CODE,
  createdAt: "2026-03-17T00:00:00.000Z",
}

export function isAuthRoute(pathname: string) {
  return (
    pathname === "/login" ||
    pathname === "/register" ||
    pathname === "/forgot-password" ||
    pathname.startsWith("/forgot-password/")
  )
}

export function normalizePhone(phone: string) {
  const trimmed = phone.trim()

  if (trimmed.startsWith("+")) {
    return `+${trimmed.slice(1).replace(/\D/g, "")}`
  }

  return trimmed.replace(/\D/g, "")
}

export function formatProfileName(phone: string) {
  if (phone.length <= 4) {
    return phone
  }

  return `用户 ${phone.slice(-4)}`
}
