export type LicenseCategory = "LMV" | "HMV" | "MCWG"
export type DriverStatus = "Available" | "On Trip" | "Off Duty" | "Suspended"

export type Driver = {
  name: string
  licenseNumber: string
  licenseCategory: LicenseCategory
  licenseExpiry: string
  contactNumber: string
  tripCount: number
  safetyScore: number
  status: DriverStatus
}

export const DRIVERS: Driver[] = [
  {
    name: "Rohan Mehta",
    licenseNumber: "GJ0120230012345",
    licenseCategory: "LMV",
    licenseExpiry: "2027-03-15",
    contactNumber: "+91 98250 12345",
    tripCount: 142,
    safetyScore: 92,
    status: "Available",
  },
  {
    name: "Vikram Singh",
    licenseNumber: "MH1220220098765",
    licenseCategory: "HMV",
    licenseExpiry: "2025-11-20",
    contactNumber: "+91 90040 55678",
    tripCount: 88,
    safetyScore: 76,
    status: "Off Duty",
  },
  {
    name: "Neha Sharma",
    licenseNumber: "RJ1420210034521",
    licenseCategory: "LMV",
    licenseExpiry: "2028-06-01",
    contactNumber: "+91 99120 33445",
    tripCount: 205,
    safetyScore: 88,
    status: "On Trip",
  },
  {
    name: "Karan Verma",
    licenseNumber: "GJ0620190076543",
    licenseCategory: "HMV",
    licenseExpiry: "2026-09-30",
    contactNumber: "+91 98980 11223",
    tripCount: 51,
    safetyScore: 64,
    status: "Suspended",
  },
  {
    name: "Priya Nair",
    licenseNumber: "KA0920240012987",
    licenseCategory: "MCWG",
    licenseExpiry: "2029-02-14",
    contactNumber: "+91 97410 66778",
    tripCount: 173,
    safetyScore: 95,
    status: "Available",
  },
]

export function isLicenseExpired(licenseExpiry: string) {
  return new Date(licenseExpiry) < new Date()
}

export function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })
}
