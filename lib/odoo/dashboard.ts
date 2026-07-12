/**
 * Dashboard Service — aggregates KPIs from multiple models
 *
 * All counts are fetched server-side in parallel for fast load times.
 * This replaces the hardcoded KPIS array in dashboard/_components/kpi-cards.tsx.
 */

import { countVehicles } from "./vehicles"
import { countDrivers } from "./drivers"
import { countTrips } from "./trips"
import { countMaintenance } from "./maintenance"
import type { DashboardKpis } from "./types"

/**
 * Fetch all dashboard KPIs in a single call.
 * Uses Promise.all to run counts in parallel.
 */
export async function getDashboardKpis(): Promise<DashboardKpis> {
  const [
    totalVehicles,
    availableVehicles,
    onTripVehicles,
    inShopVehicles,
    retiredVehicles,
    activeTrips,       // "Dispatched" stage
    pendingTrips,      // "Draft" stage
    availableDrivers,
    onTripDrivers,
    activeMaintenance,
  ] = await Promise.all([
    countVehicles(),
    countVehicles("Available"),
    countVehicles("On Trip"),
    countVehicles("In Shop"),
    countVehicles("Retired"),
    countTrips("Dispatched"),
    countTrips("Draft"),
    countDrivers("Available"),
    countDrivers("On Trip"),
    countMaintenance("active"),
  ])

  // Active vehicles = total minus retired
  const activeVehicles = totalVehicles - retiredVehicles

  // Drivers on duty = available + on trip (not off duty / suspended)
  const driversOnDuty = availableDrivers + onTripDrivers

  // Fleet utilization = vehicles currently on a trip / active vehicles
  const utilization = activeVehicles > 0
    ? Math.round((onTripVehicles / activeVehicles) * 100)
    : 0

  return {
    activeVehicles,
    availableVehicles,
    vehiclesInMaintenance: inShopVehicles + activeMaintenance,
    activeTrips,
    pendingTrips,
    driversOnDuty,
    fleetUtilization: `${utilization}%`,
  }
}

/**
 * Get a quick status breakdown for the vehicle donut/pie chart.
 * Returns counts per status for the VehicleStatusChart component.
 */
export async function getVehicleStatusBreakdown(): Promise<
  { status: string; count: number }[]
> {
  const [available, onTrip, inShop, retired] = await Promise.all([
    countVehicles("Available"),
    countVehicles("On Trip"),
    countVehicles("In Shop"),
    countVehicles("Retired"),
  ])

  return [
    { status: "Available", count: available },
    { status: "On Trip", count: onTrip },
    { status: "In Shop", count: inShop },
    { status: "Retired", count: retired },
  ]
}
