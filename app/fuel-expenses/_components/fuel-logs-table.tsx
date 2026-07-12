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

import { FUEL_LOGS } from "./fuel-expense-data"

export function FuelLogsTable() {
  return (
    <Card className="border border-white/10 bg-white/[0.03] ring-0">
      <CardHeader>
        <CardTitle className="text-white">Fuel Logs</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow className="border-white/10 hover:bg-transparent">
              <TableHead className="text-neutral-500">Vehicle</TableHead>
              <TableHead className="text-neutral-500">Date</TableHead>
              <TableHead className="text-right text-neutral-500">
                Liters
              </TableHead>
              <TableHead className="text-right text-neutral-500">
                Cost
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {FUEL_LOGS.map((log) => (
              <TableRow
                key={log.id}
                className="border-white/10 hover:bg-white/[0.03]"
              >
                <TableCell className="font-medium text-neutral-200">
                  {log.vehicleRegNo}
                </TableCell>
                <TableCell className="text-neutral-300">
                  {new Date(log.date).toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </TableCell>
                <TableCell className="text-right text-neutral-300 tabular-nums">
                  {log.liters.toFixed(1)} L
                </TableCell>
                <TableCell className="text-right text-neutral-300 tabular-nums">
                  {formatCurrency(log.cost)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
