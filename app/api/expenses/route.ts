import { NextRequest, NextResponse } from "next/server"

import { getOtherExpenses, createOtherExpense } from "@/lib/odoo"

export async function GET() {
  try {
    const expenses = await getOtherExpenses()
    return NextResponse.json(expenses)
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
    const id = await createOtherExpense({
      description: body.description ?? "Expense",
      tripId: body.tripId,
      vehicleId: body.vehicleId,
      toll: body.toll ?? 0,
      other: body.other ?? 0,
      status: body.status ?? "Pending",
    })
    return NextResponse.json({ id }, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    )
  }
}
