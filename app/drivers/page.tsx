"use client"

import { useCallback, useEffect, useState } from "react"

import { Sidebar } from "@/components/layout/sidebar"
import { TopBar } from "@/components/layout/topbar"
import type { Driver } from "@/lib/odoo"

import { ActionBar } from "./_components/action-bar"
import { DriversTable } from "./_components/drivers-table"
import { StatusLegend } from "./_components/status-legend"

export default function DriversPage() {
  const [drivers, setDrivers] = useState<Driver[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchDrivers = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/drivers")
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error ?? `Request failed (${res.status})`)
      }
      const data: Driver[] = await res.json()
      setDrivers(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load drivers")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchDrivers()
  }, [fetchDrivers])

  return (
    <div className="dark min-h-screen bg-[#030303] text-neutral-200">
      <Sidebar active="Drivers" />

      <div className="lg:pl-60">
        <TopBar searchPlaceholder="Search drivers..." />

        <main className="flex flex-col gap-6 p-4 lg:p-6">
          <ActionBar onDriverCreated={fetchDrivers} />
          <DriversTable drivers={drivers} loading={loading} error={error} />
          <StatusLegend />
        </main>
      </div>
    </div>
  )
}
