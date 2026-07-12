import type { Metadata } from "next"

import { Sidebar } from "@/components/layout/sidebar"
import { TopBar } from "@/components/layout/topbar"
import { DashboardContent } from "./_components/dashboard-content"
import { FiltersRow } from "./_components/filters-row"

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
          <DashboardContent />
        </main>
      </div>
    </div>
  )
}
