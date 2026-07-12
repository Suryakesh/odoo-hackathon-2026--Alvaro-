"use client"

import { useEffect, useState } from "react"

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
import type { Vehicle } from "@/lib/odoo"
import { STATUS_COLORS, VEHICLE_STATUS_COLOR } from "@/lib/status-colors"

import { formatCurrency } from "./vehicle-data"

export function VehicleTable() {
  const [vehicles, setVehicles] = useState<Vehicle[] | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    fetch("/api/vehicles")
      .then((res) => {
        if (!res.ok) throw new Error("Request failed")
        return res.json()
      })
      .then((data: Vehicle[]) => {
        if (!cancelled) setVehicles(data)
      })
      .catch(() => {
        if (!cancelled) setError("Failed to load vehicles")
      })

    return () => {
      cancelled = true
    }
  }, [])

  return (
    <Card className="border border-white/10 bg-white/[0.03] ring-0">
      <CardContent>
        {error ? (
          <p className="py-10 text-center text-sm text-red-400">{error}</p>
        ) : !vehicles ? (
          <p className="py-10 text-center text-sm text-neutral-500">
            Loading vehicles...
          </p>
        ) : (
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
              {vehicles.map((vehicle) => (
                <TableRow
                  key={vehicle.id}
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
        )}
      </CardContent>
    </Card>
  )
}
