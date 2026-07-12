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

const LICENSE_CATEGORY_OPTIONS = {
  LMV: "LMV",
  HMV: "HMV",
  MCWG: "MCWG",
}

const STATUS_OPTIONS = {
  Available: "Available",
  "On Trip": "On Trip",
  "Off Duty": "Off Duty",
  Suspended: "Suspended",
}

export function AddDriverDialog() {
  return (
    <Dialog>
      <DialogTrigger
        render={
          <Button className="gap-1.5">
            <Plus className="size-4" />
            Add Driver
          </Button>
        }
      />
      <DialogContent className="sm:max-w-md">
        <form>
          <DialogHeader>
            <DialogTitle>Add Driver</DialogTitle>
            <DialogDescription>
              Register a new driver. Expired license or Suspended status
              blocks trip assignment.
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-2 gap-4 py-2">
            <div className="col-span-2 flex flex-col gap-1.5">
              <Label htmlFor="driver-name">Driver Name</Label>
              <Input id="driver-name" placeholder="Rohan Mehta" required />
            </div>

            <div className="col-span-2 flex flex-col gap-1.5">
              <Label htmlFor="license-number">License Number</Label>
              <Input
                id="license-number"
                placeholder="GJ0120230012345"
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="license-category">License Category</Label>
              <Select items={LICENSE_CATEGORY_OPTIONS} defaultValue="LMV">
                <SelectTrigger id="license-category" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="LMV">LMV</SelectItem>
                  <SelectItem value="HMV">HMV</SelectItem>
                  <SelectItem value="MCWG">MCWG</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="license-expiry">License Expiry Date</Label>
              <Input id="license-expiry" type="date" required />
            </div>

            <div className="col-span-2 flex flex-col gap-1.5">
              <Label htmlFor="contact-number">Contact Number</Label>
              <Input
                id="contact-number"
                type="tel"
                placeholder="+91 98250 12345"
                required
              />
            </div>

            <div className="col-span-2 flex flex-col gap-1.5">
              <Label htmlFor="driver-status">Status</Label>
              <Select items={STATUS_OPTIONS} defaultValue="Available">
                <SelectTrigger id="driver-status" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Available">Available</SelectItem>
                  <SelectItem value="On Trip">On Trip</SelectItem>
                  <SelectItem value="Off Duty">Off Duty</SelectItem>
                  <SelectItem value="Suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>
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
