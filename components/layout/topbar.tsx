"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { LogOut, Search } from "lucide-react"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  getDisplayName,
  getInitials,
  parseSessionCookie,
  SESSION_COOKIE_NAME,
  type AuthSession,
} from "@/lib/auth"

function readSessionCookie(): AuthSession | null {
  const cookie = document.cookie
    .split("; ")
    .find((item) => item.startsWith(`${SESSION_COOKIE_NAME}=`))

  return parseSessionCookie(cookie?.split("=").slice(1).join("="))
}

export function TopBar({
  searchPlaceholder = "Search vehicles, drivers, trips...",
}: {
  searchPlaceholder?: string
}) {
  const router = useRouter()
  const [session, setSession] = useState<AuthSession | null>(null)

  useEffect(() => {
    setSession(readSessionCookie())
  }, [])

  function handleLogout() {
    document.cookie = `${SESSION_COOKIE_NAME}=; path=/; max-age=0; samesite=lax`
    router.push("/login")
    router.refresh()
  }

  const displayName = session ? getDisplayName(session.email) : "TransitOps User"
  const initials = session ? getInitials(session.email) : "TU"

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between gap-4 border-b border-white/10 bg-[#030303]/95 px-4 backdrop-blur supports-backdrop-filter:bg-[#030303]/75 lg:px-6">
      <div className="relative w-full max-w-sm">
        <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-neutral-500" />
        <Input
          type="search"
          placeholder={searchPlaceholder}
          className="border-white/10 bg-white/5 pl-8 text-neutral-200 placeholder:text-neutral-500 focus-visible:border-white/20"
        />
      </div>

      <div className="flex shrink-0 items-center gap-3">
        <div className="hidden flex-col items-end sm:flex">
          <span className="text-sm font-medium text-neutral-200">
            {displayName}
          </span>
          <span className="text-xs text-neutral-500">
            {session?.role ?? "Not signed in"}
          </span>
        </div>
        <Avatar className="size-8">
          <AvatarFallback className="bg-blue-500/15 text-xs font-semibold text-blue-400">
            {initials}
          </AvatarFallback>
        </Avatar>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleLogout}
          className="text-neutral-400 hover:text-white"
        >
          <LogOut className="size-3.5" />
          <span className="hidden md:inline">Logout</span>
        </Button>
      </div>
    </header>
  )
}
