import { Badge } from "@/components/ui/badge"
import { DRIVER_STATUS_COLOR, STATUS_COLORS } from "@/lib/status-colors"

const STATUSES = ["Available", "On Trip", "Off Duty", "Suspended"] as const

export function StatusLegend() {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-medium text-neutral-500">
          Status legend:
        </span>
        {STATUSES.map((status) => (
          <Badge
            key={status}
            variant="outline"
            className={`border-transparent ${STATUS_COLORS[DRIVER_STATUS_COLOR[status]].badge}`}
          >
            {status}
          </Badge>
        ))}
      </div>

      <p className="text-sm text-red-400/70">
        Rule: Expired license or Suspended status → blocked from trip
        assignment.
      </p>
    </div>
  )
}
