/**
 * Final verification — verifies that the new custom Fuel Logs model (x_fuel_logs) works.
 * Run: node --env-file=.env.local scripts/test-odoo-connection.mjs
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
  console.log("🔌 Odoo API — Custom Models Verification")
  console.log(`   URL: ${URL}  |  DB: ${DB}\n`)

  // Query the newly created x_fuel_logs model!
  console.log("⛽️ Querying custom Fuel Logs (x_fuel_logs)...")
  const fuelLogs = await executeKw("x_fuel_logs", "search_read", [[]], {
    fields: [
      "id",
      "x_name",
      "x_studio_vehicle",
      "x_studio_liters",
      "x_studio_cost",
      "x_studio_value",
      "x_studio_date"
    ]
  })

  if (fuelLogs.__error) {
    console.error("   ❌ Failed to query Fuel Logs:", fuelLogs.__error)
  } else {
    console.log(`   ✅ Found ${fuelLogs.length} fuel log(s):`)
    for (const log of fuelLogs) {
      const vehicle = log.x_studio_vehicle ? log.x_studio_vehicle[1] : "No Vehicle"
      const cost = log.x_studio_cost || log.x_studio_value || 0
      console.log(`      - ID: ${log.id} | Desc: "${log.x_name}" | Vehicle: "${vehicle}" | Liters: ${log.x_studio_liters}L | Cost: ₹${cost} | Date: ${log.x_studio_date || "—"}`)
    }
  }

  console.log("\n🏁 Verification complete!")
}

main().catch(console.error)
