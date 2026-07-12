import { ArrowRight } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { STATUS_COLORS, TRIP_STATUS_COLOR } from "@/lib/status-colors"

import { LIVE_TRIPS } from "./trip-data"

export function LiveBoard() {
  return (
    <Card className="border border-white/10 bg-white/[0.03] ring-0">
      <CardHeader>
        <CardTitle className="text-white">Live Board</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {LIVE_TRIPS.map((trip) => (
          <div
            key={trip.id}
            className="flex flex-col gap-2 rounded-xl border border-white/10 bg-white/[0.02] p-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-neutral-200">
                  {trip.id}
                </span>
                <Badge
                  variant="outline"
                  className={`border-transparent ${STATUS_COLORS[TRIP_STATUS_COLOR[trip.status]].badge}`}
                >
                  {trip.status}
                </Badge>
              </div>
              <span className="text-xs text-neutral-500">
                {trip.vehicleRegNo}
                {trip.driverName ? ` · ${trip.driverName}` : " · Unassigned"}
              </span>
              <span className="flex items-center gap-1.5 text-sm text-neutral-300">
                {trip.source}
                <ArrowRight className="size-3.5 text-neutral-600" />
                {trip.destination}
              </span>
            </div>

            <span className="text-sm text-neutral-400 sm:text-right">
              {trip.note}
            </span>
          </div>
        ))}

        <p className="mt-2 text-xs text-neutral-500">
          On Complete: odometer → fuel log → expenses → Vehicle & Driver
          Available
        </p>
      </CardContent>
    </Card>
  )
}
