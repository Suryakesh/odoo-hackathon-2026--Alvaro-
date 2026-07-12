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
  { label: "Dashboard", icon: LayoutDashboard, active: true },
  { label: "Fleet", icon: Truck, active: false },
  { label: "Drivers", icon: Users, active: false },
  { label: "Trips", icon: Route, active: false },
  { label: "Maintenance", icon: Wrench, active: false },
  { label: "Fuel & Expenses", icon: Fuel, active: false },
  { label: "Analytics", icon: BarChart3, active: false },
  { label: "Settings", icon: Settings, active: false },
] as const

export function Sidebar() {
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
        {NAV_ITEMS.map(({ label, icon: Icon, active }) => (
          <a
            key={label}
            href="#"
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              active
                ? "bg-white/10 text-white"
                : "text-neutral-400 hover:bg-white/5 hover:text-white"
            )}
          >
            <Icon className="size-4 shrink-0" />
            {label}
          </a>
        ))}
      </nav>
    </aside>
  )
}
