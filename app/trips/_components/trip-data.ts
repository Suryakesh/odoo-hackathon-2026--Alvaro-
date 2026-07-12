export type TripStatus = "Draft" | "Dispatched" | "Completed" | "Cancelled"

export type Trip = {
  id: string
  vehicleRegNo: string
  driverName: string | null
  source: string
  destination: string
  status: TripStatus
  note: string
}

export const LIVE_TRIPS: Trip[] = [
  {
    id: "TRP-1042",
    vehicleRegNo: "GJ05CD5678",
    driverName: "Neha Sharma",
    source: "Ahmedabad",
    destination: "Surat",
    status: "Dispatched",
    note: "ETA 4:30 PM",
  },
  {
    id: "TRP-1041",
    vehicleRegNo: "GJ01AB1234",
    driverName: "Rohan Mehta",
    source: "Vadodara",
    destination: "Ahmedabad",
    status: "Completed",
    note: "Delivered 11:20 AM",
  },
  {
    id: "TRP-1040",
    vehicleRegNo: "GJ01GH3456",
    driverName: null,
    source: "Rajkot",
    destination: "Bhavnagar",
    status: "Draft",
    note: "Awaiting driver",
  },
  {
    id: "TRP-1039",
    vehicleRegNo: "RJ14IJ7890",
    driverName: "Karan Verma",
    source: "Surat",
    destination: "Mumbai",
    status: "Cancelled",
    note: "Vehicle retired mid-route",
  },
]
