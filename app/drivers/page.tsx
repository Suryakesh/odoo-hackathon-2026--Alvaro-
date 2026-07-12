import type { Metadata } from "next"

import { Sidebar } from "@/components/layout/sidebar"
import { TopBar } from "@/components/layout/topbar"

import { ActionBar } from "./_components/action-bar"
import { DriversTable } from "./_components/drivers-table"
import { StatusLegend } from "./_components/status-legend"

export const metadata: Metadata = {
  title: "Drivers · TransitOps",
}

export default function DriversPage() {
  return (
    <div className="dark min-h-screen bg-[#030303] text-neutral-200">
      <Sidebar active="Drivers" />

      <div className="lg:pl-60">
        <TopBar searchPlaceholder="Search drivers..." />

        <main className="flex flex-col gap-6 p-4 lg:p-6">
          <ActionBar />
          <DriversTable />
          <StatusLegend />
        </main>
      </div>
    </div>
  )
}
