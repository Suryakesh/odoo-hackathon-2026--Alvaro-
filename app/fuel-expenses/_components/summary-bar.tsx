import { Card, CardContent } from "@/components/ui/card"
import { formatCurrency } from "@/app/fleet/_components/vehicle-data"

import { computeTotalOperationalCost } from "./fuel-expense-data"

export function SummaryBar() {
  const total = computeTotalOperationalCost()

  return (
    <Card className="border border-white/10 bg-white/[0.03] ring-0">
      <CardContent className="flex flex-col items-start justify-between gap-2 sm:flex-row sm:items-center">
        <span className="text-sm text-neutral-400">
          Total Operational Cost (Auto) = Fuel + Misc
        </span>
        <span className="text-3xl font-bold tracking-tight text-white tabular-nums">
          {formatCurrency(total)}
        </span>
      </CardContent>
    </Card>
  )
}
