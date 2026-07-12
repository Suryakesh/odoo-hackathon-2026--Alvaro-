export type FuelLog = {
  id: string
  vehicleRegNo: string
  date: string
  liters: number
  cost: number
}

export type ExpenseStatus = "Approved" | "Pending" | "Rejected"

export type OtherExpense = {
  id: string
  tripId: string
  vehicleRegNo: string
  toll: number
  other: number
  status: ExpenseStatus
}

export const FUEL_LOGS: FuelLog[] = [
  {
    id: "FL-01",
    vehicleRegNo: "GJ01AB1234",
    date: "2026-07-01",
    liters: 42.5,
    cost: 4250,
  },
  {
    id: "FL-02",
    vehicleRegNo: "GJ05CD5678",
    date: "2026-07-03",
    liters: 60,
    cost: 6000,
  },
  {
    id: "FL-03",
    vehicleRegNo: "GJ01GH3456",
    date: "2026-07-05",
    liters: 55.2,
    cost: 5520,
  },
  {
    id: "FL-04",
    vehicleRegNo: "GJ06KL2345",
    date: "2026-07-08",
    liters: 30,
    cost: 3000,
  },
]

export const OTHER_EXPENSES: OtherExpense[] = [
  {
    id: "EXP-01",
    tripId: "TRP-1042",
    vehicleRegNo: "GJ05CD5678",
    toll: 150,
    other: 80,
    status: "Approved",
  },
  {
    id: "EXP-02",
    tripId: "TRP-1041",
    vehicleRegNo: "GJ01AB1234",
    toll: 220,
    other: 0,
    status: "Pending",
  },
  {
    id: "EXP-03",
    tripId: "TRP-1039",
    vehicleRegNo: "RJ14IJ7890",
    toll: 0,
    other: 500,
    status: "Rejected",
  },
]

export function computeTotalOperationalCost() {
  const fuelTotal = FUEL_LOGS.reduce((sum, log) => sum + log.cost, 0)
  const expenseTotal = OTHER_EXPENSES.reduce(
    (sum, expense) => sum + expense.toll + expense.other,
    0
  )
  return fuelTotal + expenseTotal
}
