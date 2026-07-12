/**
 * Other Expenses Service — x_other_expenses (custom Studio app)
 */

import { searchRead, create, write } from "./client"
import type {
  OdooRawOtherExpense,
  OtherExpense,
  ExpenseStatus,
  CreateOtherExpensePayload,
} from "./types"

const EXPENSE_FIELDS = [
  "id",
  "x_name",
  "x_studio_trip",
  "x_studio_vehicle",
  "x_studio_value", // toll cost
  "x_studio_other", // other cost
  "x_studio_status",
]

export function mapOtherExpense(raw: OdooRawOtherExpense): OtherExpense {
  return {
    id: raw.id,
    description: raw.x_name || `Expense Entry #${raw.id}`,
    tripId: raw.x_studio_trip ? raw.x_studio_trip[0] : null,
    tripDisplay: raw.x_studio_trip ? raw.x_studio_trip[1] : "No Trip",
    vehicleId: raw.x_studio_vehicle ? raw.x_studio_vehicle[0] : null,
    vehicleDisplay: raw.x_studio_vehicle ? raw.x_studio_vehicle[1] : "No Vehicle",
    toll: raw.x_studio_value || 0,
    other: raw.x_studio_other || 0,
    status: (raw.x_studio_status as ExpenseStatus) || "Pending",
  }
}

/** Fetch other operational expenses from Odoo */
export async function getOtherExpenses(filters?: {
  status?: ExpenseStatus
  tripId?: number
  vehicleId?: number
  limit?: number
  offset?: number
}): Promise<OtherExpense[]> {
  const domain: unknown[][] = []
  if (filters?.status) {
    domain.push(["x_studio_status", "=", filters.status])
  }
  if (filters?.tripId) {
    domain.push(["x_studio_trip", "=", filters.tripId])
  }
  if (filters?.vehicleId) {
    domain.push(["x_studio_vehicle", "=", filters.vehicleId])
  }

  const raw = await searchRead<OdooRawOtherExpense>({
    model: "x_other_expenses",
    domain,
    fields: EXPENSE_FIELDS,
    limit: filters?.limit,
    offset: filters?.offset,
    order: "id desc",
  })

  return raw.map(mapOtherExpense)
}

/** Create a new expense record in Odoo */
export async function createOtherExpense(
  payload: CreateOtherExpensePayload
): Promise<number> {
  const [id] = await create("x_other_expenses", {
    x_name: payload.description,
    x_studio_trip: payload.tripId,
    x_studio_vehicle: payload.vehicleId,
    x_studio_value: payload.toll,
    x_studio_other: payload.other,
    x_studio_status: payload.status ?? "Pending",
  })
  return id
}

/** Approve or Reject an expense */
export async function updateExpenseStatus(
  id: number,
  status: ExpenseStatus
): Promise<boolean> {
  return write("x_other_expenses", [id], {
    x_studio_status: status,
  })
}
