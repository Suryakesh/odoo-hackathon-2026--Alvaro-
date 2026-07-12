/**
 * Maintenance Service — transit.maintenance (Shikha's custom module)
 *
 * Fields:
 *   name           — reference / title
 *   vehicle_id     — Many2one → fleet.vehicle
 *   maintenance_type — char
 *   date           — date
 *   cost           — float
 *   description    — text
 *   status         — selection (active / completed)
 */

import { searchRead, searchCount, create, write } from "./client"
import type {
  OdooRawMaintenance,
  Maintenance,
  MaintenanceStatus,
} from "./types"

// ---------------------------------------------------------------------------
// Odoo field list
// ---------------------------------------------------------------------------

const MAINTENANCE_FIELDS = [
  "id",
  "name",
  "vehicle_id",
  "maintenance_type",
  "date",
  "cost",
  "description",
  "status",
]

// ---------------------------------------------------------------------------
// Mapper
// ---------------------------------------------------------------------------

export function mapMaintenance(raw: OdooRawMaintenance): Maintenance {
  return {
    id: raw.id,
    reference: raw.name || "",
    vehicleId: raw.vehicle_id ? raw.vehicle_id[0] : null,
    vehicleDisplay: raw.vehicle_id ? raw.vehicle_id[1] : "",
    maintenanceType: raw.maintenance_type || "",
    date: raw.date || "",
    cost: raw.cost || 0,
    description: raw.description || "",
    status: (raw.status as MaintenanceStatus) || "active",
  }
}

// ---------------------------------------------------------------------------
// Service methods
// ---------------------------------------------------------------------------

/** Fetch maintenance records, optionally filtered by status or vehicle. */
export async function getMaintenanceRecords(filters?: {
  status?: MaintenanceStatus
  vehicleId?: number
  limit?: number
  offset?: number
}): Promise<Maintenance[]> {
  const domain: unknown[][] = []
  if (filters?.status) domain.push(["status", "=", filters.status])
  if (filters?.vehicleId) domain.push(["vehicle_id", "=", filters.vehicleId])

  const raw = await searchRead<OdooRawMaintenance>({
    model: "transit.maintenance",
    domain,
    fields: MAINTENANCE_FIELDS,
    limit: filters?.limit,
    offset: filters?.offset,
    order: "date desc",
  })

  return raw.map(mapMaintenance)
}

/** Fetch a single maintenance record by ID. */
export async function getMaintenanceById(id: number): Promise<Maintenance | null> {
  const raw = await searchRead<OdooRawMaintenance>({
    model: "transit.maintenance",
    domain: [["id", "=", id]],
    fields: MAINTENANCE_FIELDS,
    limit: 1,
  })
  return raw.length ? mapMaintenance(raw[0]) : null
}

/** Count maintenance records. */
export async function countMaintenance(status?: MaintenanceStatus): Promise<number> {
  const domain: unknown[][] = []
  if (status) domain.push(["status", "=", status])
  return searchCount("transit.maintenance", domain)
}

/** Create a new maintenance record. */
export async function createMaintenance(payload: {
  name: string
  vehicleId: number
  maintenanceType: string
  date: string
  cost: number
  description?: string
}): Promise<number> {
  const [id] = await create("transit.maintenance", {
    name: payload.name,
    vehicle_id: payload.vehicleId,
    maintenance_type: payload.maintenanceType,
    date: payload.date,
    cost: payload.cost,
    description: payload.description ?? "",
    status: "active",
  })
  return id
}

/** Mark a maintenance record as completed. */
export async function completeMaintenance(id: number): Promise<boolean> {
  return write("transit.maintenance", [id], { status: "completed" })
}
