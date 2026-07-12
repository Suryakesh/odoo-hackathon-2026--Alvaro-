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

import { STATUS_COLORS, TRIP_STATUS_COLOR } from "./status-colors"

const TRIPS = [
  {
    id: "TRP-1042",
    vehicle: "Van 12 · KA-05-AB-1234",
    driver: "Rohan Mehta",
    status: "Dispatched",
    eta: "2:45 PM",
  },
  {
    id: "TRP-1041",
    vehicle: "Truck 07 · KA-01-XY-8890",
    driver: "Aisha Khan",
    status: "Completed",
    eta: "12:10 PM",
  },
  {
    id: "TRP-1040",
    vehicle: "Mini 03 · KA-09-CD-4521",
    driver: "Vikram Singh",
    status: "Draft",
    eta: "—",
  },
  {
    id: "TRP-1039",
    vehicle: "Van 05 · KA-02-EF-7788",
    driver: "Neha Sharma",
    status: "Cancelled",
    eta: "—",
  },
] as const

export function RecentTripsTable() {
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
            {TRIPS.map((trip) => (
              <TableRow
                key={trip.id}
                className="border-white/10 hover:bg-white/[0.03]"
              >
                <TableCell className="font-medium text-neutral-200">
                  {trip.id}
                </TableCell>
                <TableCell className="text-neutral-300">
                  {trip.vehicle}
                </TableCell>
                <TableCell className="text-neutral-300">
                  {trip.driver}
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
                  {trip.eta}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
