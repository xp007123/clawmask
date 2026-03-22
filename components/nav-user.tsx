"use client"

import { useState, useSyncExternalStore } from "react"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import {
  EllipsisVerticalIcon,
  Globe2Icon,
  HeadsetIcon,
  LogOutIcon,
  SendIcon,
  TwitterIcon,
} from "lucide-react"
import {
  AUTH_PROFILE_CHANGE_EVENT,
  clearClientSession,
  getClientProfile,
  getClientProfileCookieValue,
} from "@/lib/auth-client"
import { AUTH_LOCALE_STORAGE_KEY } from "@/lib/auth"
import { cn } from "@/lib/utils"

const localeOptions = [
  { value: "zh-CN", label: "中文" },
  { value: "en", label: "English" },
] as const

const localeChangeEvent = "clawmask-locale-change"
const menuItemClassName =
  "gap-3 rounded-md px-3 py-3 text-[15px] transition-colors hover:bg-accent/80 hover:text-accent-foreground focus:bg-accent/80 focus:text-accent-foreground data-[highlighted]:bg-accent/80 data-[highlighted]:text-accent-foreground data-[popup-open]:bg-accent/80 data-[popup-open]:text-accent-foreground [&_svg]:size-5"

export function NavUser({
  user,
}: {
  user: {
    name: string
    email: string
    avatar: string
  }
}) {
  const { isMobile } = useSidebar()
  const [logoutOpen, setLogoutOpen] = useState(false)
  const profileCookie = useSyncExternalStore(
    (onStoreChange) => {
      window.addEventListener(AUTH_PROFILE_CHANGE_EVENT, onStoreChange)

      return () => {
        window.removeEventListener(AUTH_PROFILE_CHANGE_EVENT, onStoreChange)
      }
    },
    () => getClientProfileCookieValue(),
    () => ""
  )
  const profile = profileCookie ? getClientProfile() : null
  const locale = useSyncExternalStore(
    (onStoreChange) => {
      window.addEventListener("storage", onStoreChange)
      window.addEventListener(localeChangeEvent, onStoreChange)

      return () => {
        window.removeEventListener("storage", onStoreChange)
        window.removeEventListener(localeChangeEvent, onStoreChange)
      }
    },
    () =>
      window.localStorage.getItem(AUTH_LOCALE_STORAGE_KEY) ??
      localeOptions[0].value,
    () => localeOptions[0].value
  )
  const displayUser = profile
    ? {
        ...user,
        email: profile.phone,
        name: profile.name,
      }
    : user

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <SidebarMenuButton size="lg" className="aria-expanded:bg-muted" />
            }
          >
            <Avatar className="size-8 rounded-lg grayscale">
              <AvatarImage src={displayUser.avatar} alt={displayUser.name} />
              <AvatarFallback className="rounded-lg">CN</AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">{displayUser.name}</span>
              <span className="truncate text-xs text-foreground/70">
                {displayUser.email}
              </span>
            </div>
            <EllipsisVerticalIcon className="ml-auto size-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="min-w-60 p-2"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuGroup>
              <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-3 px-2 py-2.5 text-left text-sm">
                  <Avatar className="size-8">
                    <AvatarImage
                      src={displayUser.avatar}
                      alt={displayUser.name}
                    />
                    <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">
                      {displayUser.name}
                    </span>
                    <span className="truncate text-xs text-muted-foreground">
                      {displayUser.email}
                    </span>
                  </div>
                </div>
              </DropdownMenuLabel>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger className={cn("pr-2", menuItemClassName)}>
                  <Globe2Icon />
                  语言
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent className="min-w-40 p-2" sideOffset={8}>
                  {localeOptions.map((option) => (
                    <DropdownMenuItem
                      key={option.value}
                      className={menuItemClassName}
                      onClick={() => {
                        window.localStorage.setItem(
                          AUTH_LOCALE_STORAGE_KEY,
                          option.value
                        )
                        window.dispatchEvent(new Event(localeChangeEvent))
                      }}
                    >
                      <span>{option.label}</span>
                      {locale === option.value ? (
                        <span className="ml-auto text-xs text-muted-foreground">
                          当前
                        </span>
                      ) : null}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuSubContent>
              </DropdownMenuSub>
              <DropdownMenuItem className={menuItemClassName}>
                <HeadsetIcon />
                客服中心
              </DropdownMenuItem>
              <DropdownMenuItem className={menuItemClassName}>
                <SendIcon />
                Telegram
              </DropdownMenuItem>
              <DropdownMenuItem className={menuItemClassName}>
                <TwitterIcon />
                X
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className={menuItemClassName}
              onClick={() => setLogoutOpen(true)}
            >
              <LogOutIcon />
              退出登录
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>

      <Dialog open={logoutOpen} onOpenChange={setLogoutOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>退出登录？</DialogTitle>
            <DialogDescription>退出后将返回登录页。</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setLogoutOpen(false)}>
              取消
            </Button>
            <Button
              onClick={() => {
                clearClientSession()
                window.location.href = "/login"
              }}
            >
              退出登录
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </SidebarMenu>
  )
}
