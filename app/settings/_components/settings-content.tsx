"use client"

import { useEffect, useState } from "react"
import { Check } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const MODULES = [
  "Fleet",
  "Driver",
  "Trip",
  "Fuel/Expenses",
  "Analytics",
] as const

const ROLE_PERMISSIONS = [
  {
    role: "Fleet Manager",
    permissions: {
      Fleet: true,
      Driver: true,
      Trip: false,
      "Fuel/Expenses": false,
      Analytics: false,
    },
  },
  {
    role: "Dispatcher",
    permissions: {
      Fleet: false,
      Driver: false,
      Trip: true,
      "Fuel/Expenses": false,
      Analytics: false,
    },
  },
  {
    role: "Safety Officer",
    permissions: {
      Fleet: false,
      Driver: true,
      Trip: false,
      "Fuel/Expenses": false,
      Analytics: false,
    },
  },
  {
    role: "Financial Analyst",
    permissions: {
      Fleet: false,
      Driver: false,
      Trip: false,
      "Fuel/Expenses": true,
      Analytics: true,
    },
  },
] as const

export function SettingsContent() {
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (!saved) return

    const timeout = window.setTimeout(() => setSaved(false), 3000)
    return () => window.clearTimeout(timeout)
  }, [saved])

  return (
    <div className="flex flex-col gap-6">
      <Card className="border border-white/10 bg-white/[0.03] ring-0">
        <CardHeader>
          <CardTitle className="text-white">General</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="company-name"
                className="text-xs font-medium text-neutral-500"
              >
                Company Name
              </label>
              <Input
                id="company-name"
                readOnly
                value="TransitOps"
                className="border-white/10 bg-white/5 text-neutral-200"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <span className="text-xs font-medium text-neutral-500">
                Currency
              </span>
              <Select defaultValue="inr" items={{ inr: "INR" }}>
                <SelectTrigger className="w-full border-white/10 bg-white/5 text-neutral-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="inr">INR</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border border-white/10 bg-white/[0.03] ring-0">
        <CardHeader>
          <CardTitle className="text-white">
            Role-Based Access Control (RBAC)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-white/10 hover:bg-transparent">
                  <TableHead className="min-w-44 text-neutral-500">
                    Role
                  </TableHead>
                  {MODULES.map((module) => (
                    <TableHead
                      key={module}
                      className="min-w-32 text-center text-neutral-500"
                    >
                      {module}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {ROLE_PERMISSIONS.map((role) => (
                  <TableRow
                    key={role.role}
                    className="border-white/10 hover:bg-white/[0.03]"
                  >
                    <TableCell className="font-medium text-neutral-200">
                      {role.role}
                    </TableCell>
                    {MODULES.map((module) => {
                      const hasAccess = role.permissions[module]

                      return (
                        <TableCell key={module} className="text-center">
                          {hasAccess ? (
                            <Check
                              className="mx-auto size-4 text-[#3fbf3f]"
                              aria-label="Has access"
                            />
                          ) : (
                            <span
                              className="text-neutral-600"
                              aria-label="No access"
                            >
                              –
                            </span>
                          )}
                        </TableCell>
                      )
                    })}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
        <Button onClick={() => setSaved(true)}>Save Changes</Button>
        {saved ? (
          <p className="text-sm font-medium text-[#3fbf3f]">
            Settings saved successfully.
          </p>
        ) : null}
      </div>
    </div>
  )
}
