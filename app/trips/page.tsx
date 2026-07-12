import type { Metadata } from "next"

import { Sidebar } from "@/components/layout/sidebar"
import { TopBar } from "@/components/layout/topbar"

import { CreateTripForm } from "./_components/create-trip-form"
import { LiveBoard } from "./_components/live-board"

export const metadata: Metadata = {
  title: "Trips · TransitOps",
}

export default function TripsPage() {
  return (
    <div className="dark min-h-screen bg-[#030303] text-neutral-200">
      <Sidebar active="Trips" />

      <div className="lg:pl-60">
        <TopBar searchPlaceholder="Search trips..." />

        <main className="grid grid-cols-1 gap-6 p-4 lg:grid-cols-2 lg:p-6">
          <CreateTripForm />
          <LiveBoard />
        </main>
      </div>
    </div>
  )
}
