import { NextRequest, NextResponse } from "next/server"

import { getMaintenanceRecords, createMaintenance } from "@/lib/odoo"

export async function GET() {
  try {
    const records = await getMaintenanceRecords()
    return NextResponse.json(records)
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
    const id = await createMaintenance({
      name: body.name ?? `MAINT-NEW`,
      vehicleId: Number(body.vehicleId),
      maintenanceType: body.maintenanceType,
      date: body.date,
      cost: Number(body.cost) || 0,
      description: body.description ?? "",
    })
    return NextResponse.json({ id }, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    )
  }
}
