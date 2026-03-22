"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { createClientSession, hasRegisteredUser, isInviteCodeValid, registerStoredUser } from "@/lib/auth-client"
import {
  DEMO_INVITE_CODE,
  DEMO_VERIFICATION_CODE,
  LOGIN_PASSWORD_MIN_LENGTH,
  PAYMENT_PASSWORD_PATTERN,
  PHONE_PATTERN,
  normalizePhone,
} from "@/lib/auth"
import { useLocale } from "@/components/locale-provider"

export function RegisterForm() {
  const router = useRouter()
  const { t } = useLocale()
  const [inviteCode, setInviteCode] = useState("")
  const [phone, setPhone] = useState("")
  const [verificationCode, setVerificationCode] = useState("")
  const [password, setPassword] = useState("")
  const [paymentPassword, setPaymentPassword] = useState("")
  const [error, setError] = useState("")
  const [pending, setPending] = useState(false)
  const [sendingCode, setSendingCode] = useState(false)

  function handleSendCode() {
    const normalizedPhone = normalizePhone(phone)

    if (!isInviteCodeValid(inviteCode)) {
      setError("邀请码无效")
      return
    }

    if (!PHONE_PATTERN.test(normalizedPhone)) {
      setError("请输入正确的手机号")
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

    if (!isInviteCodeValid(inviteCode)) {
      setError("邀请码无效")
      return
    }

    if (!PHONE_PATTERN.test(normalizedPhone)) {
      setError("请输入正确的手机号")
      return
    }

    if (verificationCode.trim() !== DEMO_VERIFICATION_CODE) {
      setError("验证码错误")
      return
    }

    if (password.trim().length < LOGIN_PASSWORD_MIN_LENGTH) {
      setError(`登录密码至少 ${LOGIN_PASSWORD_MIN_LENGTH} 位`)
      return
    }

    if (!PAYMENT_PASSWORD_PATTERN.test(paymentPassword.trim())) {
      setError("支付密码需为 6 位数字")
      return
    }

    if (hasRegisteredUser(normalizedPhone)) {
      setError("该手机号已注册")
      return
    }

    setPending(true)
    setError("")

    registerStoredUser({
      inviteCode: inviteCode.trim().toUpperCase(),
      phone: normalizedPhone,
      password: password.trim(),
      paymentPassword: paymentPassword.trim(),
    })

    createClientSession(normalizedPhone, { remember: true })
    toast.success("账号创建成功")
    router.replace("/")
    router.refresh()
  }

  return (
    <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">{t.auth.register}</h1>
          <p className="text-sm text-muted-foreground">{t.auth.registerDesc}</p>
        </div>
        <Field>
          <div className="flex items-center">
            <FieldLabel htmlFor="invite-code">{t.auth.inviteCode}</FieldLabel>
            <button
              type="button"
              className="ml-auto text-sm underline-offset-4 hover:underline"
              onClick={() => toast.message(`演示邀请码：${DEMO_INVITE_CODE}`)}
            >
              怎么获取？
            </button>
          </div>
          <Input
            id="invite-code"
            placeholder={t.auth.inviteCodePlaceholder}
            value={inviteCode}
            onChange={(event) => setInviteCode(event.target.value)}
            required
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="register-phone">{t.auth.phone}</FieldLabel>
          <Input
            id="register-phone"
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
          <FieldLabel htmlFor="register-code">{t.auth.verificationCode}</FieldLabel>
          <div className="flex gap-2">
            <Input
              id="register-code"
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
        </Field>
        <Field>
          <FieldLabel htmlFor="register-password">{t.auth.password}</FieldLabel>
          <Input
            id="register-password"
            type="password"
            autoComplete="new-password"
            placeholder={t.auth.passwordPlaceholder}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="payment-password">{t.settings.paymentPassword}</FieldLabel>
          <Input
            id="payment-password"
            type="password"
            inputMode="numeric"
            autoComplete="off"
            placeholder={t.settings.paymentPasswordPlaceholder}
            value={paymentPassword}
            onChange={(event) => setPaymentPassword(event.target.value)}
            required
          />
          <FieldDescription>{t.settings.setPaymentPasswordDesc}</FieldDescription>
          <FieldError>{error}</FieldError>
        </Field>
        <Field>
          <Button type="submit" disabled={pending}>
            {pending ? `${t.auth.register}...` : t.auth.register}
          </Button>
          <FieldDescription className="text-center">
            <Link href="/login" className="underline underline-offset-4">
              {t.auth.backToLogin}
            </Link>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  )
}
