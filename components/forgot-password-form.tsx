"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  DEMO_VERIFICATION_CODE,
  PHONE_PATTERN,
  normalizePhone,
} from "@/lib/auth"
import { findStoredUser, setResetPhone } from "@/lib/auth-client"
import { useLocale } from "@/components/locale-provider"

export function ForgotPasswordForm() {
  const router = useRouter()
  const { t } = useLocale()
  const [phone, setPhone] = useState("")
  const [verificationCode, setVerificationCode] = useState("")
  const [error, setError] = useState("")
  const [pending, setPending] = useState(false)
  const [sendingCode, setSendingCode] = useState(false)

  function handleSendCode() {
    const normalizedPhone = normalizePhone(phone)

    if (!PHONE_PATTERN.test(normalizedPhone)) {
      setError("请输入正确的手机号")
      return
    }

    if (!findStoredUser(normalizedPhone)) {
      setError("该手机号尚未注册")
      return
    }

    setSendingCode(true)
    setError("")
    toast.success(`验证码：${DEMO_VERIFICATION_CODE}`)
    window.setTimeout(() => setSendingCode(false), 800)
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const normalizedPhone = normalizePhone(phone)

    if (!PHONE_PATTERN.test(normalizedPhone)) {
      setError("请输入正确的手机号")
      return
    }

    if (!findStoredUser(normalizedPhone)) {
      setError("该手机号尚未注册")
      return
    }

    if (verificationCode.trim() !== DEMO_VERIFICATION_CODE) {
      setError("验证码错误")
      return
    }

    setPending(true)
    setError("")
    setResetPhone(normalizedPhone)
    router.push("/forgot-password/reset")
  }

  return (
    <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">{t.auth.forgotPasswordTitle}</h1>
          <p className="text-sm text-muted-foreground">{t.auth.forgotPasswordDesc}</p>
        </div>
        <Field>
          <FieldLabel htmlFor="forgot-phone">{t.auth.phone}</FieldLabel>
          <Input
            id="forgot-phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder={t.auth.phonePlaceholder}
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            required
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="forgot-code">{t.auth.verificationCode}</FieldLabel>
          <div className="flex gap-2">
            <Input
              id="forgot-code"
              inputMode="numeric"
              autoComplete="one-time-code"
              placeholder={t.auth.verificationCodePlaceholder}
              value={verificationCode}
              onChange={(event) => setVerificationCode(event.target.value)}
              required
            />
            <Button
              type="button"
              variant="outline"
              disabled={sendingCode}
              onClick={handleSendCode}
            >
              {sendingCode ? "已发送" : t.auth.sendCode}
            </Button>
          </div>
          <FieldError>{error}</FieldError>
        </Field>
        <Field>
          <Button type="submit" disabled={pending}>
            {pending ? `${t.auth.next}...` : t.auth.next}
          </Button>
        </Field>
      </FieldGroup>
    </form>
  )
}
