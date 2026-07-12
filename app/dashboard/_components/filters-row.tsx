import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const FILTERS = [
  {
    label: "Vehicle Type",
    defaultValue: "all",
    options: [
      { value: "all", label: "All Types" },
      { value: "van", label: "Van" },
      { value: "truck", label: "Truck" },
      { value: "mini", label: "Mini" },
    ],
  },
  {
    label: "Status",
    defaultValue: "all",
    options: [
      { value: "all", label: "All Statuses" },
      { value: "available", label: "Available" },
      { value: "on-trip", label: "On Trip" },
      { value: "in-shop", label: "In Shop" },
      { value: "retired", label: "Retired" },
    ],
  },
  {
    label: "Region",
    defaultValue: "all",
    options: [
      { value: "all", label: "All Regions" },
      { value: "north", label: "North" },
      { value: "south", label: "South" },
      { value: "east", label: "East" },
      { value: "west", label: "West" },
    ],
  },
] as const

export function FiltersRow() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      {FILTERS.map((filter) => (
        <div key={filter.label} className="flex flex-col gap-1">
          <span className="text-xs font-medium text-neutral-500">
            {filter.label}
          </span>
          <Select
            defaultValue={filter.defaultValue}
            items={Object.fromEntries(
              filter.options.map((o) => [o.value, o.label])
            )}
          >
            <SelectTrigger className="w-40 border-white/10 bg-white/5 text-neutral-200">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {filter.options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      ))}
    </div>
  )
}
