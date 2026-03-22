"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

type MessageProps = React.HTMLAttributes<HTMLDivElement> & {
  from: "user" | "assistant"
}

function Message({ className, from, ...props }: MessageProps) {
  return (
    <div
      data-slot="message"
      data-from={from}
      className={cn(
        "group/message flex w-full items-end gap-2.5 py-1.5",
        from === "user" ? "is-user justify-end" : "is-assistant justify-start",
        className
      )}
      {...props}
    />
  )
}

const messageContentVariants = cva(
  "flex flex-col gap-3 overflow-hidden text-sm",
  {
    variants: {
      variant: {
        contained: [
          "max-w-[min(100%,34rem)] rounded-2xl px-4 py-3 break-words",
          "group-[.is-user]/message:bg-primary group-[.is-user]/message:text-primary-foreground",
          "group-[.is-assistant]/message:bg-secondary group-[.is-assistant]/message:text-secondary-foreground",
        ],
        flat: [
          "group-[.is-user]/message:max-w-[min(100%,34rem)]",
          "group-[.is-user]/message:bg-secondary group-[.is-user]/message:px-4 group-[.is-user]/message:py-3 group-[.is-user]/message:text-foreground",
          "group-[.is-assistant]/message:max-w-none group-[.is-assistant]/message:text-foreground",
        ],
      },
    },
    defaultVariants: {
      variant: "contained",
    },
  }
)

type MessageContentProps = React.HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof messageContentVariants>

function MessageContent({
  className,
  variant,
  ...props
}: MessageContentProps) {
  return (
    <div
      data-slot="message-content"
      className={cn(messageContentVariants({ variant, className }))}
      {...props}
    />
  )
}

type MessageAvatarProps = React.ComponentProps<typeof Avatar> & {
  fallbackClassName?: string
  icon?: React.ReactNode
  src?: string
  name?: string
}

function MessageAvatar({
  className,
  fallbackClassName,
  icon,
  name,
  src,
  ...props
}: MessageAvatarProps) {
  return (
    <Avatar
      data-slot="message-avatar"
      className={cn("size-8 shrink-0", className)}
      {...props}
    >
      {src ? <AvatarImage alt="" className="mt-0 mb-0" src={src} /> : null}
      <AvatarFallback className={fallbackClassName}>
        {icon ?? name?.slice(0, 2) ?? "AI"}
      </AvatarFallback>
    </Avatar>
  )
}

export { Message, MessageAvatar, MessageContent }
