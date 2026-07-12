"use client"

import { Plus } from "lucide-react"

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

const TRIP_OPTIONS = Object.fromEntries(
  LIVE_TRIPS.map((t) => [t.id, `${t.id} (${t.source} → ${t.destination})`])
)

const VEHICLE_OPTIONS = Object.fromEntries(
  VEHICLES.map((v) => [v.regNo, `${v.regNo} — ${v.name}`])
)

export function AddExpenseDialog() {
  return (
    <Dialog>
      <DialogTrigger
        render={
          <Button className="gap-1.5">
            <Plus className="size-4" />
            Add Expense
          </Button>
        }
      />
      <DialogContent className="sm:max-w-md">
        <form>
          <DialogHeader>
            <DialogTitle>Add Expense</DialogTitle>
            <DialogDescription>
              Log toll or miscellaneous expenses for a trip.
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-2 gap-4 py-2">
            <div className="col-span-2 flex flex-col gap-1.5">
              <Label htmlFor="expense-trip">Trip</Label>
              <Select items={TRIP_OPTIONS} defaultValue={LIVE_TRIPS[0].id}>
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
              <Select items={VEHICLE_OPTIONS} defaultValue={VEHICLES[0].regNo}>
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
                type="number"
                min={0}
                placeholder="150"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="expense-other">Other Amount</Label>
              <Input
                id="expense-other"
                type="number"
                min={0}
                placeholder="80"
              />
            </div>
          </div>

          <DialogFooter>
            <DialogClose render={<Button variant="outline" type="button" />}>
              Cancel
            </DialogClose>
            <DialogClose render={<Button type="submit" />}>Save</DialogClose>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
