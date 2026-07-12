"use client"

import { useEffect, useState } from "react"
import { AlertTriangle } from "lucide-react"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
// TEMPORARY: real driver data isn't available from the Odoo backend yet,
// so the Driver dropdown still uses mock data. Swap this for a
// fetch("/api/drivers") once that endpoint exists.
import { DRIVERS } from "@/app/drivers/_components/driver-data"
import type { Vehicle } from "@/lib/odoo"

import type { TripStatus } from "./trip-data"
import { TripStepper } from "./trip-stepper"

const AVAILABLE_DRIVERS = DRIVERS.filter((d) => d.status === "Available")

const DRIVER_OPTIONS = Object.fromEntries(
  AVAILABLE_DRIVERS.map((d) => [
    d.licenseNumber,
    `${d.name} — ${d.licenseCategory}`,
  ])
)

const INITIAL_FORM = {
  source: "",
  destination: "",
  vehicleRegNo: "",
  driverLicenseNumber: "",
  cargoWeight: "",
  plannedDistance: "",
}

export function CreateTripForm() {
  const [form, setForm] = useState(INITIAL_FORM)
  const [stage, setStage] = useState<TripStatus>("Draft")

  const [vehicles, setVehicles] = useState<Vehicle[] | null>(null)
  const [vehiclesError, setVehiclesError] = useState<string | null>(null)

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
        if (!cancelled) setVehiclesError("Failed to load vehicles")
      })

    return () => {
      cancelled = true
    }
  }, [])

  const availableVehicles = (vehicles ?? []).filter(
    (v) => v.status === "Available"
  )
  const vehicleOptions = Object.fromEntries(
    availableVehicles.map((v) => [
      v.regNo,
      `${v.regNo} - ${v.maxCapacityKg} kg capacity`,
    ])
  )

  const selectedVehicle = availableVehicles.find(
    (v) => v.regNo === form.vehicleRegNo
  )
  const cargoWeightNum = Number(form.cargoWeight) || 0
  const plannedDistanceNum = Number(form.plannedDistance) || 0

  const capacityExceeded =
    !!selectedVehicle &&
    cargoWeightNum > 0 &&
    cargoWeightNum > selectedVehicle.maxCapacityKg
  const capacityDifference = selectedVehicle
    ? cargoWeightNum - selectedVehicle.maxCapacityKg
    : 0

  const isFormComplete =
    form.source.trim() !== "" &&
    form.destination.trim() !== "" &&
    !!selectedVehicle &&
    form.driverLicenseNumber !== "" &&
    cargoWeightNum > 0 &&
    plannedDistanceNum > 0

  const canDispatch = isFormComplete && !capacityExceeded && stage === "Draft"

  function handleDispatch() {
    if (canDispatch) setStage("Dispatched")
  }

  function handleCancel() {
    setForm(INITIAL_FORM)
    setStage("Draft")
  }

  return (
    <Card className="border border-white/10 bg-white/[0.03] ring-0">
      <CardHeader>
        <CardTitle className="text-white">Create Trip</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        <TripStepper current={stage} />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="source">Source</Label>
            <Input
              id="source"
              placeholder="Ahmedabad"
              value={form.source}
              onChange={(e) =>
                setForm((f) => ({ ...f, source: e.target.value }))
              }
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="destination">Destination</Label>
            <Input
              id="destination"
              placeholder="Surat"
              value={form.destination}
              onChange={(e) =>
                setForm((f) => ({ ...f, destination: e.target.value }))
              }
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="vehicle">Vehicle</Label>
            {vehiclesError ? (
              <p className="text-sm text-red-400">{vehiclesError}</p>
            ) : !vehicles ? (
              <p className="text-sm text-neutral-500">Loading vehicles...</p>
            ) : (
              <Select
                items={vehicleOptions}
                value={form.vehicleRegNo || null}
                onValueChange={(value) =>
                  setForm((f) => ({
                    ...f,
                    vehicleRegNo: (value as string) ?? "",
                  }))
                }
              >
                <SelectTrigger id="vehicle" className="w-full">
                  <SelectValue placeholder="Select available vehicle" />
                </SelectTrigger>
                <SelectContent>
                  {availableVehicles.map((v) => (
                    <SelectItem key={v.regNo} value={v.regNo}>
                      {v.regNo} - {v.maxCapacityKg} kg capacity
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="driver">Driver</Label>
            <Select
              items={DRIVER_OPTIONS}
              value={form.driverLicenseNumber || null}
              onValueChange={(value) =>
                setForm((f) => ({
                  ...f,
                  driverLicenseNumber: (value as string) ?? "",
                }))
              }
            >
              <SelectTrigger id="driver" className="w-full">
                <SelectValue placeholder="Select available driver" />
              </SelectTrigger>
              <SelectContent>
                {AVAILABLE_DRIVERS.map((d) => (
                  <SelectItem key={d.licenseNumber} value={d.licenseNumber}>
                    {d.name} — {d.licenseCategory}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="cargo-weight">Cargo Weight (kg)</Label>
            <Input
              id="cargo-weight"
              type="number"
              min={0}
              placeholder="500"
              value={form.cargoWeight}
              onChange={(e) =>
                setForm((f) => ({ ...f, cargoWeight: e.target.value }))
              }
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="planned-distance">Planned Distance (km)</Label>
            <Input
              id="planned-distance"
              type="number"
              min={0}
              placeholder="270"
              value={form.plannedDistance}
              onChange={(e) =>
                setForm((f) => ({ ...f, plannedDistance: e.target.value }))
              }
            />
          </div>
        </div>

        {capacityExceeded && selectedVehicle && (
          <Alert className="border-red-500/40 bg-red-500/[0.06]">
            <AlertTriangle className="text-red-400" />
            <AlertTitle className="text-red-400">
              Vehicle Capacity: {selectedVehicle.maxCapacityKg} kg
            </AlertTitle>
            <AlertDescription className="text-red-400/70">
              Cargo Weight: {cargoWeightNum} kg
              <br />
              ❌ Capacity exceeded by {capacityDifference} kg — dispatch
              blocked
            </AlertDescription>
          </Alert>
        )}

        {stage === "Dispatched" && (
          <p className="text-sm text-[#3fbf3f]">
            Trip dispatched successfully.
          </p>
        )}

        <div className="flex gap-3">
          <Button
            className="flex-1"
            disabled={!canDispatch}
            onClick={handleDispatch}
          >
            Dispatch
          </Button>
          <Button variant="outline" className="flex-1" onClick={handleCancel}>
            Cancel
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
