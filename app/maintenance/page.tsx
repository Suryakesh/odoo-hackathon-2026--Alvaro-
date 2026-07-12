"use client"

import { Sidebar } from "@/components/layout/sidebar"
import { TopBar } from "@/components/layout/topbar"

import { MaintenancePage } from "./_components/maintenance-page"

export default function Page() {
  return (
    <div className="dark min-h-screen bg-[#030303] text-neutral-200">
      <Sidebar active="Maintenance" />

      <div className="lg:pl-60">
        <TopBar searchPlaceholder="Search maintenance records..." />
        <main>
          <MaintenancePage />
        </main>
      </div>
    </div>
  )
}
