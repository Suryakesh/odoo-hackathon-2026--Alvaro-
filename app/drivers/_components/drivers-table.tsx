"use client"

import { AlertCircle, Loader2 } from "lucide-react"

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
import type { Driver } from "@/lib/odoo"

import { formatDate, isLicenseExpired } from "./driver-data"

interface DriversTableProps {
  drivers: Driver[]
  loading: boolean
  error: string | null
}

export function DriversTable({ drivers, loading, error }: DriversTableProps) {
  return (
    <Card className="border border-white/10 bg-white/[0.03] ring-0">
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center gap-2 py-10 text-neutral-400">
            <Loader2 className="size-4 animate-spin" />
            <span className="text-sm">Loading drivers…</span>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center gap-2 py-10 text-red-400">
            <AlertCircle className="size-4" />
            <span className="text-sm">{error}</span>
          </div>
        ) : drivers.length === 0 ? (
          <p className="py-10 text-center text-sm text-neutral-500">
            No drivers found.
          </p>
        ) : (
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
              {drivers.map((driver) => {
                const expired = driver.licenseExpiry
                  ? isLicenseExpired(driver.licenseExpiry)
                  : false
                return (
                  <TableRow
                    key={driver.id}
                    className="border-white/10 hover:bg-white/[0.03]"
                  >
                    <TableCell className="font-medium text-neutral-200">
                      {driver.name}
                    </TableCell>
                    <TableCell className="text-neutral-300">
                      {driver.licenseNumber || "—"}
                    </TableCell>
                    <TableCell className="text-neutral-300">
                      {driver.licenseCategory || "—"}
                    </TableCell>
                    <TableCell
                      className={cn(
                        expired ? "text-red-400" : "text-neutral-300"
                      )}
                    >
                      {driver.licenseExpiry
                        ? formatDate(driver.licenseExpiry)
                        : "—"}
                      {expired && (
                        <span className="ml-1.5 text-xs text-red-400/70">
                          (expired)
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-neutral-300">
                      {driver.contactNumber || "—"}
                    </TableCell>
                    <TableCell className="text-right text-neutral-300 tabular-nums">
                      —
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
        )}
      </CardContent>
    </Card>
  )
}
