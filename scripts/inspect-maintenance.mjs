/**
 * Inspect built-in Maintenance Request model fields
 * Run: node --env-file=.env.local scripts/inspect-maintenance.mjs
 */

const URL = process.env.ODOO_URL
const DB = process.env.ODOO_DB
const API_KEY = process.env.ODOO_API_KEY
const UID = 2

async function executeKw(model, method, domain = [[]], kwargs = {}) {
  const res = await fetch(`${URL}/jsonrpc`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      jsonrpc: "2.0", id: 1, method: "call",
      params: {
        service: "object",
        method: "execute_kw",
        args: [DB, UID, API_KEY, model, method, domain, kwargs],
      },
    }),
  })
  const json = await res.json()
  if (json.error) {
    return { __error: json.error.data?.message || json.error.message }
  }
  return json.result
}

async function main() {
  console.log("🔍 Inspecting built-in maintenance.request model...")
  
  const fields = await executeKw("ir.model.fields", "search_read",
    [[["model_id.model", "=", "maintenance.request"]]],
    { fields: ["name", "field_description", "ttype", "relation"] }
  )

  if (fields.__error) {
    console.error("❌ Failed to fetch fields:", fields.__error)
    return
  }

  console.log("📋 Fields on maintenance.request:")
  for (const f of fields) {
    // Focus on fields related to vehicle, cost, description, type, status, stages
    const isImportant = [
      "name", "vehicle_id", "equipment_id", "maintenance_type", 
      "request_date", "close_date", "stage_id", "description", "cost"
    ].includes(f.name) || f.name.startsWith("x_")

    const prefix = isImportant ? "⭐️" : "  "
    const relationStr = f.relation ? ` → ${f.relation}` : ""
    console.log(`   ${prefix} ${f.name.padEnd(25)} | Type: ${f.ttype.padEnd(10)}${relationStr} | Label: ${f.field_description}`)
  }
}

main().catch(console.error)
