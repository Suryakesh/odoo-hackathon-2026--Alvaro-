import { NextResponse, type NextRequest } from "next/server"

import { SESSION_COOKIE_NAME } from "@/lib/auth"

const PROTECTED_PREFIXES = [
  "/dashboard",
  "/fleet",
  "/drivers",
  "/trips",
  "/maintenance",
  "/fuel-expenses",
  "/analytics",
  "/settings",
]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const isProtected = PROTECTED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  )

  if (!isProtected) return NextResponse.next()

  const hasSession = request.cookies.has(SESSION_COOKIE_NAME)
  if (hasSession) return NextResponse.next()

  const loginUrl = request.nextUrl.clone()
  loginUrl.pathname = "/login"
  loginUrl.searchParams.set("next", pathname)

  return NextResponse.redirect(loginUrl)
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/fleet/:path*",
    "/drivers/:path*",
    "/trips/:path*",
    "/maintenance/:path*",
    "/fuel-expenses/:path*",
    "/analytics/:path*",
    "/settings/:path*",
  ],
}
