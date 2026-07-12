"use client"

import { AlertCircle, Loader2 } from "lucide-react"

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
import type { OtherExpense } from "@/lib/odoo"

interface OtherExpensesTableProps {
  expenses: OtherExpense[]
  loading: boolean
  error: string | null
}

export function OtherExpensesTable({
  expenses,
  loading,
  error,
}: OtherExpensesTableProps) {
  return (
    <Card className="border border-white/10 bg-white/[0.03] ring-0">
      <CardHeader>
        <CardTitle className="text-white">
          Other Expenses (Toll/Misc)
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center gap-2 py-10 text-neutral-400">
            <Loader2 className="size-4 animate-spin" />
            <span className="text-sm">Loading expenses…</span>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center gap-2 py-10 text-red-400">
            <AlertCircle className="size-4" />
            <span className="text-sm">{error}</span>
          </div>
        ) : expenses.length === 0 ? (
          <p className="py-10 text-center text-sm text-neutral-500">
            No expenses found.
          </p>
        ) : (
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
              {expenses.map((expense) => (
                <TableRow
                  key={expense.id}
                  className="border-white/10 hover:bg-white/[0.03]"
                >
                  <TableCell className="font-medium text-neutral-200">
                    {expense.tripDisplay}
                  </TableCell>
                  <TableCell className="text-neutral-300">
                    {expense.vehicleDisplay}
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
        )}
      </CardContent>
    </Card>
  )
}
