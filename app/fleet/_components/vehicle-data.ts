export type VehicleType = "Van" | "Truck" | "Mini"
export type VehicleStatus = "Available" | "On Trip" | "In Shop" | "Retired"

export type Vehicle = {
  regNo: string
  name: string
  type: VehicleType
  maxCapacityKg: number
  odometerKm: number
  acquisitionCost: number
  status: VehicleStatus
}

export const VEHICLES: Vehicle[] = [
  {
    regNo: "GJ01AB1234",
    name: "Tata Ace Gold",
    type: "Mini",
    maxCapacityKg: 750,
    odometerKm: 42300,
    acquisitionCost: 450000,
    status: "Available",
  },
  {
    regNo: "GJ05CD5678",
    name: "Mahindra Bolero Pickup",
    type: "Van",
    maxCapacityKg: 1500,
    odometerKm: 78120,
    acquisitionCost: 820000,
    status: "On Trip",
  },
  {
    regNo: "MH12EF9012",
    name: "Ashok Leyland Dost+",
    type: "Truck",
    maxCapacityKg: 2500,
    odometerKm: 105600,
    acquisitionCost: 1250000,
    status: "In Shop",
  },
  {
    regNo: "GJ01GH3456",
    name: "Force Traveller",
    type: "Van",
    maxCapacityKg: 1800,
    odometerKm: 63450,
    acquisitionCost: 910000,
    status: "Available",
  },
  {
    regNo: "RJ14IJ7890",
    name: "Tata 407 Gold",
    type: "Truck",
    maxCapacityKg: 3500,
    odometerKm: 142000,
    acquisitionCost: 1575000,
    status: "Retired",
  },
  {
    regNo: "GJ06KL2345",
    name: "Piaggio Ape Xtra",
    type: "Mini",
    maxCapacityKg: 500,
    odometerKm: 28900,
    acquisitionCost: 320000,
    status: "On Trip",
  },
]

const currencyFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
})

export function formatCurrency(value: number) {
  return currencyFormatter.format(value)
}
