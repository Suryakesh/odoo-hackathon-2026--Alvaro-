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
import { DRIVER_STATUS_COLOR, STATUS_COLORS } from "@/lib/status-colors"
import { cn } from "@/lib/utils"

import { DRIVERS, formatDate, isLicenseExpired } from "./driver-data"

export function DriversTable() {
  return (
    <Card className="border border-white/10 bg-white/[0.03] ring-0">
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow className="border-white/10 hover:bg-transparent">
              <TableHead className="text-neutral-500">Driver Name</TableHead>
              <TableHead className="text-neutral-500">
                License Number
              </TableHead>
              <TableHead className="text-neutral-500">
                License Category
              </TableHead>
              <TableHead className="text-neutral-500">
                License Expiry
              </TableHead>
              <TableHead className="text-neutral-500">Contact</TableHead>
              <TableHead className="text-right text-neutral-500">
                Trips
              </TableHead>
              <TableHead className="text-right text-neutral-500">
                Safety Score
              </TableHead>
              <TableHead className="text-neutral-500">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {DRIVERS.map((driver) => {
              const expired = isLicenseExpired(driver.licenseExpiry)
              return (
                <TableRow
                  key={driver.licenseNumber}
                  className="border-white/10 hover:bg-white/[0.03]"
                >
                  <TableCell className="font-medium text-neutral-200">
                    {driver.name}
                  </TableCell>
                  <TableCell className="text-neutral-300">
                    {driver.licenseNumber}
                  </TableCell>
                  <TableCell className="text-neutral-300">
                    {driver.licenseCategory}
                  </TableCell>
                  <TableCell
                    className={cn(
                      expired ? "text-red-400" : "text-neutral-300"
                    )}
                  >
                    {formatDate(driver.licenseExpiry)}
                    {expired && (
                      <span className="ml-1.5 text-xs text-red-400/70">
                        (expired)
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-neutral-300">
                    {driver.contactNumber}
                  </TableCell>
                  <TableCell className="text-right text-neutral-300 tabular-nums">
                    {driver.tripCount}
                  </TableCell>
                  <TableCell className="text-right text-neutral-300 tabular-nums">
                    {driver.safetyScore}/100
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={`border-transparent ${STATUS_COLORS[DRIVER_STATUS_COLOR[driver.status]].badge}`}
                    >
                      {driver.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
