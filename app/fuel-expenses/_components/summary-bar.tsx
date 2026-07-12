import { Card, CardContent } from "@/components/ui/card"
import { formatCurrency } from "@/app/fleet/_components/vehicle-data"

import { FUEL_LOGS } from "./fuel-expense-data"

const MOCK_FUEL_TOTAL = FUEL_LOGS.reduce((sum, log) => sum + log.cost, 0)

interface SummaryBarProps {
  /** Real expense total (toll + other) from Odoo. Falls back to 0 while loading. */
  expensesTotal?: number
}

export function SummaryBar({ expensesTotal = 0 }: SummaryBarProps) {
  const total = MOCK_FUEL_TOTAL + expensesTotal

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
