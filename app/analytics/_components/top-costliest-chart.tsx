"use client"

import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

import { TOP_COSTLIEST_VEHICLES } from "./analytics-data"

const ROSE = "#fb7185"

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
        Cost: {formatCompactInr(payload[0].value)}
      </p>
    </div>
  )
}

export function TopCostliestChart() {
  return (
    <Card className="border border-white/10 bg-white/[0.03] ring-0">
      <CardHeader>
        <CardTitle className="text-white">Top Costliest Vehicles</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={TOP_COSTLIEST_VEHICLES}
              layout="vertical"
              margin={{ top: 8, right: 48, left: 0, bottom: 0 }}
            >
              <CartesianGrid
                horizontal={false}
                stroke="rgba(255,255,255,0.08)"
              />
              <XAxis
                type="number"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#898781", fontSize: 12 }}
                tickFormatter={formatCompactInr}
              />
              <YAxis
                type="category"
                dataKey="regNo"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#898781", fontSize: 12 }}
                width={96}
              />
              <Tooltip
                cursor={{ fill: "rgba(255,255,255,0.04)" }}
                content={<ChartTooltip />}
              />
              <Bar
                dataKey="cost"
                fill={ROSE}
                radius={[0, 4, 4, 0]}
                maxBarSize={28}
              >
                <LabelList
                  dataKey="cost"
                  position="right"
                  formatter={(value: string | number | boolean | null | undefined) =>
                    formatCompactInr(Number(value) || 0)
                  }
                  fill="#c3c2b7"
                  fontSize={12}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
