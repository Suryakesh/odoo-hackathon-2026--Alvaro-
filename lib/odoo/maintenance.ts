/**
 * Maintenance Service — x_maintenance_records (custom Studio app)
 *
 * Fields:
 *   x_name                 — Reference (e.g. MAINT-001)
 *   x_studio_vehicle       — Many2one → fleet.vehicle
 *   x_studio_type          — selection dropdown (Preventive/Corrective/Inspection)
 *   x_studio_date          — date
 *   x_studio_value         — monetary (Cost)
 *   x_studio_description   — text
 *   x_studio_status        — selection dropdown (active/completed)
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
  "x_name",
  "x_studio_vehicle",
  "x_studio_type",
  "x_studio_date",
  "x_studio_value",
  "x_studio_description",
  "x_studio_status",
]

// ---------------------------------------------------------------------------
// Mapper
// ---------------------------------------------------------------------------

export function mapMaintenance(raw: OdooRawMaintenance): Maintenance {
  return {
    id: raw.id,
    reference: raw.x_name || `MAINT-${raw.id}`,
    vehicleId: raw.x_studio_vehicle ? raw.x_studio_vehicle[0] : null,
    vehicleDisplay: raw.x_studio_vehicle ? raw.x_studio_vehicle[1] : "No Vehicle",
    maintenanceType: raw.x_studio_type || "",
    date: raw.x_studio_date || "",
    cost: raw.x_studio_value || 0,
    description: raw.x_studio_description || "",
    status: (raw.x_studio_status as MaintenanceStatus) || "active",
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
  if (filters?.status) domain.push(["x_studio_status", "=", filters.status])
  if (filters?.vehicleId) domain.push(["x_studio_vehicle", "=", filters.vehicleId])

  const raw = await searchRead<OdooRawMaintenance>({
    model: "x_maintenance_records",
    domain,
    fields: MAINTENANCE_FIELDS,
    limit: filters?.limit,
    offset: filters?.offset,
    order: "x_studio_date desc, id desc",
  })

  return raw.map(mapMaintenance)
}

/** Fetch a single maintenance record by ID. */
export async function getMaintenanceById(id: number): Promise<Maintenance | null> {
  const raw = await searchRead<OdooRawMaintenance>({
    model: "x_maintenance_records",
    domain: [["id", "=", id]],
    fields: MAINTENANCE_FIELDS,
    limit: 1,
  })
  return raw.length ? mapMaintenance(raw[0]) : null
}

/** Count maintenance records. */
export async function countMaintenance(status?: MaintenanceStatus): Promise<number> {
  const domain: unknown[][] = []
  if (status) domain.push(["x_studio_status", "=", status])
  return searchCount("x_maintenance_records", domain)
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
  const [id] = await create("x_maintenance_records", {
    x_name: payload.name,
    x_studio_vehicle: payload.vehicleId,
    x_studio_type: payload.maintenanceType,
    x_studio_date: payload.date,
    x_studio_value: payload.cost,
    x_studio_description: payload.description ?? "",
    x_studio_status: "active",
  })
  return id
}

/** Mark a maintenance record as completed. */
export async function completeMaintenance(id: number): Promise<boolean> {
  return write("x_maintenance_records", [id], { x_studio_status: "completed" })
}
