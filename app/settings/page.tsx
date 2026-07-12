import type { Metadata } from "next"

import { Sidebar } from "@/components/layout/sidebar"
import { TopBar } from "@/components/layout/topbar"

import { SettingsContent } from "./_components/settings-content"

export const metadata: Metadata = {
  title: "Settings · TransitOps",
}

export default function SettingsPage() {
  return (
    <div className="dark min-h-screen bg-[#030303] text-neutral-200">
      <Sidebar active="Settings" />

      <div className="lg:pl-60">
        <TopBar searchPlaceholder="Search settings..." />

        <main className="flex flex-col gap-6 p-4 lg:p-6">
          <div>
            <h1 className="text-xl font-semibold text-white">Settings</h1>
            <p className="mt-1 text-sm text-neutral-500">
              Manage organization defaults and access permissions.
            </p>
          </div>

          <SettingsContent />
        </main>
      </div>
    </div>
  )
}
