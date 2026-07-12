import type { Metadata } from "next"

import { Sidebar } from "@/components/layout/sidebar"
import { TopBar } from "@/components/layout/topbar"
import { FiltersRow } from "./_components/filters-row"
import { KpiCards } from "./_components/kpi-cards"
import { RecentTripsTable } from "./_components/recent-trips-table"
import { VehicleStatusChart } from "./_components/vehicle-status-chart"

export const metadata: Metadata = {
  title: "Dashboard · TransitOps",
}

export default function DashboardPage() {
  return (
    <div className="dark min-h-screen bg-[#030303] text-neutral-200">
      <Sidebar active="Dashboard" />

      <div className="lg:pl-60">
        <TopBar />

        <main className="flex flex-col gap-6 p-4 lg:p-6">
          <FiltersRow />
          <KpiCards />

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <RecentTripsTable />
            </div>
            <div className="lg:col-span-1">
              <VehicleStatusChart />
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
