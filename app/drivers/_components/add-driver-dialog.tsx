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

interface AddDriverDialogProps {
  onCreated?: () => void
}

export function AddDriverDialog({ onCreated }: AddDriverDialogProps) {
  const [open, setOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [licenseCategory, setLicenseCategory] = useState("LMV")
  const [status, setStatus] = useState("Available")

  const nameRef = useRef<HTMLInputElement>(null)
  const licenseNumberRef = useRef<HTMLInputElement>(null)
  const licenseExpiryRef = useRef<HTMLInputElement>(null)
  const contactRef = useRef<HTMLInputElement>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setError(null)

    try {
      const res = await fetch("/api/drivers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: nameRef.current?.value ?? "",
          licenseNumber: licenseNumberRef.current?.value ?? "",
          licenseCategory,
          licenseExpiry: licenseExpiryRef.current?.value ?? "",
          contactNumber: contactRef.current?.value ?? "",
          status,
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
            Add Driver
          </Button>
        }
      />
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add Driver</DialogTitle>
            <DialogDescription>
              Register a new driver. Expired license or Suspended status blocks
              trip assignment.
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-2 gap-4 py-2">
            <div className="col-span-2 flex flex-col gap-1.5">
              <Label htmlFor="driver-name">Driver Name</Label>
              <Input
                id="driver-name"
                ref={nameRef}
                placeholder="Rohan Mehta"
                required
              />
            </div>

            <div className="col-span-2 flex flex-col gap-1.5">
              <Label htmlFor="license-number">License Number</Label>
              <Input
                id="license-number"
                ref={licenseNumberRef}
                placeholder="GJ0120230012345"
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="license-category">License Category</Label>
              <Select
                items={LICENSE_CATEGORY_OPTIONS}
                value={licenseCategory}
                onValueChange={(v) => { if (v !== null) setLicenseCategory(v) }}
              >
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
              <Input
                id="license-expiry"
                ref={licenseExpiryRef}
                type="date"
                required
              />
            </div>

            <div className="col-span-2 flex flex-col gap-1.5">
              <Label htmlFor="contact-number">Contact Number</Label>
              <Input
                id="contact-number"
                ref={contactRef}
                type="tel"
                placeholder="+91 98250 12345"
                required
              />
            </div>

            <div className="col-span-2 flex flex-col gap-1.5">
              <Label htmlFor="driver-status">Status</Label>
              <Select
                items={STATUS_OPTIONS}
                value={status}
                onValueChange={(v) => { if (v !== null) setStatus(v) }}
              >
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

          {error && <p className="mt-1 text-sm text-red-400">{error}</p>}

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
