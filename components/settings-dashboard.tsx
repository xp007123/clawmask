"use client"

import * as React from "react"
import { useSyncExternalStore } from "react"
import { toast } from "sonner"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  AUTH_PROFILE_CHANGE_EVENT,
  findStoredUser,
  getClientProfile,
  getClientProfileCookieValue,
  refreshClientProfile,
  updateStoredUserPassword,
  updateStoredUserPaymentPassword,
  updateStoredUserPhone,
  updateStoredUserProfile,
} from "@/lib/auth-client"
import {
  DEFAULT_TEST_USER,
  DEMO_VERIFICATION_CODE,
  LOGIN_PASSWORD_MIN_LENGTH,
  PAYMENT_PASSWORD_PATTERN,
  PHONE_PATTERN,
} from "@/lib/auth"
import {
  getStoredApiConfigs,
  saveStoredApiConfigs,
  type SettingsProviderId,
  type StoredApiConfigMap,
} from "@/lib/settings-client"
import { cn } from "@/lib/utils"
import { useLocale } from "@/components/locale-provider"
import {
  ChevronDownIcon,
  ChevronUpIcon,
  EyeIcon,
  EyeOffIcon,
  Loader2Icon,
  LockKeyholeIcon,
  MailIcon,
  ShieldCheckIcon,
  SmartphoneIcon,
  UserRoundIcon,
} from "lucide-react"

type ApiTestState = "idle" | "loading" | "success" | "error"
type AccountDialog =
  | "phone"
  | "login-password"
  | "email"
  | "username"
  | "fund-password"
  | null

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

const providerMeta: Record<
  SettingsProviderId,
  {
    label: string
    helper: string
    helpHref: string
    mark: string
    tone: string
  }
> = {
  binance: {
    label: "币安 API",
    helper: "配置您的币安 API 密钥以使用智能体交易",
    helpHref: "https://www.binance.com/zh-CN/support/faq",
    mark: "币",
    tone: "bg-amber-500/12 text-amber-300 ring-1 ring-amber-500/20",
  },
  okx: {
    label: "欧易 API",
    helper: "配置您的欧易 API 密钥以使用智能体交易",
    helpHref: "https://www.okx.com/zh-hans/help",
    mark: "欧",
    tone: "bg-sky-500/12 text-sky-300 ring-1 ring-sky-500/20",
  },
}

function maskPhone(phone: string) {
  if (phone.length < 7) {
    return phone
  }

  return `${phone.slice(0, 3)}****${phone.slice(-4)}`
}

function isEmailValid(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())
}

function buildActionItems(user: typeof DEFAULT_TEST_USER & { name?: string; email?: string }, t: any) {
  return [
    {
      id: "phone" as const,
      title: t.settings.changePhone,
      description: `${t.settings.currentPhone}：${maskPhone(user.phone)}`,
      action: t.settings.modify,
      icon: SmartphoneIcon,
      tone: "bg-emerald-500/10 text-emerald-300",
    },
    {
      id: "login-password" as const,
      title: t.settings.changePassword,
      description: t.settings.changePasswordDesc,
      action: t.settings.modify,
      icon: LockKeyholeIcon,
      tone: "bg-amber-500/10 text-amber-300",
    },
    {
      id: "email" as const,
      title: user.email ? t.settings.bindEmail : t.settings.bindEmail,
      description: user.email
        ? `${t.settings.emailLabel}：${user.email}`
        : t.settings.bindEmailDesc,
      action: user.email ? t.settings.modify : t.settings.bind,
      icon: MailIcon,
      tone: "bg-sky-500/10 text-sky-300",
    },
    {
      id: "username" as const,
      title: t.settings.changeUsername,
      description: `${t.settings.usernameLabel}：${user.name?.trim() || "MA168746516"}`,
      action: t.settings.modify,
      icon: UserRoundIcon,
      tone: "bg-zinc-500/10 text-zinc-300",
    },
    {
      id: "fund-password" as const,
      title: t.settings.setPaymentPassword,
      description: t.settings.setPaymentPasswordDesc,
      action: t.settings.modify,
      icon: ShieldCheckIcon,
      tone: "bg-fuchsia-500/10 text-fuchsia-300",
    },
  ]
}

export function SettingsDashboard() {
  const { t } = useLocale()
  const [tab, setTab] = React.useState("api")
  const [selectedCurrency, setSelectedCurrency] = React.useState<"MA" | "KYC">("MA")
  const [openProviders, setOpenProviders] = React.useState<Set<SettingsProviderId>>(
    () => new Set(["binance", "okx"])
  )

  const toggleProvider = (providerId: SettingsProviderId) => {
    setOpenProviders((prev) => {
      const next = new Set(prev)
      if (next.has(providerId)) {
        next.delete(providerId)
      } else {
        next.add(providerId)
      }
      return next
    })
  }
  const [apiConfigs, setApiConfigs] =
    React.useState<StoredApiConfigMap>(defaultApiConfigs)
  const [apiDrafts, setApiDrafts] =
    React.useState<StoredApiConfigMap>(defaultApiConfigs)
  const [testStates, setTestStates] = React.useState<
    Record<SettingsProviderId, ApiTestState>
  >({
    binance: "idle",
    okx: "idle",
  })
  const [savingProvider, setSavingProvider] =
    React.useState<SettingsProviderId | null>(null)
  const [secretVisible, setSecretVisible] = React.useState<
    Record<SettingsProviderId, boolean>
  >({
    binance: false,
    okx: false,
  })
  const [accountDialog, setAccountDialog] = React.useState<AccountDialog>(null)
  const [dialogError, setDialogError] = React.useState("")
  const [phoneForm, setPhoneForm] = React.useState({
    nextPhone: "",
    code: "",
  })
  const [loginPasswordForm, setLoginPasswordForm] = React.useState({
    currentPassword: "",
    nextPassword: "",
    confirmPassword: "",
  })
  const [emailForm, setEmailForm] = React.useState({
    email: "",
  })
  const [usernameForm, setUsernameForm] = React.useState({
    name: "",
  })
  const [fundPasswordForm, setFundPasswordForm] = React.useState({
    currentPassword: "",
    nextPassword: "",
    confirmPassword: "",
  })

  const profileCookie = useSyncExternalStore(
    (onStoreChange) => {
      window.addEventListener("storage", onStoreChange)
      window.addEventListener(AUTH_PROFILE_CHANGE_EVENT, onStoreChange)

      return () => {
        window.removeEventListener("storage", onStoreChange)
        window.removeEventListener(AUTH_PROFILE_CHANGE_EVENT, onStoreChange)
      }
    },
    () => getClientProfileCookieValue(),
    () => ""
  )

  const profile = React.useMemo(
    () => (profileCookie ? getClientProfile() : null),
    [profileCookie]
  )
  const currentUser =
    (profile?.phone ? findStoredUser(profile.phone) : null) ?? DEFAULT_TEST_USER
  const accountItems = buildActionItems({
    ...currentUser,
    name: currentUser.name || profile?.name || "MA168746516",
  }, t)

  React.useEffect(() => {
    const storedConfigs = getStoredApiConfigs()
    setApiConfigs(storedConfigs)
    setApiDrafts(storedConfigs)
  }, [])

  const handleApiFieldChange = (
    providerId: SettingsProviderId,
    field: "apiKey" | "secretKey",
    value: string
  ) => {
    setApiDrafts((current) => ({
      ...current,
      [providerId]: {
        ...current[providerId],
        [field]: value,
      },
    }))
    setTestStates((current) => ({
      ...current,
      [providerId]: "idle",
    }))
  }

  const handleApiTest = (providerId: SettingsProviderId) => {
    const draft = apiDrafts[providerId]

    if (!draft.apiKey.trim() || !draft.secretKey.trim()) {
      toast.error("请完整填写 API Key 和 Secret Key")
      setTestStates((current) => ({
        ...current,
        [providerId]: "error",
      }))
      return
    }

    setTestStates((current) => ({
      ...current,
      [providerId]: "loading",
    }))

    window.setTimeout(() => {
      const isValid =
        draft.apiKey.trim().length >= 8 &&
        draft.secretKey.trim().length >= 8 &&
        !draft.apiKey.includes(" ") &&
        !draft.secretKey.includes(" ")

      setTestStates((current) => ({
        ...current,
        [providerId]: isValid ? "success" : "error",
      }))

      if (isValid) {
        toast.success("API 连接正常")
      } else {
        toast.error("API 连接失败，请检查 Key、权限或网络")
      }
    }, 900)
  }

  const handleApiSave = (providerId: SettingsProviderId) => {
    const draft = apiDrafts[providerId]

    if (!draft.apiKey.trim() || !draft.secretKey.trim()) {
      toast.error("请完整填写 API Key 和 Secret Key")
      return
    }

    setSavingProvider(providerId)

    window.setTimeout(() => {
      const nextConfigs = {
        ...apiConfigs,
        [providerId]: {
          apiKey: draft.apiKey.trim(),
          secretKey: draft.secretKey.trim(),
          configured: true,
          lastTestedAt: new Date().toISOString(),
        },
      }

      setApiConfigs(nextConfigs)
      setApiDrafts(nextConfigs)
      saveStoredApiConfigs(nextConfigs)
      setSavingProvider(null)
      setTestStates((current) => ({
        ...current,
        [providerId]: current[providerId] === "error" ? "idle" : current[providerId],
      }))
      toast.success("API 配置已保存")
    }, 500)
  }

  const openAccountAction = (dialog: Exclude<AccountDialog, null>) => {
    setDialogError("")
    setAccountDialog(dialog)
    setPhoneForm({
      nextPhone: currentUser.phone,
      code: "",
    })
    setLoginPasswordForm({
      currentPassword: "",
      nextPassword: "",
      confirmPassword: "",
    })
    setEmailForm({
      email: currentUser.email ?? "",
    })
    setUsernameForm({
      name: currentUser.name?.trim() || profile?.name || "MA168746516",
    })
    setFundPasswordForm({
      currentPassword: "",
      nextPassword: "",
      confirmPassword: "",
    })
  }

  const closeAccountDialog = () => {
    setAccountDialog(null)
    setDialogError("")
  }

  const handlePhoneSubmit = () => {
    const nextPhone = phoneForm.nextPhone.trim()

    if (!PHONE_PATTERN.test(nextPhone)) {
      setDialogError("请输入正确的手机号")
      return
    }

    if (nextPhone === currentUser.phone) {
      setDialogError("新手机号不能与当前手机号相同")
      return
    }

    if (phoneForm.code.trim() !== DEMO_VERIFICATION_CODE) {
      setDialogError("验证码错误")
      return
    }

    const existing = findStoredUser(nextPhone)

    if (existing && existing.phone !== currentUser.phone) {
      setDialogError("该手机号已被使用")
      return
    }

    updateStoredUserPhone(currentUser.phone, nextPhone)
    refreshClientProfile(nextPhone)
    toast.success("设置已更新")
    closeAccountDialog()
  }

  const handleLoginPasswordSubmit = () => {
    if (loginPasswordForm.currentPassword !== currentUser.password) {
      setDialogError("当前登录密码错误")
      return
    }

    if (loginPasswordForm.nextPassword.trim().length < LOGIN_PASSWORD_MIN_LENGTH) {
      setDialogError(`新密码至少 ${LOGIN_PASSWORD_MIN_LENGTH} 位`)
      return
    }

    if (loginPasswordForm.nextPassword !== loginPasswordForm.confirmPassword) {
      setDialogError("两次输入的密码不一致")
      return
    }

    updateStoredUserPassword(currentUser.phone, loginPasswordForm.nextPassword.trim())
    toast.success("设置已更新")
    closeAccountDialog()
  }

  const handleEmailSubmit = () => {
    if (!isEmailValid(emailForm.email)) {
      setDialogError("请输入正确的邮箱地址")
      return
    }

    updateStoredUserProfile(currentUser.phone, {
      email: emailForm.email.trim(),
    })
    toast.success("设置已更新")
    closeAccountDialog()
  }

  const handleUsernameSubmit = () => {
    const nextName = usernameForm.name.trim()

    if (nextName.length < 2) {
      setDialogError("用户名至少 2 个字符")
      return
    }

    updateStoredUserProfile(currentUser.phone, {
      name: nextName,
    })
    refreshClientProfile(currentUser.phone)
    toast.success("设置已更新")
    closeAccountDialog()
  }

  const handleFundPasswordSubmit = () => {
    if (fundPasswordForm.currentPassword !== currentUser.paymentPassword) {
      setDialogError("当前资金密码错误")
      return
    }

    if (!PAYMENT_PASSWORD_PATTERN.test(fundPasswordForm.nextPassword.trim())) {
      setDialogError("资金密码需为 6 位数字")
      return
    }

    if (fundPasswordForm.nextPassword !== fundPasswordForm.confirmPassword) {
      setDialogError("两次输入的密码不一致")
      return
    }

    updateStoredUserPaymentPassword(
      currentUser.phone,
      fundPasswordForm.nextPassword.trim()
    )
    toast.success("设置已更新")
    closeAccountDialog()
  }

  return (
    <div className="flex flex-1 flex-col">
      <div className="glass-page-wrapper">
      <div className="@container/main flex flex-1 flex-col gap-4 py-4 md:gap-6 md:py-6">
        <div className="flex flex-1 flex-col gap-4 px-4 lg:px-6 lg:gap-6">
          <div className="flex flex-1 flex-col rounded-2xl border border-border/60 bg-card/35 p-4 shadow-sm sm:p-5 lg:p-6 min-h-0">
            <Tabs
              value={tab}
              onValueChange={setTab}
              className="flex flex-1 flex-col gap-5 min-h-0"
            >
              <TabsList
                variant="line"
                className="h-auto gap-8 rounded-none border-b border-border/60 p-0"
              >
                <TabsTrigger
                  value="api"
                  className="rounded-none px-0 pb-3 text-base font-medium data-active:text-foreground after:bottom-[-1px]"
                >
                  {t.settings.apiManagement}
                </TabsTrigger>
                <TabsTrigger
                  value="account"
                  className="rounded-none px-0 pb-3 text-base font-medium data-active:text-foreground after:bottom-[-1px]"
                >
                  {t.settings.accountManagement}
                </TabsTrigger>
                <TabsTrigger
                  value="currency"
                  className="rounded-none px-0 pb-3 text-base font-medium data-active:text-foreground after:bottom-[-1px]"
                >
                  {t.settings.currencyConfig}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="api" className="flex flex-1 flex-col pt-1 min-h-0 overflow-auto">
                <div className="grid gap-4 lg:grid-cols-2">
                  {(Object.keys(providerMeta) as SettingsProviderId[]).map(
                    (providerId) => {
                      const provider = providerMeta[providerId]
                      const isOpen = openProviders.has(providerId)
                      const testState = testStates[providerId]
                      const config = apiConfigs[providerId]
                      const draft = apiDrafts[providerId]

                      return (
                        <section
                          key={providerId}
                          className="overflow-hidden rounded-xl border border-border/60 bg-background/35"
                        >
                          <div className="flex flex-wrap items-start justify-between gap-4 px-5 py-5">
                            <div className="flex min-w-0 items-start gap-4">
                              <div
                                className={cn(
                                  "flex size-11 shrink-0 items-center justify-center rounded-full text-sm font-semibold",
                                  provider.tone
                                )}
                              >
                                {provider.mark}
                              </div>
                              <div className="min-w-0 space-y-1">
                                <div className="flex flex-wrap items-center gap-2">
                                  <h3 className="text-lg font-semibold">
                                    {provider.label}
                                  </h3>
                                  <Badge
                                    variant="outline"
                                    className={cn(
                                      "rounded-full border-transparent px-3 py-1 text-xs",
                                      config.configured
                                        ? "bg-emerald-500/10 text-emerald-300"
                                        : "bg-muted text-muted-foreground"
                                    )}
                                  >
                                    {config.configured ? t.settings.connected : t.settings.notConnected}
                                  </Badge>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                  {provider.helper}
                                  <a
                                    href={provider.helpHref}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="ml-2 text-primary hover:underline"
                                  >
                                    如何获取？
                                  </a>
                                </p>
                              </div>
                            </div>

                            <Button
                              variant="ghost"
                              size="icon"
                              className="size-9 rounded-full lg:hidden"
                              onClick={() => toggleProvider(providerId)}
                            >
                              {isOpen ? (
                                <ChevronUpIcon className="size-4" />
                              ) : (
                                <ChevronDownIcon className="size-4" />
                              )}
                            </Button>
                          </div>

                          <div className={cn(
                            "space-y-5 border-t border-border/60 px-5 py-5",
                            isOpen ? "block" : "hidden",
                            "lg:block"
                          )}>
                            <div className="space-y-2">
                              <Label htmlFor={`${providerId}-api-key`}>
                                API Key
                              </Label>
                              <Input
                                id={`${providerId}-api-key`}
                                value={draft.apiKey}
                                placeholder="请输入您的 API Key"
                                onChange={(event) =>
                                  handleApiFieldChange(
                                    providerId,
                                    "apiKey",
                                    event.target.value
                                  )
                                }
                              />
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor={`${providerId}-secret-key`}>
                                Secret Key
                              </Label>
                              <div className="relative">
                                <Input
                                  id={`${providerId}-secret-key`}
                                  type={secretVisible[providerId] ? "text" : "password"}
                                  value={draft.secretKey}
                                  placeholder="请输入您的 Secret Key"
                                  className="pr-12"
                                  onChange={(event) =>
                                    handleApiFieldChange(
                                      providerId,
                                      "secretKey",
                                      event.target.value
                                    )
                                  }
                                />
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  className="absolute right-1 top-1/2 -translate-y-1/2 size-8 rounded-full text-muted-foreground transition-none hover:bg-transparent active:bg-transparent"
                                  onClick={() =>
                                    setSecretVisible((current) => ({
                                      ...current,
                                      [providerId]: !current[providerId],
                                    }))
                                  }
                                >
                                  {secretVisible[providerId] ? (
                                    <EyeOffIcon className="size-4" />
                                  ) : (
                                    <EyeIcon className="size-4" />
                                  )}
                                </Button>
                              </div>
                            </div>

                            <div className="flex flex-wrap items-center gap-3">
                              <Button
                                onClick={() => handleApiSave(providerId)}
                                disabled={savingProvider === providerId}
                              >
                                {savingProvider === providerId ? (
                                  <>
                                    <Loader2Icon className="size-4 animate-spin" />
                                    {t.settings.save}
                                  </>
                                ) : (
                                  t.settings.save
                                )}
                              </Button>
                              <Button
                                variant="outline"
                                onClick={() => handleApiTest(providerId)}
                                disabled={testState === "loading"}
                              >
                                {testState === "loading" ? (
                                  <>
                                    <Loader2Icon className="size-4 animate-spin" />
                                    {t.settings.testConnection}
                                  </>
                                ) : (
                                  t.settings.testConnection
                                )}
                              </Button>
                              {testState === "success" ? (
                                <span className="text-sm text-emerald-300">
                                  API 连接正常
                                </span>
                              ) : null}
                              {testState === "error" ? (
                                <span className="text-sm text-destructive">
                                  请检查 Key、权限或网络
                                </span>
                              ) : null}
                            </div>
                          </div>
                        </section>
                      )
                    }
                  )}
                </div>
              </TabsContent>

              <TabsContent value="account" className="flex flex-1 flex-col space-y-4 pt-1 min-h-0 overflow-auto">
                {accountItems.map((item) => {
                  const Icon = item.icon

                  return (
                    <div
                      key={item.id}
                      className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-border/60 bg-background/35 px-5 py-5"
                    >
                      <div className="flex min-w-0 items-center gap-4">
                        <div
                          className={cn(
                            "flex size-11 shrink-0 items-center justify-center rounded-full",
                            item.tone
                          )}
                        >
                          <Icon className="size-5" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-base font-medium">{item.title}</p>
                          <p className="mt-1 text-sm text-muted-foreground">
                            {item.description}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        className="min-w-20"
                        onClick={() => openAccountAction(item.id)}
                      >
                        {item.action}
                      </Button>
                    </div>
                  )
                })}
              </TabsContent>

              <TabsContent value="currency" className="flex flex-1 flex-col pt-1 min-h-0 overflow-auto">
                <div className="rounded-xl border border-border/60 bg-background/35 p-5 lg:p-6">
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-2">{t.settings.currencyConfig}</h3>
                    <p className="text-sm text-muted-foreground">{t.settings.currencyConfigDesc}</p>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <button
                      onClick={() => setSelectedCurrency("MA")}
                      className={cn(
                        "relative rounded-xl border-2 p-6 text-left transition-all",
                        selectedCurrency === "MA"
                          ? "border-[var(--cm-primary)] bg-[var(--cm-primary)]/5"
                          : "border-border/60 hover:border-border"
                      )}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-[var(--cm-primary)]/10 text-[var(--cm-primary)] flex items-center justify-center font-bold text-lg">
                            MA
                          </div>
                          <div>
                            <p className="font-semibold text-base">{t.settings.maToken}</p>
                            <p className="text-xs text-muted-foreground">MA Token</p>
                          </div>
                        </div>
                        {selectedCurrency === "MA" && (
                          <Badge className="bg-[var(--cm-primary)] text-white">
                            {t.settings.currencySelected}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {t.settings.maTokenDesc}
                      </p>
                    </button>

                    <button
                      onClick={() => setSelectedCurrency("KYC")}
                      className={cn(
                        "relative rounded-xl border-2 p-6 text-left transition-all",
                        selectedCurrency === "KYC"
                          ? "border-[var(--cm-primary)] bg-[var(--cm-primary)]/5"
                          : "border-border/60 hover:border-border"
                      )}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-bold text-lg">
                            KYC
                          </div>
                          <div>
                            <p className="font-semibold text-base">{t.settings.kycToken}</p>
                            <p className="text-xs text-muted-foreground">KYC Token</p>
                          </div>
                        </div>
                        {selectedCurrency === "KYC" && (
                          <Badge className="bg-[var(--cm-primary)] text-white">
                            {t.settings.currencySelected}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {t.settings.kycTokenDesc}
                      </p>
                    </button>
                  </div>
                  <div className="mt-6 pt-6 border-t border-border/60">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">{t.settings.selectCurrency}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {t.settings.currentlySelected}: <span className="font-semibold text-[var(--cm-primary)]">{selectedCurrency}</span>
                        </p>
                      </div>
                      <Button onClick={() => toast.success("币种配置已保存")}>
                        {t.settings.save}
                      </Button>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
      </div>

      <Dialog open={accountDialog === "phone"} onOpenChange={(open) => !open && closeAccountDialog()}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t.settings.changePhone}</DialogTitle>
            <DialogDescription>{t.settings.changePhoneDesc}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>{t.settings.currentPhone}</Label>
              <Input value={currentUser.phone} disabled />
            </div>
            <div className="space-y-2">
              <Label htmlFor="next-phone">{t.settings.newPhone}</Label>
              <Input
                id="next-phone"
                value={phoneForm.nextPhone}
                placeholder={t.settings.newPhonePlaceholder}
                onChange={(event) =>
                  setPhoneForm((current) => ({
                    ...current,
                    nextPhone: event.target.value,
                  }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone-code">{t.settings.verificationCode}</Label>
              <Input
                id="phone-code"
                value={phoneForm.code}
                placeholder={t.settings.verificationCodePlaceholder}
                onChange={(event) =>
                  setPhoneForm((current) => ({
                    ...current,
                    code: event.target.value,
                  }))
                }
              />
              <p className="text-xs text-muted-foreground">演示验证码：123456</p>
            </div>
            {dialogError ? (
              <p className="text-sm text-destructive">{dialogError}</p>
            ) : null}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={closeAccountDialog}>
              {t.nav.cancel}
            </Button>
            <Button onClick={handlePhoneSubmit}>{t.settings.confirm}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={accountDialog === "login-password"}
        onOpenChange={(open) => !open && closeAccountDialog()}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t.settings.changePassword}</DialogTitle>
            <DialogDescription>{t.settings.changePasswordDesc}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="current-login-password">{t.settings.currentPassword}</Label>
              <Input
                id="current-login-password"
                type="password"
                value={loginPasswordForm.currentPassword}
                placeholder={t.settings.currentPasswordPlaceholder}
                onChange={(event) =>
                  setLoginPasswordForm((current) => ({
                    ...current,
                    currentPassword: event.target.value,
                  }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="next-login-password">{t.settings.newPassword}</Label>
              <Input
                id="next-login-password"
                type="password"
                value={loginPasswordForm.nextPassword}
                placeholder={t.settings.newPasswordPlaceholder}
                onChange={(event) =>
                  setLoginPasswordForm((current) => ({
                    ...current,
                    nextPassword: event.target.value,
                  }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-login-password">{t.settings.confirmPassword}</Label>
              <Input
                id="confirm-login-password"
                type="password"
                value={loginPasswordForm.confirmPassword}
                placeholder={t.settings.confirmPasswordPlaceholder}
                onChange={(event) =>
                  setLoginPasswordForm((current) => ({
                    ...current,
                    confirmPassword: event.target.value,
                  }))
                }
              />
            </div>
            {dialogError ? (
              <p className="text-sm text-destructive">{dialogError}</p>
            ) : null}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={closeAccountDialog}>
              {t.nav.cancel}
            </Button>
            <Button onClick={handleLoginPasswordSubmit}>{t.settings.confirm}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={accountDialog === "email"} onOpenChange={(open) => !open && closeAccountDialog()}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{currentUser.email ? t.settings.bindEmail : t.settings.bindEmail}</DialogTitle>
            <DialogDescription>{t.settings.bindEmailDesc}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="account-email">{t.settings.email}</Label>
              <Input
                id="account-email"
                type="email"
                value={emailForm.email}
                placeholder={t.settings.emailPlaceholder}
                onChange={(event) =>
                  setEmailForm({
                    email: event.target.value,
                  })
                }
              />
            </div>
            {dialogError ? (
              <p className="text-sm text-destructive">{dialogError}</p>
            ) : null}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={closeAccountDialog}>
              {t.nav.cancel}
            </Button>
            <Button onClick={handleEmailSubmit}>
              {currentUser.email ? t.settings.confirm : t.settings.bind}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={accountDialog === "username"}
        onOpenChange={(open) => !open && closeAccountDialog()}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t.settings.changeUsername}</DialogTitle>
            <DialogDescription>{t.settings.changeUsernameDesc}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="account-name">{t.settings.username}</Label>
              <Input
                id="account-name"
                value={usernameForm.name}
                placeholder={t.settings.usernamePlaceholder}
                onChange={(event) =>
                  setUsernameForm({
                    name: event.target.value,
                  })
                }
              />
            </div>
            {dialogError ? (
              <p className="text-sm text-destructive">{dialogError}</p>
            ) : null}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={closeAccountDialog}>
              {t.nav.cancel}
            </Button>
            <Button onClick={handleUsernameSubmit}>{t.settings.confirm}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={accountDialog === "fund-password"}
        onOpenChange={(open) => !open && closeAccountDialog()}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t.settings.setPaymentPassword}</DialogTitle>
            <DialogDescription>{t.settings.setPaymentPasswordDesc}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="current-fund-password">{t.settings.currentPassword}</Label>
              <Input
                id="current-fund-password"
                type="password"
                value={fundPasswordForm.currentPassword}
                placeholder={t.settings.paymentPasswordPlaceholder}
                onChange={(event) =>
                  setFundPasswordForm((current) => ({
                    ...current,
                    currentPassword: event.target.value,
                  }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="next-fund-password">{t.settings.paymentPassword}</Label>
              <Input
                id="next-fund-password"
                type="password"
                value={fundPasswordForm.nextPassword}
                placeholder={t.settings.paymentPasswordPlaceholder}
                onChange={(event) =>
                  setFundPasswordForm((current) => ({
                    ...current,
                    nextPassword: event.target.value,
                  }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-fund-password">{t.settings.confirmPaymentPassword}</Label>
              <Input
                id="confirm-fund-password"
                type="password"
                value={fundPasswordForm.confirmPassword}
                placeholder={t.settings.confirmPaymentPasswordPlaceholder}
                onChange={(event) =>
                  setFundPasswordForm((current) => ({
                    ...current,
                    confirmPassword: event.target.value,
                  }))
                }
              />
            </div>
            {dialogError ? (
              <p className="text-sm text-destructive">{dialogError}</p>
            ) : null}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={closeAccountDialog}>
              {t.nav.cancel}
            </Button>
            <Button onClick={handleFundPasswordSubmit}>{t.settings.confirm}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
