/**
 * Driver Service — res.partner (contacts extended as drivers)
 *
 * Studio-added fields on res.partner:
 *   - x_studio_license_number (char)
 *   - x_studio_license_category (selection: Light/Heavy)
 *   - x_studio_license_expiry_date (date)
 *   - x_studio_safety_score (integer)
 *   - x_studio_driver_status (selection: Available/On Trip/Off Duty/Suspended)
 *
 * We filter partners where x_studio_license_number IS SET to distinguish
 * drivers from regular contacts.
 */

import { searchRead, searchCount, create, write } from "./client"
import type {
  OdooRawDriver,
  Driver,
  DriverStatus,
  CreateDriverPayload,
} from "./types"

// ---------------------------------------------------------------------------
// Odoo field list
// ---------------------------------------------------------------------------

const DRIVER_FIELDS = [
  "id",
  "name",
  "phone",
  "mobile",
  "email",
  "x_studio_license_number",
  "x_studio_license_category",
  "x_studio_license_expiry_date",
  "x_studio_safety_score",
  "x_studio_driver_status",
]

/** Domain filter: only contacts that have a license number (= drivers) */
const DRIVER_DOMAIN: unknown[][] = [
  ["x_studio_license_number", "!=", false],
]

// ---------------------------------------------------------------------------
// Mapper
// ---------------------------------------------------------------------------

export function mapDriver(raw: OdooRawDriver): Driver {
  return {
    id: raw.id,
    name: raw.name || "",
    licenseNumber: raw.x_studio_license_number || "",
    licenseCategory: raw.x_studio_license_category || "Light",
    licenseExpiry: raw.x_studio_license_expiry_date || "",
    contactNumber: raw.mobile || raw.phone || "",
    safetyScore: raw.x_studio_safety_score || 0,
    status: (raw.x_studio_driver_status as DriverStatus) || "Available",
  }
}

// ---------------------------------------------------------------------------
// Service methods
// ---------------------------------------------------------------------------

/** Fetch all drivers, optionally filtered by status. */
export async function getDrivers(filters?: {
  status?: DriverStatus
  limit?: number
  offset?: number
}): Promise<Driver[]> {
  const domain = [...DRIVER_DOMAIN]
  if (filters?.status) {
    domain.push(["x_studio_driver_status", "=", filters.status])
  }

  const raw = await searchRead<OdooRawDriver>({
    model: "res.partner",
    domain,
    fields: DRIVER_FIELDS,
    limit: filters?.limit,
    offset: filters?.offset,
    order: "name asc",
  })

  return raw.map(mapDriver)
}

/** Fetch a single driver by ID. */
export async function getDriverById(id: number): Promise<Driver | null> {
  const raw = await searchRead<OdooRawDriver>({
    model: "res.partner",
    domain: [["id", "=", id], ...DRIVER_DOMAIN],
    fields: DRIVER_FIELDS,
    limit: 1,
  })
  return raw.length ? mapDriver(raw[0]) : null
}

/** Count drivers, optionally by status. */
export async function countDrivers(status?: DriverStatus): Promise<number> {
  const domain = [...DRIVER_DOMAIN]
  if (status) domain.push(["x_studio_driver_status", "=", status])
  return searchCount("res.partner", domain)
}

/** Create a new driver (creates a res.partner with driver fields). */
export async function createDriver(payload: CreateDriverPayload): Promise<number> {
  const [id] = await create("res.partner", {
    name: payload.name,
    mobile: payload.contactNumber,
    x_studio_license_number: payload.licenseNumber,
    x_studio_license_category: payload.licenseCategory,
    x_studio_license_expiry_date: payload.licenseExpiry,
    x_studio_driver_status: payload.status ?? "Available",
    x_studio_safety_score: 100, // new drivers start with perfect score
  })
  return id
}

/** Update a driver's status. */
export async function updateDriverStatus(
  id: number,
  status: DriverStatus
): Promise<boolean> {
  return write("res.partner", [id], {
    x_studio_driver_status: status,
  })
}

/** Update a driver's safety score. */
export async function updateDriverSafetyScore(
  id: number,
  score: number
): Promise<boolean> {
  return write("res.partner", [id], {
    x_studio_safety_score: Math.max(0, Math.min(100, score)),
  })
}
