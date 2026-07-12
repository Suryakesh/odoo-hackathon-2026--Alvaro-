"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { Loader2, Plus } from "lucide-react"

import { Badge } from "@/components/ui/badge"
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { formatCurrency } from "@/app/fleet/_components/vehicle-data"
import { STATUS_COLORS } from "@/lib/status-colors"
import type { Maintenance, Vehicle } from "@/lib/odoo"

const SERVICE_TYPE_OPTIONS = {
  Preventive: "Preventive",
  Corrective: "Corrective",
  Inspection: "Inspection",
}

const STATUS_BADGE: Record<
  string,
  { label: string; colorKey: keyof typeof STATUS_COLORS }
> = {
  active: { label: "In Shop", colorKey: "amber" },
  completed: { label: "Completed", colorKey: "green" },
}

function formatDate(dateStr: string) {
  if (!dateStr) return "—"
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })
}

export function MaintenancePage() {
  // ── Service log (read) ──────────────────────────────────────────────────
  const [records, setRecords] = useState<Maintenance[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // ── Vehicles for dropdown ────────────────────────────────────────────────
  const [vehicles, setVehicles] = useState<Vehicle[] | null>(null)
  const [vehiclesError, setVehiclesError] = useState<string | null>(null)
  const [vehicleId, setVehicleId] = useState("")

  // ── Form state ───────────────────────────────────────────────────────────
  const [serviceType, setServiceType] = useState("Preventive")
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [formSuccess, setFormSuccess] = useState(false)

  const costRef = useRef<HTMLInputElement>(null)
  const dateRef = useRef<HTMLInputElement>(null)
  const descRef = useRef<HTMLInputElement>(null)

  const fetchRecords = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/maintenance")
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error ?? `Request failed (${res.status})`)
      }
      const data: Maintenance[] = await res.json()
      setRecords(data)
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load maintenance records"
      )
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    let cancelled = false

    fetchRecords()

    fetch("/api/vehicles")
      .then((res) => {
        if (!res.ok) throw new Error("Request failed")
        return res.json()
      })
      .then((data: Vehicle[]) => {
        if (!cancelled) {
          setVehicles(data)
          if (data.length) setVehicleId(String(data[0].id))
        }
      })
      .catch(() => {
        if (!cancelled) setVehiclesError("Failed to load vehicles")
      })

    return () => {
      cancelled = true
    }
  }, [fetchRecords])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setFormError(null)
    setFormSuccess(false)

    try {
      const res = await fetch("/api/maintenance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          vehicleId: Number(vehicleId),
          maintenanceType: serviceType,
          cost: parseFloat(costRef.current?.value ?? "0") || 0,
          date: dateRef.current?.value ?? "",
          description: descRef.current?.value ?? "",
        }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error ?? `Request failed (${res.status})`)
      }

      setFormSuccess(true)
      // reset form inputs
      if (costRef.current) costRef.current.value = ""
      if (dateRef.current) dateRef.current.value = ""
      if (descRef.current) descRef.current.value = ""
      setServiceType("Preventive")

      await fetchRecords()
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Unknown error")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="flex flex-col gap-6 p-4 lg:p-6">
      {/* ── Log Service Record form ──────────────────────────────────────── */}
      <Card className="border border-white/10 bg-white/[0.03] ring-0">
        <CardHeader>
          <CardTitle className="text-white">Log Service Record</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {/* Vehicle */}
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="maint-vehicle">Vehicle</Label>
                {vehiclesError ? (
                  <p className="text-sm text-red-400">{vehiclesError}</p>
                ) : !vehicles ? (
                  <p className="text-sm text-neutral-500">
                    Loading vehicles...
                  </p>
                ) : (
                  <Select
                    items={Object.fromEntries(
                      vehicles.map((v) => [String(v.id), `${v.regNo} — ${v.name}`])
                    )}
                    value={vehicleId || null}
                    onValueChange={(v) => {
                      if (v !== null) setVehicleId(v)
                    }}
                  >
                    <SelectTrigger id="maint-vehicle" className="w-full">
                      <SelectValue placeholder="Select vehicle" />
                    </SelectTrigger>
                    <SelectContent>
                      {vehicles.map((v) => (
                        <SelectItem key={v.id} value={String(v.id)}>
                          {v.regNo} — {v.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>

              {/* Service Type */}
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="maint-type">Service Type</Label>
                <Select
                  items={SERVICE_TYPE_OPTIONS}
                  value={serviceType}
                  onValueChange={(v) => {
                    if (v !== null) setServiceType(v)
                  }}
                >
                  <SelectTrigger id="maint-type" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Preventive">Preventive</SelectItem>
                    <SelectItem value="Corrective">Corrective</SelectItem>
                    <SelectItem value="Inspection">Inspection</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Cost */}
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="maint-cost">Cost (₹)</Label>
                <Input
                  id="maint-cost"
                  ref={costRef}
                  type="number"
                  min={0}
                  placeholder="5000"
                />
              </div>

              {/* Date */}
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="maint-date">Service Date</Label>
                <Input
                  id="maint-date"
                  ref={dateRef}
                  type="date"
                  required
                />
              </div>

              {/* Description */}
              <div className="col-span-full flex flex-col gap-1.5">
                <Label htmlFor="maint-desc">Description</Label>
                <Input
                  id="maint-desc"
                  ref={descRef}
                  placeholder="Oil change, brake inspection…"
                />
              </div>
            </div>

            {formError && (
              <p className="mt-3 text-sm text-red-400">{formError}</p>
            )}
            {formSuccess && (
              <p className="mt-3 text-sm text-[#3fbf3f]">
                Record saved successfully.
              </p>
            )}

            <div className="mt-4 flex justify-end">
              <Button
                type="submit"
                disabled={submitting || !vehicles}
                className="gap-1.5"
              >
                {submitting ? (
                  <Loader2 className="size-3.5 animate-spin" />
                ) : (
                  <Plus className="size-4" />
                )}
                Save Record
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* ── Service Log table ────────────────────────────────────────────── */}
      <Card className="border border-white/10 bg-white/[0.03] ring-0">
        <CardHeader>
          <CardTitle className="text-white">Service Log</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center gap-2 py-10 text-neutral-400">
              <Loader2 className="size-4 animate-spin" />
              <span className="text-sm">Loading records…</span>
            </div>
          ) : error ? (
            <div className="py-10 text-center text-sm text-red-400">
              {error}
            </div>
          ) : records.length === 0 ? (
            <p className="py-10 text-center text-sm text-neutral-500">
              No maintenance records found.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-white/10 hover:bg-transparent">
                  <TableHead className="text-neutral-500">Vehicle</TableHead>
                  <TableHead className="text-neutral-500">
                    Service Type
                  </TableHead>
                  <TableHead className="text-right text-neutral-500">
                    Cost
                  </TableHead>
                  <TableHead className="text-neutral-500">Date</TableHead>
                  <TableHead className="text-neutral-500">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {records.map((rec) => {
                  const badge = STATUS_BADGE[rec.status] ?? {
                    label: rec.status,
                    colorKey: "grey" as const,
                  }
                  return (
                    <TableRow
                      key={rec.id}
                      className="border-white/10 hover:bg-white/[0.03]"
                    >
                      <TableCell className="font-medium text-neutral-200">
                        {rec.vehicleDisplay}
                      </TableCell>
                      <TableCell className="text-neutral-300">
                        {rec.maintenanceType || "—"}
                      </TableCell>
                      <TableCell className="text-right text-neutral-300 tabular-nums">
                        {formatCurrency(rec.cost)}
                      </TableCell>
                      <TableCell className="text-neutral-300">
                        {formatDate(rec.date)}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={`border-transparent ${STATUS_COLORS[badge.colorKey].badge}`}
                        >
                          {badge.label}
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

      {/* ── Status note ─────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-2 text-sm text-neutral-400">
          <span className="font-medium text-neutral-500">Status flow:</span>
          <Badge
            variant="outline"
            className={`border-transparent ${STATUS_COLORS.amber.badge}`}
          >
            In Shop
          </Badge>
          <span>→</span>
          <Badge
            variant="outline"
            className={`border-transparent ${STATUS_COLORS.green.badge}`}
          >
            Completed
          </Badge>
        </div>
        <p className="text-sm text-red-400/70">
          In Shop vehicles are removed from the dispatch pool.
        </p>
      </div>
    </div>
  )
}
