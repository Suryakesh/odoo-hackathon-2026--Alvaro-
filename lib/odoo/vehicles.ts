/**
 * Vehicle Service — fleet.vehicle
 *
 * Maps to the existing Fleet app extended via Studio with:
 *   - x_studio_max_load_capacity (integer)
 *   - x_studio_trip_status (selection: Available/On Trip/In Shop/Retired)
 */

import { searchRead, searchCount, create, write } from "./client"
import type {
  OdooRawVehicle,
  Vehicle,
  VehicleStatus,
  CreateVehiclePayload,
} from "./types"

// ---------------------------------------------------------------------------
// Odoo field list — only fetch what we need
// ---------------------------------------------------------------------------

const VEHICLE_FIELDS = [
  "id",
  "name",
  "license_plate",
  "model_id",
  "model_year",
  "odometer",
  "car_value",
  "tag_ids",
  "x_studio_max_load_capacity",
  "x_studio_trip_status",
]

// ---------------------------------------------------------------------------
// Mapper: OdooRaw → Frontend
// ---------------------------------------------------------------------------

function inferVehicleType(name: string): "Van" | "Truck" | "Mini" {
  const lower = name.toLowerCase()
  if (lower.includes("truck") || lower.includes("leyland") || lower.includes("407")) return "Truck"
  if (lower.includes("mini") || lower.includes("ace") || lower.includes("ape") || lower.includes("piaggio")) return "Mini"
  return "Van"
}

export function mapVehicle(raw: OdooRawVehicle): Vehicle {
  return {
    id: raw.id,
    regNo: raw.license_plate || "",
    name: raw.name || "",
    type: inferVehicleType(raw.name || ""),
    maxCapacityKg: raw.x_studio_max_load_capacity || 0,
    odometerKm: raw.odometer || 0,
    acquisitionCost: raw.car_value || 0,
    status: (raw.x_studio_trip_status as VehicleStatus) || "Available",
  }
}

// ---------------------------------------------------------------------------
// Service methods
// ---------------------------------------------------------------------------

/** Fetch all vehicles, optionally filtered by status. */
export async function getVehicles(filters?: {
  status?: VehicleStatus
  limit?: number
  offset?: number
}): Promise<Vehicle[]> {
  const domain: unknown[][] = []
  if (filters?.status) {
    domain.push(["x_studio_trip_status", "=", filters.status])
  }

  const raw = await searchRead<OdooRawVehicle>({
    model: "fleet.vehicle",
    domain,
    fields: VEHICLE_FIELDS,
    limit: filters?.limit,
    offset: filters?.offset,
    order: "license_plate asc",
  })

  return raw.map(mapVehicle)
}

/** Fetch a single vehicle by ID. */
export async function getVehicleById(id: number): Promise<Vehicle | null> {
  const raw = await searchRead<OdooRawVehicle>({
    model: "fleet.vehicle",
    domain: [["id", "=", id]],
    fields: VEHICLE_FIELDS,
    limit: 1,
  })
  return raw.length ? mapVehicle(raw[0]) : null
}

/** Count vehicles, optionally by status. */
export async function countVehicles(status?: VehicleStatus): Promise<number> {
  const domain: unknown[][] = []
  if (status) domain.push(["x_studio_trip_status", "=", status])
  return searchCount("fleet.vehicle", domain)
}

/** Create a new vehicle. Returns the new Odoo ID. */
export async function createVehicle(payload: CreateVehiclePayload): Promise<number> {
  const [id] = await create("fleet.vehicle", {
    name: payload.name,
    license_plate: payload.licensePlate,
    x_studio_max_load_capacity: payload.maxCapacityKg,
    x_studio_trip_status: payload.status ?? "Available",
  })
  return id
}

/** Update a vehicle's trip status. */
export async function updateVehicleStatus(
  id: number,
  status: VehicleStatus
): Promise<boolean> {
  return write("fleet.vehicle", [id], {
    x_studio_trip_status: status,
  })
}
