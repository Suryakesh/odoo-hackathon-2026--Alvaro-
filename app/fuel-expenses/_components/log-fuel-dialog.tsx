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
import { VEHICLES } from "@/app/fleet/_components/vehicle-data"

const VEHICLE_OPTIONS = Object.fromEntries(
  VEHICLES.map((v) => [v.regNo, `${v.regNo} — ${v.name}`])
)

export function LogFuelDialog() {
  return (
    <Dialog>
      <DialogTrigger
        render={
          <Button variant="outline" className="gap-1.5">
            <Plus className="size-4" />
            Log Fuel
          </Button>
        }
      />
      <DialogContent className="sm:max-w-md">
        <form>
          <DialogHeader>
            <DialogTitle>Log Fuel</DialogTitle>
            <DialogDescription>
              Record a fuel fill-up for a vehicle.
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-2 gap-4 py-2">
            <div className="col-span-2 flex flex-col gap-1.5">
              <Label htmlFor="fuel-vehicle">Vehicle</Label>
              <Select items={VEHICLE_OPTIONS} defaultValue={VEHICLES[0].regNo}>
                <SelectTrigger id="fuel-vehicle" className="w-full">
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

            <div className="col-span-2 flex flex-col gap-1.5">
              <Label htmlFor="fuel-date">Date</Label>
              <Input id="fuel-date" type="date" required />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="fuel-liters">Liters</Label>
              <Input
                id="fuel-liters"
                type="number"
                min={0}
                step="0.1"
                placeholder="42.5"
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="fuel-cost">Cost</Label>
              <Input
                id="fuel-cost"
                type="number"
                min={0}
                placeholder="4250"
                required
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
