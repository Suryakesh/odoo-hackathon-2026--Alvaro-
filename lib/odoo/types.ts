/**
 * TransitOps — Odoo ↔ Frontend type definitions
 *
 * Naming convention:
 *   OdooRaw*  → raw shape returned by Odoo search_read (x_studio_* field names)
 *   *         → clean frontend-friendly shape used by UI components
 *
 * Each domain module (vehicles.ts, drivers.ts, etc.) exports a `mapXxx` function
 * that converts OdooRaw* → *.
 */

// ═══════════════════════════════════════════════════════════════════════════
// Vehicle  (model: fleet.vehicle)
// ═══════════════════════════════════════════════════════════════════════════

export type VehicleStatus = "Available" | "On Trip" | "In Shop" | "Retired"
export type VehicleType = "Van" | "Truck" | "Mini"

/** Raw Odoo record shape */
export type OdooRawVehicle = {
  id: number
  name: string                           // e.g. "Tata Ace Gold"
  license_plate: string                  // registration number
  model_id: [number, string] | false     // Many2one → [id, display_name]
  model_year: string | false
  odometer: number
  acquisition_date: string | false
  car_value: number
  x_studio_max_load_capacity: number
  x_studio_trip_status: VehicleStatus | false
  tag_ids: number[]
}

/** Frontend-friendly shape (matches existing vehicle-data.ts) */
export type Vehicle = {
  id: number
  regNo: string
  name: string
  type: VehicleType
  maxCapacityKg: number
  odometerKm: number
  acquisitionCost: number
  status: VehicleStatus
}

// ═══════════════════════════════════════════════════════════════════════════
// Driver  (model: res.partner — contacts extended with driver fields)
// ═══════════════════════════════════════════════════════════════════════════

export type DriverStatus = "Available" | "On Trip" | "Off Duty" | "Suspended"
export type LicenseCategory = "Light" | "Heavy"

/** Raw Odoo record shape */
export type OdooRawDriver = {
  id: number
  name: string
  phone: string | false
  email: string | false
  x_studio_license_number: string | false
  x_studio_license_category: LicenseCategory | false
  x_studio_license_expiry_date: string | false   // "YYYY-MM-DD"
  x_studio_safety_score: number
  x_studio_driver_status: DriverStatus | false
}

/** Frontend-friendly shape (matches existing driver-data.ts) */
export type Driver = {
  id: number
  name: string
  licenseNumber: string
  licenseCategory: string
  licenseExpiry: string
  contactNumber: string
  safetyScore: number
  status: DriverStatus
}

// ═══════════════════════════════════════════════════════════════════════════
// Trip  (model: x_trip)
// ═══════════════════════════════════════════════════════════════════════════

export type TripStatus = "Draft" | "Dispatched" | "Completed" | "Cancelled"

/** Raw Odoo record shape */
export type OdooRawTrip = {
  id: number
  x_name: string                          // description / title
  x_studio_source: string | false
  x_studio_destination: string | false
  x_studio_vehicle: [number, string] | false    // Many2one
  x_studio_driver: [number, string] | false     // Many2one
  x_studio_cargo_weight: number
  x_studio_planned_distance: number
  x_studio_final_odometer: string | false
  x_studio_final_odometer_1: number
  x_studio_fuel_consumed: number
  x_studio_stage_id: [number, string] | false   // Many2one → stage name
  x_studio_kanban_state: "normal" | "done" | "blocked"
  x_studio_priority: boolean
  create_date: string
  write_date: string
}

/** Frontend-friendly shape (matches existing trip-data.ts) */
export type Trip = {
  id: number
  name: string
  source: string
  destination: string
  vehicleId: number | null
  vehicleDisplay: string
  driverId: number | null
  driverName: string | null
  cargoWeight: number
  plannedDistance: number
  finalOdometer: number
  fuelConsumed: number
  status: TripStatus
  kanbanState: "normal" | "done" | "blocked"
  isHighPriority: boolean
  createdAt: string
  updatedAt: string
}

// ═══════════════════════════════════════════════════════════════════════════
// Maintenance  (model: transit.maintenance — Shikha's custom module)
// ═══════════════════════════════════════════════════════════════════════════

export type MaintenanceStatus = "active" | "completed"

/** Raw Odoo record shape */
export type OdooRawMaintenance = {
  id: number
  name: string
  vehicle_id: [number, string] | false
  maintenance_type: string | false
  date: string | false
  cost: number
  description: string | false
  status: MaintenanceStatus | false
}

/** Frontend-friendly shape */
export type Maintenance = {
  id: number
  reference: string
  vehicleId: number | null
  vehicleDisplay: string
  maintenanceType: string
  date: string
  cost: number
  description: string
  status: MaintenanceStatus
}

// ═══════════════════════════════════════════════════════════════════════════
// Trip Stage  (model: x_trip_stage)
// ═══════════════════════════════════════════════════════════════════════════

export type OdooRawTripStage = {
  id: number
  x_name: string
  x_studio_sequence: number
}

export type TripStage = {
  id: number
  name: string
  sequence: number
}

// ═══════════════════════════════════════════════════════════════════════════
// Dashboard KPIs (computed aggregate — not a direct Odoo model)
// ═══════════════════════════════════════════════════════════════════════════

export type DashboardKpis = {
  activeVehicles: number
  availableVehicles: number
  vehiclesInMaintenance: number
  activeTrips: number
  pendingTrips: number
  driversOnDuty: number
  fleetUtilization: string            // e.g. "78%"
}

// ═══════════════════════════════════════════════════════════════════════════
// Create / Update payloads (what the frontend sends to Odoo)
// ═══════════════════════════════════════════════════════════════════════════

export type CreateTripPayload = {
  source: string
  destination: string
  vehicleId: number
  driverId: number
  cargoWeight: number
  plannedDistance: number
}

export type UpdateTripPayload = Partial<CreateTripPayload> & {
  finalOdometer?: number
  fuelConsumed?: number
  stageId?: number
}

export type CreateDriverPayload = {
  name: string
  licenseNumber: string
  licenseCategory: LicenseCategory
  licenseExpiry: string       // "YYYY-MM-DD"
  contactNumber: string
  status?: DriverStatus
}

export type CreateVehiclePayload = {
  name: string
  licensePlate: string
  maxCapacityKg: number
  status?: VehicleStatus
}
