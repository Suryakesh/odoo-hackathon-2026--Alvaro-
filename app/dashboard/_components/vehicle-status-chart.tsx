import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

import type { VehicleStatus } from "@/lib/odoo"
import { STATUS_COLORS, VEHICLE_STATUS_COLOR } from "@/lib/status-colors"

export const VEHICLE_STATUS_LABELS: VehicleStatus[] = [
  "Available",
  "On Trip",
  "In Shop",
  "Retired",
]

export type VehicleStatusItem = {
  label: VehicleStatus
  count: number
}

type VehicleStatusChartProps = {
  statuses: VehicleStatusItem[]
}

export function VehicleStatusChart({ statuses }: VehicleStatusChartProps) {
  const total = statuses.reduce((sum, status) => sum + status.count, 0)

  return (
    <Card className="border border-white/10 bg-white/[0.03] ring-0">
      <CardHeader>
        <CardTitle className="text-white">Vehicle Status</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-5">
        <div className="flex h-3 w-full gap-[2px] overflow-hidden rounded-full bg-[#030303]">
          {statuses.map((status) => (
            <div
              key={status.label}
              style={{
                width: total ? `${(status.count / total) * 100}%` : "0%",
                backgroundColor:
                  STATUS_COLORS[VEHICLE_STATUS_COLOR[status.label]].text,
              }}
              role="img"
              aria-label={`${status.label}: ${status.count} vehicles`}
            />
          ))}
        </div>

        <ul className="flex flex-col gap-3">
          {statuses.map((status) => (
            <li
              key={status.label}
              className="flex items-center justify-between text-sm"
            >
              <span className="flex items-center gap-2 text-neutral-300">
                <span
                  className="size-2.5 shrink-0 rounded-full"
                  style={{
                    backgroundColor:
                      STATUS_COLORS[VEHICLE_STATUS_COLOR[status.label]].text,
                  }}
                  aria-hidden="true"
                />
                {status.label}
              </span>
              <span className="flex items-baseline gap-1.5 tabular-nums">
                <span className="font-medium text-white">{status.count}</span>
                <span className="text-xs text-neutral-500">
                  ({total ? Math.round((status.count / total) * 100) : 0}%)
                </span>
              </span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}
