import type { Metadata } from "next"

import { Sidebar } from "@/components/layout/sidebar"
import { TopBar } from "@/components/layout/topbar"

import { ExportCsvButton } from "./_components/export-csv-button"
import { KpiCards } from "./_components/kpi-cards"
import { MonthlyRevenueChart } from "./_components/monthly-revenue-chart"
import { TopCostliestChart } from "./_components/top-costliest-chart"

export const metadata: Metadata = {
  title: "Analytics · TransitOps",
}

export default function AnalyticsPage() {
  return (
    <div className="dark min-h-screen bg-[#030303] text-neutral-200">
      <Sidebar active="Analytics" />

      <div className="lg:pl-60">
        <TopBar searchPlaceholder="Search reports..." />

        <main className="flex flex-col gap-6 p-4 lg:p-6">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold text-white">
              Reports & Analytics
            </h1>
            <ExportCsvButton />
          </div>

          <KpiCards />

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <MonthlyRevenueChart />
            <TopCostliestChart />
          </div>
        </main>
      </div>
    </div>
  )
}
