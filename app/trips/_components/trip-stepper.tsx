import { Check } from "lucide-react"

import { STATUS_COLORS, TRIP_STAGE_COLOR } from "@/lib/status-colors"
import { cn } from "@/lib/utils"

import type { TripStatus } from "./trip-data"

const STAGES: TripStatus[] = ["Draft", "Dispatched", "Completed", "Cancelled"]

export function TripStepper({ current }: { current: TripStatus }) {
  const currentIndex = STAGES.indexOf(current)

  return (
    <div className="flex items-center">
      {STAGES.map((stage, index) => {
        const color = STATUS_COLORS[TRIP_STAGE_COLOR[stage]].text
        const isCurrent = index === currentIndex
        const isPast = index < currentIndex

        return (
          <div key={stage} className="flex flex-1 items-center last:flex-none">
            <div className="flex flex-col items-center gap-1.5">
              <div
                className="flex size-7 shrink-0 items-center justify-center rounded-full border-2 text-xs font-semibold transition-colors"
                style={
                  isCurrent
                    ? { borderColor: color, backgroundColor: `${color}26`, color }
                    : isPast
                      ? { borderColor: color, backgroundColor: color, color: "#030303" }
                      : { borderColor: "rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.35)" }
                }
              >
                {isPast ? <Check className="size-3.5" /> : index + 1}
              </div>
              <span
                className={cn(
                  "text-xs font-medium whitespace-nowrap",
                  isCurrent ? "text-white" : "text-white/40"
                )}
              >
                {stage}
              </span>
            </div>

            {index < STAGES.length - 1 && (
              <div
                className="mx-2 h-px flex-1"
                style={{
                  backgroundColor: isPast ? color : "rgba(255,255,255,0.15)",
                }}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}
