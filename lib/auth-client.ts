"use client"

import {
  AUTH_COOKIE_NAME,
  AUTH_PROFILE_COOKIE_NAME,
  AUTH_RESET_PHONE_STORAGE_KEY,
  AUTH_USERS_STORAGE_KEY,
  DEFAULT_TEST_USER,
  DEMO_INVITE_CODE,
  formatProfileName,
  normalizePhone,
  type StoredAuthUser,
} from "@/lib/auth"

export const AUTH_PROFILE_CHANGE_EVENT = "clawmask-profile-change"

type SessionOptions = {
  remember: boolean
}

function readUsers() {
  if (typeof window === "undefined") {
    return [DEFAULT_TEST_USER]
  }

  const raw = window.localStorage.getItem(AUTH_USERS_STORAGE_KEY)

  if (!raw) {
    return [DEFAULT_TEST_USER]
  }

  try {
    const storedUsers = JSON.parse(raw) as StoredAuthUser[]

    return storedUsers.length > 0 ? storedUsers : [DEFAULT_TEST_USER]
  } catch {
    return [DEFAULT_TEST_USER]
  }
}

function writeUsers(users: StoredAuthUser[]) {
  window.localStorage.setItem(AUTH_USERS_STORAGE_KEY, JSON.stringify(users))
}

function setCookie(name: string, value: string, remember: boolean) {
  const base = `${name}=${encodeURIComponent(value)}; path=/; SameSite=Lax`
  const withMaxAge = remember ? `${base}; Max-Age=${60 * 60 * 24 * 30}` : base

  document.cookie = withMaxAge
}

function dispatchProfileChange() {
  window.dispatchEvent(new Event(AUTH_PROFILE_CHANGE_EVENT))
}

function setClientProfileCookie(phone: string, name: string) {
  document.cookie = `${AUTH_PROFILE_COOKIE_NAME}=${encodeURIComponent(
    JSON.stringify({
      phone,
      name,
    })
  )}; path=/; SameSite=Lax`
}

export function getStoredUsers() {
  return readUsers()
}

export function findStoredUser(phone: string) {
  const normalizedPhone = normalizePhone(phone)

  return readUsers().find((user) => user.phone === normalizedPhone)
}

export function registerStoredUser(user: Omit<StoredAuthUser, "createdAt">) {
  const users = readUsers()
  const nextUser: StoredAuthUser = {
    ...user,
    createdAt: new Date().toISOString(),
  }

  writeUsers([...users, nextUser])

  return nextUser
}

export function updateStoredUserPassword(phone: string, password: string) {
  const normalizedPhone = normalizePhone(phone)
  const users = readUsers()
  const nextUsers = users.map((user) =>
    user.phone === normalizedPhone ? { ...user, password } : user
  )

  writeUsers(nextUsers)
}

export function hasRegisteredUser(phone: string) {
  return Boolean(findStoredUser(phone))
}

export function isInviteCodeValid(code: string) {
  return code.trim().toUpperCase() === DEMO_INVITE_CODE
}

export function createClientSession(phone: string, options: SessionOptions) {
  const normalizedPhone = normalizePhone(phone)
  const user = findStoredUser(normalizedPhone)
  const name = user?.name?.trim() || formatProfileName(normalizedPhone)

  setCookie(AUTH_COOKIE_NAME, "1", options.remember)
  setCookie(
    AUTH_PROFILE_COOKIE_NAME,
    JSON.stringify({
      phone: normalizedPhone,
      name,
    }),
    options.remember
  )
  dispatchProfileChange()
}

export function clearClientSession() {
  document.cookie = `${AUTH_COOKIE_NAME}=; path=/; Max-Age=0; SameSite=Lax`
  document.cookie = `${AUTH_PROFILE_COOKIE_NAME}=; path=/; Max-Age=0; SameSite=Lax`
  dispatchProfileChange()
}

export function getClientProfileCookieValue() {
  return (
    document.cookie
      .split("; ")
      .find((part) => part.startsWith(`${AUTH_PROFILE_COOKIE_NAME}=`)) ?? ""
  )
}

export function getClientProfile() {
  const profileCookie = getClientProfileCookieValue()

  if (!profileCookie) {
    return null
  }

  const rawValue = profileCookie.split("=")[1]

  try {
    const profile = JSON.parse(decodeURIComponent(rawValue)) as {
      name: string
      phone: string
    }

    const storedUser = findStoredUser(profile.phone)

    return {
      name: storedUser?.name?.trim() || profile.name,
      phone: storedUser?.phone || profile.phone,
    }
  } catch {
    return null
  }
}

export function refreshClientProfile(phone?: string) {
  const currentProfile = getClientProfile()
  const targetPhone = normalizePhone(phone ?? currentProfile?.phone ?? "")

  if (!targetPhone) {
    return
  }

  const user = findStoredUser(targetPhone)

  setClientProfileCookie(
    targetPhone,
    user?.name?.trim() || formatProfileName(targetPhone)
  )
  dispatchProfileChange()
}

export function updateStoredUserPhone(currentPhone: string, nextPhone: string) {
  const normalizedCurrentPhone = normalizePhone(currentPhone)
  const normalizedNextPhone = normalizePhone(nextPhone)
  const users = readUsers()
  const nextUsers = users.map((user) =>
    user.phone === normalizedCurrentPhone
      ? {
          ...user,
          phone: normalizedNextPhone,
        }
      : user
  )

  writeUsers(nextUsers)

  return nextUsers.find((user) => user.phone === normalizedNextPhone) ?? null
}

export function setResetPhone(phone: string) {
  window.sessionStorage.setItem(
    AUTH_RESET_PHONE_STORAGE_KEY,
    normalizePhone(phone)
  )
}

export function getResetPhone() {
  return window.sessionStorage.getItem(AUTH_RESET_PHONE_STORAGE_KEY)
}

export function clearResetPhone() {
  window.sessionStorage.removeItem(AUTH_RESET_PHONE_STORAGE_KEY)
}

export function updateStoredUserProfile(
  phone: string,
  profile: Partial<Pick<StoredAuthUser, "name" | "email">>
) {
  const normalizedPhone = normalizePhone(phone)
  const users = readUsers()
  const nextUsers = users.map((user) =>
    user.phone === normalizedPhone
      ? {
          ...user,
          ...profile,
        }
      : user
  )

  writeUsers(nextUsers)

  return nextUsers.find((user) => user.phone === normalizedPhone) ?? null
}

export function updateStoredUserPaymentPassword(
  phone: string,
  paymentPassword: string
) {
  const normalizedPhone = normalizePhone(phone)
  const users = readUsers()
  const nextUsers = users.map((user) =>
    user.phone === normalizedPhone ? { ...user, paymentPassword } : user
  )

  writeUsers(nextUsers)
}
