/**
 * Live Odoo API Verification — queries custom Fuel Logs, custom Other Expenses, and custom Maintenance.
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

  // 1. Query custom Fuel Logs
  console.log("⛽️ Querying custom Fuel Logs (x_fuel_logs)...")
  const fuelLogs = await executeKw("x_fuel_logs", "search_read", [[]], {
    fields: ["id", "x_name", "x_studio_vehicle", "x_studio_liters", "x_studio_cost", "x_studio_date"]
  })

  if (fuelLogs.__error) {
    console.error("   ❌ Failed to query Fuel Logs:", fuelLogs.__error)
  } else {
    console.log(`   ✅ Found ${fuelLogs.length} fuel log(s):`)
    for (const log of fuelLogs) {
      const vehicle = log.x_studio_vehicle ? log.x_studio_vehicle[1] : "No Vehicle"
      console.log(`      - ID: ${log.id} | Desc: "${log.x_name}" | Vehicle: "${vehicle}" | Liters: ${log.x_studio_liters}L | Cost: ₹${log.x_studio_cost} | Date: ${log.x_studio_date || "—"}`)
    }
  }
  console.log("\n" + "─".repeat(50) + "\n")

  // 2. Query custom Other Expenses
  console.log("💵 Querying custom Other Expenses (x_other_expenses)...")
  const expenses = await executeKw("x_other_expenses", "search_read", [[]], {
    fields: ["id", "x_name", "x_studio_trip", "x_studio_vehicle", "x_studio_value", "x_studio_other", "x_studio_status"]
  })

  if (expenses.__error) {
    console.error("   ❌ Failed to query Other Expenses:", expenses.__error)
  } else {
    console.log(`   ✅ Found ${expenses.length} expense log(s):`)
    for (const exp of expenses) {
      const trip = exp.x_studio_trip ? exp.x_studio_trip[1] : "No Trip"
      const vehicle = exp.x_studio_vehicle ? exp.x_studio_vehicle[1] : "No Vehicle"
      console.log(`      - ID: ${exp.id} | Desc: "${exp.x_name}" | Trip: "${trip}" | Vehicle: "${vehicle}" | Toll: ₹${exp.x_studio_value} | Other: ₹${exp.x_studio_other} | Status: ${exp.x_studio_status}`)
    }
  }
  console.log("\n" + "─".repeat(50) + "\n")

  // 3. Query custom Maintenance Records
  console.log("🔧 Querying custom Maintenance Records (x_maintenance_records)...")
  const maintenance = await executeKw("x_maintenance_records", "search_read", [[]], {
    fields: ["id", "x_name", "x_studio_vehicle", "x_studio_type", "x_studio_value", "x_studio_status", "x_studio_date", "x_studio_description"]
  })

  if (maintenance.__error) {
    console.error("   ❌ Failed to query Maintenance:", maintenance.__error)
  } else {
    console.log(`   ✅ Found ${maintenance.length} maintenance record(s):`)
    for (const maint of maintenance) {
      const vehicle = maint.x_studio_vehicle ? maint.x_studio_vehicle[1] : "No Vehicle"
      console.log(`      - ID: ${maint.id} | Ref: "${maint.x_name}" | Vehicle: "${vehicle}" | Type: ${maint.x_studio_type} | Cost: ₹${maint.x_studio_value} | Status: ${maint.x_studio_status} | Date: ${maint.x_studio_date} | Desc: "${maint.x_studio_description || ""}"`)
    }
  }

  console.log("\n🏁 Verification complete!")
}

main().catch(console.error)
