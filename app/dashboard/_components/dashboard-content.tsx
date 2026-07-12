"use client"

import { useEffect, useMemo, useState } from "react"

import type { Trip, Vehicle, VehicleStatus } from "@/lib/odoo"

import { KpiCards, type KpiCardItem } from "./kpi-cards"
import { RecentTripsTable } from "./recent-trips-table"
import {
  VEHICLE_STATUS_LABELS,
  VehicleStatusChart,
  type VehicleStatusItem,
} from "./vehicle-status-chart"

const DRIVERS_ON_DUTY = 96

function parseOdooDate(value: string): number {
  if (!value) return 0
  return new Date(value.replace(" ", "T")).getTime()
}

export function DashboardContent() {
  const [vehicles, setVehicles] = useState<Vehicle[] | null>(null)
  const [trips, setTrips] = useState<Trip[] | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    Promise.all([
      fetch("/api/vehicles").then((res) => {
        if (!res.ok) throw new Error("Vehicles request failed")
        return res.json() as Promise<Vehicle[]>
      }),
      fetch("/api/trips").then((res) => {
        if (!res.ok) throw new Error("Trips request failed")
        return res.json() as Promise<Trip[]>
      }),
    ])
      .then(([vehicleData, tripData]) => {
        if (cancelled) return
        setVehicles(vehicleData)
        setTrips(tripData)
      })
      .catch(() => {
        if (!cancelled) setError("Failed to load dashboard data")
      })

    return () => {
      cancelled = true
    }
  }, [])

  const dashboardData = useMemo(() => {
    if (!vehicles || !trips) return null

    const statusCounts = VEHICLE_STATUS_LABELS.reduce(
      (counts, status) => ({
        ...counts,
        [status]: vehicles.filter((vehicle) => vehicle.status === status)
          .length,
      }),
      {} as Record<VehicleStatus, number>
    )

    const totalVehicles = vehicles.length
    const fleetUtilization = totalVehicles
      ? Math.round((statusCounts["On Trip"] / totalVehicles) * 100)
      : 0

    const kpis: KpiCardItem[] = [
      {
        label: "Active Vehicles",
        value: String(statusCounts.Available + statusCounts["On Trip"]),
      },
      { label: "Available Vehicles", value: String(statusCounts.Available) },
      {
        label: "Vehicles in Maintenance",
        value: String(statusCounts["In Shop"]),
      },
      {
        label: "Active Trips",
        value: String(trips.filter((trip) => trip.status === "Dispatched").length),
      },
      {
        label: "Pending Trips",
        value: String(trips.filter((trip) => trip.status === "Draft").length),
      },
      // Driver data is not ready yet, so this remains a static dashboard value.
      { label: "Drivers On Duty", value: String(DRIVERS_ON_DUTY) },
      { label: "Fleet Utilization", value: `${fleetUtilization}%` },
    ]

    const recentTrips = [...trips]
      .sort(
        (a, b) =>
          parseOdooDate(b.updatedAt || b.createdAt) -
          parseOdooDate(a.updatedAt || a.createdAt)
      )
      .slice(0, 5)

    const vehicleStatus: VehicleStatusItem[] = VEHICLE_STATUS_LABELS.map(
      (status) => ({
        label: status,
        count: statusCounts[status],
      })
    )

    return { kpis, recentTrips, vehicleStatus }
  }, [trips, vehicles])

  if (error) {
    return (
      <p className="py-10 text-center text-sm text-red-400">
        {error}
      </p>
    )
  }

  if (!dashboardData) {
    return (
      <p className="py-10 text-center text-sm text-neutral-500">
        Loading dashboard...
      </p>
    )
  }

  return (
    <>
      <KpiCards kpis={dashboardData.kpis} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RecentTripsTable trips={dashboardData.recentTrips} />
        </div>
        <div className="lg:col-span-1">
          <VehicleStatusChart statuses={dashboardData.vehicleStatus} />
        </div>
      </div>
    </>
  )
}
