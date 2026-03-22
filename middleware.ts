import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"

import { AUTH_COOKIE_NAME, isAuthRoute } from "./lib/auth"

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl
  const authenticated =
    request.cookies.get(AUTH_COOKIE_NAME)?.value === "1"
  const authRoute = isAuthRoute(pathname)

  if (!authenticated && !authRoute) {
    const loginUrl = new URL("/login", request.url)
    const nextPath = `${pathname}${search}`

    if (nextPath !== "/") {
      loginUrl.searchParams.set("next", nextPath)
    }

    return NextResponse.redirect(loginUrl)
  }

  if (authenticated && authRoute) {
    return NextResponse.redirect(new URL("/", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
}
