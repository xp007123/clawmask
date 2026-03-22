"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { WalletCardsIcon } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { createClientSession, findStoredUser } from "@/lib/auth-client"
import {
  DEFAULT_TEST_USER,
  LOGIN_PASSWORD_MIN_LENGTH,
  PHONE_PATTERN,
  normalizePhone,
} from "@/lib/auth"
import { cn } from "@/lib/utils"
import { useLocale } from "@/components/locale-provider"

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { t } = useLocale()
  const [phone, setPhone] = useState("")
  const [password, setPassword] = useState("")
  const [remember, setRemember] = useState(false)
  const [error, setError] = useState("")
  const [pending, setPending] = useState(false)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const normalizedPhone = normalizePhone(phone)

    if (!PHONE_PATTERN.test(normalizedPhone)) {
      setError("请输入正确的手机号")
      return
    }

    if (password.trim().length < LOGIN_PASSWORD_MIN_LENGTH) {
      setError("请输入正确的登录密码")
      return
    }

    const user = findStoredUser(normalizedPhone)

    if (!user || user.password !== password) {
      setError("手机号或密码错误")
      return
    }

    setPending(true)
    setError("")
    createClientSession(normalizedPhone, { remember })
    toast.success("登录成功")

    const nextPath = searchParams.get("next") || "/"

    router.replace(nextPath)
    router.refresh()
  }

  return (
    <form
      className={cn("flex flex-col gap-6", className)}
      onSubmit={handleSubmit}
      {...props}
    >
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">{t.auth.login} Clawmask</h1>
          <p className="text-sm text-muted-foreground">
            财富预言机, 精准判断下一秒。
          </p>
        </div>
        <Field>
          <FieldLabel htmlFor="phone">{t.auth.phone}</FieldLabel>
          <Input
            id="phone"
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
          <div className="flex items-center">
            <FieldLabel htmlFor="password">{t.auth.password}</FieldLabel>
            <Link
              href="/forgot-password"
              className="ml-auto text-sm underline-offset-4 hover:underline"
            >
              {t.auth.forgotPassword}
            </Link>
          </div>
          <Input
            id="password"
            type="password"
            autoComplete="current-password"
            placeholder={t.auth.passwordPlaceholder}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </Field>
        <Field>
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <label htmlFor="remember" className="flex items-center gap-2">
              <Checkbox
                id="remember"
                checked={remember}
                onCheckedChange={(checked) => setRemember(Boolean(checked))}
              />
              <span>{t.auth.rememberMe}</span>
            </label>
          </div>
          <FieldError>{error}</FieldError>
        </Field>
        <Field>
          <Button type="submit" disabled={pending}>
            {pending ? `${t.auth.login}...` : t.auth.login}
          </Button>
        </Field>
        <FieldSeparator>或继续使用</FieldSeparator>
        <Field>
          <Button
            variant="outline"
            type="button"
            onClick={() => toast.info("当前钱包未绑定，请先注册")}
          >
            <WalletCardsIcon />
            Clawmask 钱包登录
          </Button>
          <FieldDescription className="text-center">
            {t.auth.noAccount}{" "}
            <Link href="/register" className="underline underline-offset-4">
              {t.auth.register}
            </Link>
          </FieldDescription>
          <FieldDescription className="text-center">
            不需要手机号登录
          </FieldDescription>
          <FieldDescription className="text-center">
            测试账号：{DEFAULT_TEST_USER.phone} / {DEFAULT_TEST_USER.password}
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  )
}
