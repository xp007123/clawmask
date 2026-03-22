"use client"

import { useEffect, useState, useSyncExternalStore } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  LOGIN_PASSWORD_MIN_LENGTH,
} from "@/lib/auth"
import {
  clearResetPhone,
  getResetPhone,
  updateStoredUserPassword,
} from "@/lib/auth-client"
import { useLocale } from "@/components/locale-provider"

export function ResetPasswordForm() {
  const router = useRouter()
  const { t } = useLocale()
  const phone = useSyncExternalStore(
    () => () => {},
    () => getResetPhone() ?? "",
    () => ""
  )
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [pending, setPending] = useState(false)

  useEffect(() => {
    const resetPhone = getResetPhone()

    if (!resetPhone) {
      router.replace("/forgot-password")
      return
    }

  }, [router])

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!phone) {
      setError("请先完成身份验证")
      return
    }

    if (password.trim().length < LOGIN_PASSWORD_MIN_LENGTH) {
      setError(`新密码至少 ${LOGIN_PASSWORD_MIN_LENGTH} 位`)
      return
    }

    if (password !== confirmPassword) {
      setError("两次输入的密码不一致")
      return
    }

    setPending(true)
    setError("")
    updateStoredUserPassword(phone, password.trim())
    clearResetPhone()
    toast.success("密码已更新")
    router.replace("/login")
    router.refresh()
  }

  return (
    <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">{t.auth.resetPassword}</h1>
          <p className="text-sm text-muted-foreground">{phone || t.auth.resetPasswordDesc}</p>
        </div>
        <Field>
          <FieldLabel htmlFor="new-password">{t.auth.newPassword}</FieldLabel>
          <Input
            id="new-password"
            type="password"
            autoComplete="new-password"
            placeholder={t.auth.newPasswordPlaceholder}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="confirm-password">{t.auth.confirmPassword}</FieldLabel>
          <Input
            id="confirm-password"
            type="password"
            autoComplete="new-password"
            placeholder={t.auth.confirmPasswordPlaceholder}
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            required
          />
          <FieldError>{error}</FieldError>
        </Field>
        <Field>
          <Button type="submit" disabled={pending}>
            {pending ? `${t.auth.confirmReset}...` : t.auth.confirmReset}
          </Button>
        </Field>
      </FieldGroup>
    </form>
  )
}
