import { BarChart3, Route, ShieldCheck, Truck } from "lucide-react"

const ROLES = [
  { label: "Fleet Manager", icon: Truck },
  { label: "Dispatcher", icon: Route },
  { label: "Safety Officer", icon: ShieldCheck },
  { label: "Financial Analyst", icon: BarChart3 },
] as const

export function BrandingPanel() {
  return (
    <div className="dark relative flex flex-col justify-between overflow-hidden bg-gradient-to-br from-[#0a0a12] via-[#0d0d16] to-[#030303] px-8 py-10 sm:px-12 sm:py-14 lg:px-16">
      <div className="pointer-events-none absolute -top-24 -left-24 size-72 rounded-full bg-indigo-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 -bottom-24 size-72 rounded-full bg-rose-500/10 blur-3xl" />

      <div className="relative flex items-center gap-2">
        <div className="flex size-8 items-center justify-center rounded-md bg-blue-500/15 text-blue-400">
          <Truck className="size-4" />
        </div>
        <span className="font-heading text-lg font-semibold tracking-tight text-white">
          TransitOps
        </span>
      </div>

      <div className="relative flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Smart Transport Operations Platform
          </h1>
        </div>

        <div className="flex flex-col gap-3">
          <span className="text-sm font-medium text-white/60">
            One login, four roles:
          </span>
          <ul className="flex flex-col gap-2.5">
            {ROLES.map((role) => (
              <li
                key={role.label}
                className="flex items-center gap-2.5 text-sm text-white/80"
              >
                <role.icon className="size-4 text-white/40" />
                {role.label}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <p className="relative text-xs text-white/30">
        TransitOps © 2026 - RBAC Auth
      </p>
    </div>
  )
}
