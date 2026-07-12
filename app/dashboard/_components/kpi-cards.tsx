import { Card, CardContent } from "@/components/ui/card"

const KPIS = [
  { label: "Active Vehicles", value: "142" },
  { label: "Available Vehicles", value: "58" },
  { label: "Vehicles in Maintenance", value: "12" },
  { label: "Active Trips", value: "37" },
  { label: "Pending Trips", value: "9" },
  { label: "Drivers On Duty", value: "96" },
  { label: "Fleet Utilization", value: "78%" },
] as const

export function KpiCards() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7">
      {KPIS.map((kpi) => (
        <Card
          key={kpi.label}
          className="border border-white/10 bg-white/[0.03] ring-0"
        >
          <CardContent className="flex flex-col gap-1.5">
            <span className="text-xs font-medium text-neutral-500">
              {kpi.label}
            </span>
            <span className="font-heading text-2xl font-bold tracking-tight text-white">
              {kpi.value}
            </span>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
