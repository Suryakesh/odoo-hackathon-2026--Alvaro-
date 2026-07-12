"use client"

import { useRef, useState } from "react"
import { Loader2, Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { LIVE_TRIPS } from "@/app/trips/_components/trip-data"
import { VEHICLES } from "@/app/fleet/_components/vehicle-data"

interface AddExpenseDialogProps {
  onCreated?: () => void
}

export function AddExpenseDialog({ onCreated }: AddExpenseDialogProps) {
  const [open, setOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // controlled select values
  const [tripId, setTripId] = useState(LIVE_TRIPS[0]?.id ?? "")
  const [vehicleId, setVehicleId] = useState(VEHICLES[0]?.regNo ?? "")

  const tollRef = useRef<HTMLInputElement>(null)
  const otherRef = useRef<HTMLInputElement>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setError(null)

    try {
      const res = await fetch("/api/expenses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          description: `Expense for ${tripId}`,
          // Send display strings — the server maps to IDs via Odoo
          // The x_other_expenses model accepts Many2one id; here we pass the
          // display string as description and the textual trip/vehicle refs.
          // If your Odoo model needs numeric IDs, replace these with lookups.
          tripId: Number(tripId) || null,
          vehicleId: Number(vehicleId) || null,
          toll: parseFloat(tollRef.current?.value ?? "0") || 0,
          other: parseFloat(otherRef.current?.value ?? "0") || 0,
          status: "Pending",
        }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error ?? `Request failed (${res.status})`)
      }

      setOpen(false)
      onCreated?.()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button className="gap-1.5">
            <Plus className="size-4" />
            Add Expense
          </Button>
        }
      />
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add Expense</DialogTitle>
            <DialogDescription>
              Log toll or miscellaneous expenses for a trip.
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-2 gap-4 py-2">
            <div className="col-span-2 flex flex-col gap-1.5">
              <Label htmlFor="expense-trip">Trip</Label>
              <Select
                items={Object.fromEntries(
                  LIVE_TRIPS.map((t) => [
                    t.id,
                    `${t.id} (${t.source} → ${t.destination})`,
                  ])
                )}
                value={tripId}
                onValueChange={(v) => { if (v !== null) setTripId(v) }}
              >
                <SelectTrigger id="expense-trip" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {LIVE_TRIPS.map((t) => (
                    <SelectItem key={t.id} value={t.id}>
                      {t.id} ({t.source} → {t.destination})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="col-span-2 flex flex-col gap-1.5">
              <Label htmlFor="expense-vehicle">Vehicle</Label>
              <Select
                items={Object.fromEntries(
                  VEHICLES.map((v) => [v.regNo, `${v.regNo} — ${v.name}`])
                )}
                value={vehicleId}
                onValueChange={(v) => { if (v !== null) setVehicleId(v) }}
              >
                <SelectTrigger id="expense-vehicle" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {VEHICLES.map((v) => (
                    <SelectItem key={v.regNo} value={v.regNo}>
                      {v.regNo} — {v.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="expense-toll">Toll Amount</Label>
              <Input
                id="expense-toll"
                ref={tollRef}
                type="number"
                min={0}
                placeholder="150"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="expense-other">Other Amount</Label>
              <Input
                id="expense-other"
                ref={otherRef}
                type="number"
                min={0}
                placeholder="80"
              />
            </div>
          </div>

          {error && (
            <p className="mt-1 text-sm text-red-400">{error}</p>
          )}

          <DialogFooter>
            <DialogClose render={<Button variant="outline" type="button" />}>
              Cancel
            </DialogClose>
            <Button type="submit" disabled={submitting} className="gap-1.5">
              {submitting && <Loader2 className="size-3.5 animate-spin" />}
              Save
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
