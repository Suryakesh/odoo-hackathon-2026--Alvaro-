import { Search } from "lucide-react"

import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { AddVehicleDialog } from "./add-vehicle-dialog"

const TYPE_FILTER_OPTIONS = {
  all: "All Types",
  Van: "Van",
  Truck: "Truck",
  Mini: "Mini",
}

const STATUS_FILTER_OPTIONS = {
  all: "All Statuses",
  Available: "Available",
  "On Trip": "On Trip",
  "In Shop": "In Shop",
  Retired: "Retired",
}

export function FilterBar() {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div className="flex flex-wrap items-end gap-3">
        <div className="flex flex-col gap-1">
          <span className="text-xs font-medium text-neutral-500">Type</span>
          <Select items={TYPE_FILTER_OPTIONS} defaultValue="all">
            <SelectTrigger className="w-36 border-white/10 bg-white/5 text-neutral-200">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(TYPE_FILTER_OPTIONS).map(([value, label]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-1">
          <span className="text-xs font-medium text-neutral-500">
            Status
          </span>
          <Select items={STATUS_FILTER_OPTIONS} defaultValue="all">
            <SelectTrigger className="w-40 border-white/10 bg-white/5 text-neutral-200">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(STATUS_FILTER_OPTIONS).map(([value, label]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="relative w-full max-w-56">
          <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-neutral-500" />
          <Input
            type="search"
            placeholder="Reg No..."
            className="border-white/10 bg-white/5 pl-8 text-neutral-200 placeholder:text-neutral-500 focus-visible:border-white/20"
          />
        </div>
      </div>

      <AddVehicleDialog />
    </div>
  )
}
