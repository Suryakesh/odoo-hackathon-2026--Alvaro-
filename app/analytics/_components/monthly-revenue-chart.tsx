"use client"

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

import { MONTHLY_REVENUE } from "./analytics-data"

const INDIGO = "#818cf8"

function formatCompactInr(value: number) {
  if (value >= 100000) return `₹${(value / 100000).toFixed(1)}L`
  if (value >= 1000) return `₹${(value / 1000).toFixed(0)}k`
  return `₹${value}`
}

function ChartTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean
  payload?: { value: number }[]
  label?: string
}) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-lg border border-white/10 bg-[#0d0d0d] px-3 py-2 text-xs shadow-lg">
      <p className="font-medium text-white">{label}</p>
      <p className="text-neutral-400">
        Revenue: {formatCompactInr(payload[0].value)}
      </p>
    </div>
  )
}

export function MonthlyRevenueChart() {
  return (
    <Card className="border border-white/10 bg-white/[0.03] ring-0">
      <CardHeader>
        <CardTitle className="text-white">Monthly Revenue</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={MONTHLY_REVENUE}
              margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
            >
              <CartesianGrid
                vertical={false}
                stroke="rgba(255,255,255,0.08)"
              />
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#898781", fontSize: 12 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#898781", fontSize: 12 }}
                tickFormatter={formatCompactInr}
                width={48}
              />
              <Tooltip
                cursor={{ fill: "rgba(255,255,255,0.04)" }}
                content={<ChartTooltip />}
              />
              <Bar
                dataKey="revenue"
                fill={INDIGO}
                radius={[4, 4, 0, 0]}
                maxBarSize={36}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
