/**
 * Fuel Logs Service — x_fuel_logs (custom Studio app)
 */

import { searchRead, create } from "./client"
import type {
  OdooRawFuelLog,
  FuelLog,
  CreateFuelLogPayload,
} from "./types"

const FUEL_LOG_FIELDS = [
  "id",
  "x_name",
  "x_studio_vehicle",
  "x_studio_liters",
  "x_studio_cost",
  "x_studio_value",
  "x_studio_date",
]

export function mapFuelLog(raw: OdooRawFuelLog): FuelLog {
  return {
    id: raw.id,
    description: raw.x_name || `Fuel Refill #${raw.id}`,
    vehicleId: raw.x_studio_vehicle ? raw.x_studio_vehicle[0] : null,
    vehicleDisplay: raw.x_studio_vehicle ? raw.x_studio_vehicle[1] : "No Vehicle",
    liters: raw.x_studio_liters || 0,
    cost: raw.x_studio_cost || raw.x_studio_value || 0,
    date: raw.x_studio_date || "",
  }
}

/** Fetch fuel logs from Odoo */
export async function getFuelLogs(filters?: {
  vehicleId?: number
  limit?: number
  offset?: number
}): Promise<FuelLog[]> {
  const domain: unknown[][] = []
  if (filters?.vehicleId) {
    domain.push(["x_studio_vehicle", "=", filters.vehicleId])
  }

  const raw = await searchRead<OdooRawFuelLog>({
    model: "x_fuel_logs",
    domain,
    fields: FUEL_LOG_FIELDS,
    limit: filters?.limit,
    offset: filters?.offset,
    order: "x_studio_date desc, id desc",
  })

  return raw.map(mapFuelLog)
}

/** Create a new fuel log in Odoo */
export async function createFuelLog(payload: CreateFuelLogPayload): Promise<number> {
  const [id] = await create("x_fuel_logs", {
    x_name: payload.description,
    x_studio_vehicle: payload.vehicleId,
    x_studio_liters: payload.liters,
    x_studio_cost: payload.cost,
    x_studio_date: payload.date,
  })
  return id
}
