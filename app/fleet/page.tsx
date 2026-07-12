import type { Metadata } from "next"

import { Sidebar } from "@/components/layout/sidebar"
import { TopBar } from "@/components/layout/topbar"

import { FilterBar } from "./_components/filter-bar"
import { VehicleTable } from "./_components/vehicle-table"

export const metadata: Metadata = {
  title: "Fleet · TransitOps",
}

export default function FleetPage() {
  return (
    <div className="dark min-h-screen bg-[#030303] text-neutral-200">
      <Sidebar active="Fleet" />

      <div className="lg:pl-60">
        <TopBar searchPlaceholder="Search vehicles..." />

        <main className="flex flex-col gap-6 p-4 lg:p-6">
          <FilterBar />
          <VehicleTable />

          <p className="text-sm text-red-400/70">
            Registration No must be unique. Retired/In Shop vehicles are
            hidden from Trip Dispatcher.
          </p>
        </main>
      </div>
    </div>
  )
}
