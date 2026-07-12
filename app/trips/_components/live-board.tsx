"use client"

import { useEffect, useState } from "react"
import { ArrowRight } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Trip } from "@/lib/odoo"
import { STATUS_COLORS, TRIP_STATUS_COLOR } from "@/lib/status-colors"

function getTripNote(trip: Trip): string {
  if (trip.status === "Draft" && !trip.driverId) return "Awaiting driver"
  if (trip.status === "Cancelled") return "Cancelled"
  if (!trip.updatedAt) return "—"

  return `Updated ${new Date(trip.updatedAt.replace(" ", "T")).toLocaleString(
    "en-IN",
    { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" }
  )}`
}

export function LiveBoard() {
  const [trips, setTrips] = useState<Trip[] | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    fetch("/api/trips")
      .then((res) => {
        if (!res.ok) throw new Error("Request failed")
        return res.json()
      })
      .then((data: Trip[]) => {
        if (!cancelled) setTrips(data)
      })
      .catch(() => {
        if (!cancelled) setError("Failed to load trips")
      })

    return () => {
      cancelled = true
    }
  }, [])

  return (
    <Card className="border border-white/10 bg-white/[0.03] ring-0">
      <CardHeader>
        <CardTitle className="text-white">Live Board</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {error ? (
          <p className="py-10 text-center text-sm text-red-400">{error}</p>
        ) : !trips ? (
          <p className="py-10 text-center text-sm text-neutral-500">
            Loading trips...
          </p>
        ) : (
          trips.map((trip) => (
            <div
              key={trip.id}
              className="flex flex-col gap-2 rounded-xl border border-white/10 bg-white/[0.02] p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-neutral-200">
                    TRIP-{trip.id}
                  </span>
                  <Badge
                    variant="outline"
                    className={`border-transparent ${STATUS_COLORS[TRIP_STATUS_COLOR[trip.status]].badge}`}
                  >
                    {trip.status}
                  </Badge>
                </div>
                <span className="text-xs text-neutral-500">
                  {trip.vehicleDisplay || "Unassigned"}
                  {trip.driverName ? ` · ${trip.driverName}` : " · Unassigned"}
                </span>
                <span className="flex items-center gap-1.5 text-sm text-neutral-300">
                  {trip.source}
                  <ArrowRight className="size-3.5 text-neutral-600" />
                  {trip.destination}
                </span>
              </div>

              <span className="text-sm text-neutral-400 sm:text-right">
                {getTripNote(trip)}
              </span>
            </div>
          ))
        )}

        <p className="mt-2 text-xs text-neutral-500">
          On Complete: odometer → fuel log → expenses → Vehicle & Driver
          Available
        </p>
      </CardContent>
    </Card>
  )
}
