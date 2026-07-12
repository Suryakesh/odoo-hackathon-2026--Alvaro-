import { NextRequest, NextResponse } from "next/server"

import { getDrivers, createDriver } from "@/lib/odoo"
import type { DriverStatus } from "@/lib/odoo"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl
    const status = searchParams.get("status") as DriverStatus | null

    const drivers = await getDrivers(status ? { status } : undefined)
    return NextResponse.json(drivers)
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const id = await createDriver({
      name: body.name,
      licenseNumber: body.licenseNumber,
      licenseCategory: body.licenseCategory,
      licenseExpiry: body.licenseExpiry,
      contactNumber: body.contactNumber,
      status: body.status ?? "Available",
    })
    return NextResponse.json({ id }, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    )
  }
}
