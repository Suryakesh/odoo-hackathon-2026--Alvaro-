import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

import { STATUS_COLORS, type StatusColor } from "./status-colors"

const VEHICLE_STATUS = [
  { label: "Available", count: 58, color: "green" as StatusColor },
  { label: "On Trip", count: 61, color: "blue" as StatusColor },
  { label: "In Shop", count: 12, color: "amber" as StatusColor },
  { label: "Retired", count: 11, color: "grey" as StatusColor },
]

const TOTAL = VEHICLE_STATUS.reduce((sum, s) => sum + s.count, 0)

export function VehicleStatusChart() {
  return (
    <Card className="border border-white/10 bg-white/[0.03] ring-0">
      <CardHeader>
        <CardTitle className="text-white">Vehicle Status</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-5">
        <div className="flex h-3 w-full gap-[2px] overflow-hidden rounded-full bg-[#030303]">
          {VEHICLE_STATUS.map((status) => (
            <div
              key={status.label}
              style={{
                width: `${(status.count / TOTAL) * 100}%`,
                backgroundColor: STATUS_COLORS[status.color].text,
              }}
              role="img"
              aria-label={`${status.label}: ${status.count} vehicles`}
            />
          ))}
        </div>

        <ul className="flex flex-col gap-3">
          {VEHICLE_STATUS.map((status) => (
            <li
              key={status.label}
              className="flex items-center justify-between text-sm"
            >
              <span className="flex items-center gap-2 text-neutral-300">
                <span
                  className="size-2.5 shrink-0 rounded-full"
                  style={{ backgroundColor: STATUS_COLORS[status.color].text }}
                  aria-hidden="true"
                />
                {status.label}
              </span>
              <span className="flex items-baseline gap-1.5 tabular-nums">
                <span className="font-medium text-white">{status.count}</span>
                <span className="text-xs text-neutral-500">
                  ({Math.round((status.count / TOTAL) * 100)}%)
                </span>
              </span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}
