export const KPIS = [
  { label: "Fuel Efficiency", value: "8.4 km/l" },
  { label: "Fleet Utilization", value: "81%" },
  { label: "Operational Cost", value: "₹34,070" },
  { label: "Vehicle ROI", value: "14.2%" },
] as const

export type MonthlyRevenue = {
  month: string
  revenue: number
}

export const MONTHLY_REVENUE: MonthlyRevenue[] = [
  { month: "Nov", revenue: 210000 },
  { month: "Dec", revenue: 225000 },
  { month: "Jan", revenue: 240000 },
  { month: "Feb", revenue: 232000 },
  { month: "Mar", revenue: 258000 },
  { month: "Apr", revenue: 270000 },
  { month: "May", revenue: 289000 },
  { month: "Jun", revenue: 305000 },
  { month: "Jul", revenue: 328000 },
]

export type CostlyVehicle = {
  regNo: string
  cost: number
}

export const TOP_COSTLIEST_VEHICLES: CostlyVehicle[] = [
  { regNo: "RJ14IJ7890", cost: 58200 },
  { regNo: "MH12EF9012", cost: 52900 },
  { regNo: "GJ05CD5678", cost: 41300 },
  { regNo: "GJ01GH3456", cost: 35600 },
]

export function downloadAnalyticsCsv() {
  const lines: string[] = []

  lines.push("KPI,Value")
  for (const kpi of KPIS) {
    lines.push(`${kpi.label},${kpi.value}`)
  }

  lines.push("")
  lines.push("Month,Revenue")
  for (const row of MONTHLY_REVENUE) {
    lines.push(`${row.month},${row.revenue}`)
  }

  lines.push("")
  lines.push("Vehicle,Cost")
  for (const row of TOP_COSTLIEST_VEHICLES) {
    lines.push(`${row.regNo},${row.cost}`)
  }

  const csvContent = lines.join("\n")
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
  const url = URL.createObjectURL(blob)

  const link = document.createElement("a")
  link.href = url
  link.download = "transitops-analytics.csv"
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
