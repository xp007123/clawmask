"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

function Conversation({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="conversation"
      className={cn("relative flex min-h-0 flex-1 flex-col overflow-hidden", className)}
      {...props}
    />
  )
}

function ConversationContent({
  children,
  className,
  ...props
}: React.ComponentProps<"div">) {
  const ref = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const element = ref.current
    if (!element) {
      return
    }

    element.scrollTop = element.scrollHeight
  }, [children])

  return (
    <div
      ref={ref}
      data-slot="conversation-content"
      className={cn("flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto", className)}
      {...props}
    >
      {children}
    </div>
  )
}

export { Conversation, ConversationContent }
