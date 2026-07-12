import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { STATUS_COLORS, VEHICLE_STATUS_COLOR } from "@/lib/status-colors"

import { formatCurrency, VEHICLES } from "./vehicle-data"

export function VehicleTable() {
  return (
    <Card className="border border-white/10 bg-white/[0.03] ring-0">
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow className="border-white/10 hover:bg-transparent">
              <TableHead className="text-neutral-500">Reg No</TableHead>
              <TableHead className="text-neutral-500">
                Vehicle Name/Model
              </TableHead>
              <TableHead className="text-neutral-500">Type</TableHead>
              <TableHead className="text-right text-neutral-500">
                Max Capacity (kg)
              </TableHead>
              <TableHead className="text-right text-neutral-500">
                Odometer (km)
              </TableHead>
              <TableHead className="text-right text-neutral-500">
                Acquisition Cost
              </TableHead>
              <TableHead className="text-neutral-500">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {VEHICLES.map((vehicle) => (
              <TableRow
                key={vehicle.regNo}
                className="border-white/10 hover:bg-white/[0.03]"
              >
                <TableCell className="font-medium text-neutral-200">
                  {vehicle.regNo}
                </TableCell>
                <TableCell className="text-neutral-300">
                  {vehicle.name}
                </TableCell>
                <TableCell className="text-neutral-300">
                  {vehicle.type}
                </TableCell>
                <TableCell className="text-right text-neutral-300 tabular-nums">
                  {vehicle.maxCapacityKg.toLocaleString("en-IN")}
                </TableCell>
                <TableCell className="text-right text-neutral-300 tabular-nums">
                  {vehicle.odometerKm.toLocaleString("en-IN")}
                </TableCell>
                <TableCell className="text-right text-neutral-300 tabular-nums">
                  {formatCurrency(vehicle.acquisitionCost)}
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={`border-transparent ${STATUS_COLORS[VEHICLE_STATUS_COLOR[vehicle.status]].badge}`}
                  >
                    {vehicle.status}
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
