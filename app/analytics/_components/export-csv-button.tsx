"use client"

import { Download } from "lucide-react"

import { Button } from "@/components/ui/button"

import { downloadAnalyticsCsv } from "./analytics-data"

export function ExportCsvButton() {
  return (
    <Button
      variant="outline"
      className="gap-1.5"
      onClick={downloadAnalyticsCsv}
    >
      <Download className="size-4" />
      Export CSV
    </Button>
  )
}
