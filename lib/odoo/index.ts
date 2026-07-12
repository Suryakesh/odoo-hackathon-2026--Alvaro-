/**
 * TransitOps — Odoo API Service Layer
 *
 * Barrel export. Import everything from "@/lib/odoo" in your components.
 *
 * Usage examples:
 *
 *   // In a Next.js Server Component or API route:
 *   import { getTrips, getDrivers, getDashboardKpis } from "@/lib/odoo"
 *
 *   const trips = await getTrips({ status: "Dispatched", limit: 10 })
 *   const kpis  = await getDashboardKpis()
 */

// Core client (rarely used directly — prefer the domain services)
export {
  authenticate,
  searchRead,
  searchCount,
  read,
  create,
  write,
  unlink,
  callMethod,
  OdooError,
} from "./client"
export type { OdooConfig, SearchReadParams } from "./client"

// All types
export type {
  // Vehicle
  OdooRawVehicle,
  Vehicle,
  VehicleStatus,
  VehicleType,
  CreateVehiclePayload,
  // Driver
  OdooRawDriver,
  Driver,
  DriverStatus,
  LicenseCategory,
  CreateDriverPayload,
  // Trip
  OdooRawTrip,
  OdooRawTripStage,
  Trip,
  TripStage,
  TripStatus,
  CreateTripPayload,
  UpdateTripPayload,
  // Maintenance
  OdooRawMaintenance,
  Maintenance,
  MaintenanceStatus,
  // Dashboard
  DashboardKpis,
  // Fuel Logs
  OdooRawFuelLog,
  FuelLog,
  CreateFuelLogPayload,
} from "./types"

// Domain services
export {
  getVehicles,
  getVehicleById,
  countVehicles,
  createVehicle,
  updateVehicleStatus,
  mapVehicle,
} from "./vehicles"

export {
  getDrivers,
  getDriverById,
  countDrivers,
  createDriver,
  updateDriverStatus,
  updateDriverSafetyScore,
  mapDriver,
} from "./drivers"

export {
  getTrips,
  getTripById,
  countTrips,
  createTrip,
  updateTrip,
  moveTripToStage,
  getTripStages,
  invalidateStageCache,
  mapTrip,
} from "./trips"

export {
  getMaintenanceRecords,
  getMaintenanceById,
  countMaintenance,
  createMaintenance,
  completeMaintenance,
  mapMaintenance,
} from "./maintenance"

export {
  getDashboardKpis,
  getVehicleStatusBreakdown,
} from "./dashboard"

export {
  getFuelLogs,
  createFuelLog,
  mapFuelLog,
} from "./fuel-logs"
