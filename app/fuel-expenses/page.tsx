import type { Metadata } from "next"

import { Sidebar } from "@/components/layout/sidebar"
import { TopBar } from "@/components/layout/topbar"

import { ActionBar } from "./_components/action-bar"
import { FuelLogsTable } from "./_components/fuel-logs-table"
import { OtherExpensesTable } from "./_components/other-expenses-table"
import { SummaryBar } from "./_components/summary-bar"

export const metadata: Metadata = {
  title: "Fuel & Expenses · TransitOps",
}

export default function FuelExpensesPage() {
  return (
    <div className="dark min-h-screen bg-[#030303] text-neutral-200">
      <Sidebar active="Fuel & Expenses" />

      <div className="lg:pl-60">
        <TopBar searchPlaceholder="Search fuel logs, expenses..." />

        <main className="flex flex-col gap-6 p-4 lg:p-6">
          <ActionBar />
          <FuelLogsTable />
          <OtherExpensesTable />
          <SummaryBar />
        </main>
      </div>
    </div>
  )
}
