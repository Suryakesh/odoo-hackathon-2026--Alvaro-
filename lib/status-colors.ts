export const STATUS_COLORS = {
  blue: { text: "#3987e5", badge: "bg-[#3987e5]/15 text-[#5c9eea]" },
  green: { text: "#0ca30c", badge: "bg-[#0ca30c]/15 text-[#3fbf3f]" },
  grey: { text: "#898781", badge: "bg-white/10 text-neutral-400" },
  red: { text: "#d03b3b", badge: "bg-[#d03b3b]/15 text-[#e5726f]" },
  amber: { text: "#fab219", badge: "bg-[#fab219]/15 text-[#f6c352]" },
} as const

export type StatusColor = keyof typeof STATUS_COLORS

export const TRIP_STATUS_COLOR: Record<string, StatusColor> = {
  Dispatched: "blue",
  Completed: "green",
  Draft: "grey",
  Cancelled: "red",
}

export const VEHICLE_STATUS_COLOR: Record<string, StatusColor> = {
  Available: "green",
  "On Trip": "blue",
  "In Shop": "amber",
  Retired: "red",
}
