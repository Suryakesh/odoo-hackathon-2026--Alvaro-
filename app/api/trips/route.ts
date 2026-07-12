import { NextResponse } from "next/server"

import { getTrips } from "@/lib/odoo"

export async function GET() {
  try {
    const trips = await getTrips()
    return NextResponse.json(trips)
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    )
  }
}
