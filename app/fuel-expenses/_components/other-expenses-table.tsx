import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { formatCurrency } from "@/app/fleet/_components/vehicle-data"
import { EXPENSE_STATUS_COLOR, STATUS_COLORS } from "@/lib/status-colors"

import { OTHER_EXPENSES } from "./fuel-expense-data"

export function OtherExpensesTable() {
  return (
    <Card className="border border-white/10 bg-white/[0.03] ring-0">
      <CardHeader>
        <CardTitle className="text-white">
          Other Expenses (Toll/Misc)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow className="border-white/10 hover:bg-transparent">
              <TableHead className="text-neutral-500">Trip</TableHead>
              <TableHead className="text-neutral-500">Vehicle</TableHead>
              <TableHead className="text-right text-neutral-500">
                Toll
              </TableHead>
              <TableHead className="text-right text-neutral-500">
                Other
              </TableHead>
              <TableHead className="text-right text-neutral-500">
                Assoc. Expenses
              </TableHead>
              <TableHead className="text-neutral-500">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {OTHER_EXPENSES.map((expense) => (
              <TableRow
                key={expense.id}
                className="border-white/10 hover:bg-white/[0.03]"
              >
                <TableCell className="font-medium text-neutral-200">
                  {expense.tripId}
                </TableCell>
                <TableCell className="text-neutral-300">
                  {expense.vehicleRegNo}
                </TableCell>
                <TableCell className="text-right text-neutral-300 tabular-nums">
                  {formatCurrency(expense.toll)}
                </TableCell>
                <TableCell className="text-right text-neutral-300 tabular-nums">
                  {formatCurrency(expense.other)}
                </TableCell>
                <TableCell className="text-right font-medium text-neutral-200 tabular-nums">
                  {formatCurrency(expense.toll + expense.other)}
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={`border-transparent ${STATUS_COLORS[EXPENSE_STATUS_COLOR[expense.status]].badge}`}
                  >
                    {expense.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
