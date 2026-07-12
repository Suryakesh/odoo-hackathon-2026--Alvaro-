/**
 * Trip Service — x_trip (custom Studio app)
 *
 * Fields:
 *   x_name (char)          — description
 *   x_studio_source        — origin city
 *   x_studio_destination   — destination city
 *   x_studio_vehicle       — Many2one → fleet.vehicle
 *   x_studio_driver        — Many2one → res.partner
 *   x_studio_cargo_weight  — integer (kg)
 *   x_studio_planned_distance — integer (km)
 *   x_studio_final_odometer_1 — integer
 *   x_studio_fuel_consumed — float (liters)
 *   x_studio_stage_id      — Many2one → x_trip_stage
 *   x_studio_kanban_state  — selection (normal/done/blocked)
 *   x_studio_priority       — boolean (high priority star)
 *
 * Pipeline stages: Draft → Dispatched → Completed (+ Cancelled)
 */

import { searchRead, searchCount, create, write } from "./client"
import type {
  OdooRawTrip,
  OdooRawTripStage,
  Trip,
  TripStage,
  TripStatus,
  CreateTripPayload,
  UpdateTripPayload,
} from "./types"

// ---------------------------------------------------------------------------
// Odoo field lists
// ---------------------------------------------------------------------------

const TRIP_FIELDS = [
  "id",
  "x_name",
  "x_studio_source",
  "x_studio_destination",
  "x_studio_vehicle",
  "x_studio_driver",
  "x_studio_cargo_weight",
  "x_studio_planned_distance",
  "x_studio_final_odometer",
  "x_studio_final_odometer_1",
  "x_studio_fuel_consumed",
  "x_studio_stage_id",
  "x_studio_kanban_state",
  "x_studio_priority",
  "create_date",
  "write_date",
]

const STAGE_FIELDS = ["id", "x_name", "x_studio_sequence"]

// ---------------------------------------------------------------------------
// Stage cache (stages rarely change)
// ---------------------------------------------------------------------------

let _stageCache: TripStage[] | null = null

export async function getTripStages(): Promise<TripStage[]> {
  if (_stageCache) return _stageCache

  const raw = await searchRead<OdooRawTripStage>({
    model: "x_trip_stage",
    fields: STAGE_FIELDS,
    order: "x_studio_sequence asc",
  })

  _stageCache = raw.map((s) => ({
    id: s.id,
    name: s.x_name,
    sequence: s.x_studio_sequence,
  }))

  return _stageCache
}

/** Clear the stage cache (call after creating/editing stages). */
export function invalidateStageCache() {
  _stageCache = null
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Map stage id → display name (Draft / Dispatched / Completed / Cancelled).
 * Falls back to the raw stage name from Odoo.
 */
function stageToStatus(stageId: [number, string] | false): TripStatus {
  if (!stageId) return "Draft"
  const name = stageId[1].trim()
  if (name === "Dispatched") return "Dispatched"
  if (name === "Completed") return "Completed"
  if (name === "Cancelled") return "Cancelled"
  return "Draft"
}

function many2oneId(val: [number, string] | false): number | null {
  return val ? val[0] : null
}

function many2oneDisplay(val: [number, string] | false): string {
  return val ? val[1] : ""
}

// ---------------------------------------------------------------------------
// Mapper
// ---------------------------------------------------------------------------

export function mapTrip(raw: OdooRawTrip): Trip {
  return {
    id: raw.id,
    name: raw.x_name || `Trip #${raw.id}`,
    source: raw.x_studio_source || "",
    destination: raw.x_studio_destination || "",
    vehicleId: many2oneId(raw.x_studio_vehicle),
    vehicleDisplay: many2oneDisplay(raw.x_studio_vehicle),
    driverId: many2oneId(raw.x_studio_driver),
    driverName: many2oneDisplay(raw.x_studio_driver) || null,
    cargoWeight: raw.x_studio_cargo_weight || 0,
    plannedDistance: raw.x_studio_planned_distance || 0,
    finalOdometer: raw.x_studio_final_odometer_1 || 0,
    fuelConsumed: raw.x_studio_fuel_consumed || 0,
    status: stageToStatus(raw.x_studio_stage_id),
    kanbanState: raw.x_studio_kanban_state || "normal",
    isHighPriority: raw.x_studio_priority || false,
    createdAt: raw.create_date || "",
    updatedAt: raw.write_date || "",
  }
}

// ---------------------------------------------------------------------------
// Service methods
// ---------------------------------------------------------------------------

/** Fetch trips, optionally filtered by status name. */
export async function getTrips(filters?: {
  status?: TripStatus
  limit?: number
  offset?: number
}): Promise<Trip[]> {
  const domain: unknown[][] = []

  // Filter by stage name requires a relational domain
  if (filters?.status) {
    domain.push(["x_studio_stage_id.x_name", "=", filters.status])
  }

  const raw = await searchRead<OdooRawTrip>({
    model: "x_trip",
    domain,
    fields: TRIP_FIELDS,
    limit: filters?.limit,
    offset: filters?.offset,
    order: "create_date desc",
  })

  return raw.map(mapTrip)
}

/** Fetch a single trip by ID. */
export async function getTripById(id: number): Promise<Trip | null> {
  const raw = await searchRead<OdooRawTrip>({
    model: "x_trip",
    domain: [["id", "=", id]],
    fields: TRIP_FIELDS,
    limit: 1,
  })
  return raw.length ? mapTrip(raw[0]) : null
}

/** Count trips, optionally by status. */
export async function countTrips(status?: TripStatus): Promise<number> {
  const domain: unknown[][] = []
  if (status) domain.push(["x_studio_stage_id.x_name", "=", status])
  return searchCount("x_trip", domain)
}

/**
 * Create a new trip.
 * Finds the "Draft" stage automatically and sets it as default.
 */
export async function createTrip(payload: CreateTripPayload): Promise<number> {
  const stages = await getTripStages()
  const draftStage = stages.find((s) => s.name === "Draft")

  const [id] = await create("x_trip", {
    x_name: `${payload.source} → ${payload.destination}`,
    x_studio_source: payload.source,
    x_studio_destination: payload.destination,
    x_studio_vehicle: payload.vehicleId,
    x_studio_driver: payload.driverId,
    x_studio_cargo_weight: payload.cargoWeight,
    x_studio_planned_distance: payload.plannedDistance,
    x_studio_stage_id: draftStage?.id,
  })

  return id
}

/** Update trip fields (partial). */
export async function updateTrip(
  id: number,
  payload: UpdateTripPayload
): Promise<boolean> {
  const values: Record<string, unknown> = {}

  if (payload.source !== undefined) values.x_studio_source = payload.source
  if (payload.destination !== undefined) values.x_studio_destination = payload.destination
  if (payload.vehicleId !== undefined) values.x_studio_vehicle = payload.vehicleId
  if (payload.driverId !== undefined) values.x_studio_driver = payload.driverId
  if (payload.cargoWeight !== undefined) values.x_studio_cargo_weight = payload.cargoWeight
  if (payload.plannedDistance !== undefined) values.x_studio_planned_distance = payload.plannedDistance
  if (payload.finalOdometer !== undefined) values.x_studio_final_odometer_1 = payload.finalOdometer
  if (payload.fuelConsumed !== undefined) values.x_studio_fuel_consumed = payload.fuelConsumed
  if (payload.stageId !== undefined) values.x_studio_stage_id = payload.stageId

  return write("x_trip", [id], values)
}

/**
 * Move a trip to a specific stage by name.
 * Convenience wrapper — looks up the stage ID for you.
 */
export async function moveTripToStage(
  tripId: number,
  stageName: TripStatus
): Promise<boolean> {
  const stages = await getTripStages()
  const target = stages.find((s) => s.name === stageName)
  if (!target) throw new Error(`Stage "${stageName}" not found in Odoo`)

  return write("x_trip", [tripId], {
    x_studio_stage_id: target.id,
  })
}
