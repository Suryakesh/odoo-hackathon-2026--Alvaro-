import { NextResponse } from "next/server"

import { getVehicles } from "@/lib/odoo"

export async function GET() {
  try {
    const vehicles = await getVehicles()
    return NextResponse.json(vehicles)
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    )
  }
}
