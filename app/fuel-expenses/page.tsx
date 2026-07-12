"use client"

import { useCallback, useEffect, useState } from "react"

import { Sidebar } from "@/components/layout/sidebar"
import { TopBar } from "@/components/layout/topbar"
import type { OtherExpense } from "@/lib/odoo"

import { ActionBar } from "./_components/action-bar"
import { FuelLogsTable } from "./_components/fuel-logs-table"
import { OtherExpensesTable } from "./_components/other-expenses-table"
import { SummaryBar } from "./_components/summary-bar"

export default function FuelExpensesPage() {
  const [expenses, setExpenses] = useState<OtherExpense[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchExpenses = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/expenses")
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error ?? `Request failed (${res.status})`)
      }
      const data: OtherExpense[] = await res.json()
      setExpenses(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load expenses")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchExpenses()
  }, [fetchExpenses])

  const expensesTotal = expenses.reduce(
    (sum, e) => sum + e.toll + e.other,
    0
  )

  return (
    <div className="dark min-h-screen bg-[#030303] text-neutral-200">
      <Sidebar active="Fuel & Expenses" />

      <div className="lg:pl-60">
        <TopBar searchPlaceholder="Search fuel logs, expenses..." />

        <main className="flex flex-col gap-6 p-4 lg:p-6">
          <ActionBar onExpenseCreated={fetchExpenses} />
          <FuelLogsTable />
          <OtherExpensesTable
            expenses={expenses}
            loading={loading}
            error={error}
          />
          <SummaryBar expensesTotal={expensesTotal} />
        </main>
      </div>
    </div>
  )
}
