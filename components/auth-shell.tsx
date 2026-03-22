import type { ReactNode } from "react"
import Link from "next/link"
import Image from "next/image"
import { CommandIcon } from "lucide-react"

import { AuthLanguageSwitcher } from "@/components/auth-language-switcher"

export function AuthShell({ children }: { children: ReactNode }) {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex items-center justify-between gap-4">
          <Link href="/login" className="flex items-center gap-2 font-medium">
            <div className="flex size-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <CommandIcon className="size-4" />
            </div>
            <span>Clawmask</span>
          </Link>
          <AuthLanguageSwitcher />
        </div>
      <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">{children}</div>
        </div>
      </div>
      <div className="relative hidden bg-muted lg:block">
        <Image
          src="/images/auth/BG01.png"
          alt="Agent cover"
          fill
          priority
          sizes="50vw"
          className="object-cover brightness-75 contrast-110"
        />
      </div>
    </div>
  )
}
