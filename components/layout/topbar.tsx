import { Search } from "lucide-react"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"

export function TopBar({
  searchPlaceholder = "Search vehicles, drivers, trips...",
}: {
  searchPlaceholder?: string
}) {
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
        <span className="hidden text-sm font-medium text-neutral-200 sm:inline">
          Chaitanya Pal
        </span>
        <Avatar className="size-8">
          <AvatarFallback className="bg-blue-500/15 text-xs font-semibold text-blue-400">
            CP
          </AvatarFallback>
        </Avatar>
      </div>
    </header>
  )
}
