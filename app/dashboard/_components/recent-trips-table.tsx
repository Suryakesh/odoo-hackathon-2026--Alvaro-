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

import type { Trip } from "@/lib/odoo"
import { STATUS_COLORS, TRIP_STATUS_COLOR } from "@/lib/status-colors"

type RecentTripsTableProps = {
  trips: Trip[]
}

function formatTripTime(value: string): string {
  if (!value) return "—"

  return new Date(value.replace(" ", "T")).toLocaleTimeString("en-IN", {
    hour: "numeric",
    minute: "2-digit",
  })
}

export function RecentTripsTable({ trips }: RecentTripsTableProps) {
  return (
    <Card className="border border-white/10 bg-white/[0.03] ring-0">
      <CardHeader>
        <CardTitle className="text-white">Recent Trips</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow className="border-white/10 hover:bg-transparent">
              <TableHead className="text-neutral-500">Trip ID</TableHead>
              <TableHead className="text-neutral-500">Vehicle</TableHead>
              <TableHead className="text-neutral-500">Driver</TableHead>
              <TableHead className="text-neutral-500">Status</TableHead>
              <TableHead className="text-right text-neutral-500">
                ETA
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {trips.length ? (
              trips.map((trip) => (
                <TableRow
                  key={trip.id}
                  className="border-white/10 hover:bg-white/[0.03]"
                >
                  <TableCell className="font-medium text-neutral-200">
                    TRIP-{trip.id}
                  </TableCell>
                  <TableCell className="text-neutral-300">
                    {trip.vehicleDisplay || "Unassigned"}
                  </TableCell>
                  <TableCell className="text-neutral-300">
                    {trip.driverName || "Unassigned"}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={`border-transparent ${STATUS_COLORS[TRIP_STATUS_COLOR[trip.status]].badge}`}
                    >
                      {trip.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right text-neutral-300">
                    {formatTripTime(trip.updatedAt || trip.createdAt)}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow className="border-white/10 hover:bg-transparent">
                <TableCell
                  colSpan={5}
                  className="py-10 text-center text-sm text-neutral-500"
                >
                  No trips found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
