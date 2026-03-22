"use client"

import type { ComponentProps } from "react"
import Link from "next/link"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import { SidebarTools } from "@/components/sidebar-tools"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import {
  BotIcon,
  CommandIcon,
  LandmarkIcon,
  SettingsIcon,
  WalletCardsIcon,
} from "lucide-react"

const data = {
  user: {
    name: "CryptoKing",
    email: "133****6589",
    avatar: "",
  },
  navMain: [
    {
      title: "首页",
      url: "/",
      icon: <LandmarkIcon />,
    },
    {
      title: "币安智能体",
      url: "/agent/binance",
      icon: <BotIcon />,
    },
    {
      title: "欧易智能体",
      url: "/agent/okx",
      icon: <BotIcon />,
    },
    {
      title: "MADEX 智能体",
      url: "/agent/madex",
      icon: <BotIcon />,
    },
    {
      title: "Clawmask 钱包",
      url: "/wallet",
      icon: <WalletCardsIcon />,
    },
    {
      title: "设置",
      url: "/settings",
      icon: <SettingsIcon />,
    },
  ],
}
export function AppSidebar({ ...props }: ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              className="data-[slot=sidebar-menu-button]:p-1.5!"
              render={<Link href="/" />}
            >
              <CommandIcon className="size-5!" />
              <span className="text-base font-semibold">clawmask</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <div className="mt-auto">
          <SidebarTools />
        </div>
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
