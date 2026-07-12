import Link from "next/link"
import {
  LayoutDashboard,
  Truck,
  Users,
  Route,
  Wrench,
  Fuel,
  BarChart3,
  Settings,
} from "lucide-react"

import { cn } from "@/lib/utils"

const NAV_ITEMS = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
  { label: "Fleet", icon: Truck, href: "/fleet" },
  { label: "Drivers", icon: Users, href: "/drivers" },
  { label: "Trips", icon: Route, href: "/trips" },
  { label: "Maintenance", icon: Wrench, href: "/maintenance" },
  { label: "Fuel & Expenses", icon: Fuel, href: "/fuel-expenses" },
  { label: "Analytics", icon: BarChart3, href: "/analytics" },
  { label: "Settings", icon: Settings, href: "/settings" },
] as const

export type NavLabel = (typeof NAV_ITEMS)[number]["label"]

export function Sidebar({ active }: { active: NavLabel }) {
  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-60 flex-col border-r border-white/10 bg-[#030303] lg:flex">
      <div className="flex h-14 items-center gap-2 border-b border-white/10 px-5">
        <div className="flex size-7 items-center justify-center rounded-md bg-blue-500/15 text-blue-400">
          <Truck className="size-4" />
        </div>
        <span className="font-heading text-sm font-semibold tracking-tight text-white">
          TransitOps
        </span>
      </div>

      <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto p-3">
        {NAV_ITEMS.map(({ label, icon: Icon, href }) => {
          const isActive = label === active
          return (
            <Link
              key={label}
              href={href}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-white/10 text-white"
                  : "text-neutral-400 hover:bg-white/5 hover:text-white"
              )}
            >
              <Icon className="size-4 shrink-0" />
              {label}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
