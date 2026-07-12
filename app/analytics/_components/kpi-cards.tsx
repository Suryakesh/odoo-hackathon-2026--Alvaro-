import { Card, CardContent } from "@/components/ui/card"

import { KPIS } from "./analytics-data"

export function KpiCards() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
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
