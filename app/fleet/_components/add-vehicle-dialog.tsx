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

const TYPE_OPTIONS = {
  Van: "Van",
  Truck: "Truck",
  Mini: "Mini",
}

const STATUS_OPTIONS = {
  Available: "Available",
  "On Trip": "On Trip",
  "In Shop": "In Shop",
  Retired: "Retired",
}

export function AddVehicleDialog() {
  return (
    <Dialog>
      <DialogTrigger
        render={
          <Button className="gap-1.5">
            <Plus className="size-4" />
            Add Vehicle
          </Button>
        }
      />
      <DialogContent className="sm:max-w-md">
        <form>
          <DialogHeader>
            <DialogTitle>Add Vehicle</DialogTitle>
            <DialogDescription>
              Register a new vehicle to the fleet. Registration number must
              be unique.
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-2 gap-4 py-2">
            <div className="col-span-2 flex flex-col gap-1.5">
              <Label htmlFor="reg-no">Reg No</Label>
              <Input id="reg-no" placeholder="GJ01AB1234" required />
            </div>

            <div className="col-span-2 flex flex-col gap-1.5">
              <Label htmlFor="vehicle-name">Vehicle Name / Model</Label>
              <Input
                id="vehicle-name"
                placeholder="Tata Ace Gold"
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="vehicle-type">Type</Label>
              <Select items={TYPE_OPTIONS} defaultValue="Van">
                <SelectTrigger id="vehicle-type" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Van">Van</SelectItem>
                  <SelectItem value="Truck">Truck</SelectItem>
                  <SelectItem value="Mini">Mini</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="vehicle-status">Status</Label>
              <Select items={STATUS_OPTIONS} defaultValue="Available">
                <SelectTrigger id="vehicle-status" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Available">Available</SelectItem>
                  <SelectItem value="On Trip">On Trip</SelectItem>
                  <SelectItem value="In Shop">In Shop</SelectItem>
                  <SelectItem value="Retired">Retired</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="max-capacity">Max Capacity (kg)</Label>
              <Input id="max-capacity" type="number" min={0} placeholder="1500" required />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="odometer">Odometer (km)</Label>
              <Input id="odometer" type="number" min={0} placeholder="0" required />
            </div>

            <div className="col-span-2 flex flex-col gap-1.5">
              <Label htmlFor="acquisition-cost">Acquisition Cost</Label>
              <Input
                id="acquisition-cost"
                type="number"
                min={0}
                placeholder="820000"
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
