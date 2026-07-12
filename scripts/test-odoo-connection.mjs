/**
 * Final verification — fixes field names based on live Odoo responses.
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
    const msg = json.error.data?.message || json.error.message
    return { __error: msg }
  }
  return json.result
}

async function main() {
  console.log("🔌 Odoo API — Final Verification")
  console.log(`   URL: ${URL}  |  DB: ${DB}  |  UID: ${UID}\n`)

  // 1. Vehicles
  console.log("📦 Vehicles (fleet.vehicle):")
  const vehicles = await executeKw("fleet.vehicle", "search_read", [[]], {
    fields: ["id", "name", "license_plate", "x_studio_max_load_capacity", "x_studio_trip_status", "odometer", "car_value"],
    limit: 10,
  })
  if (vehicles.__error) { console.log(`   ❌ ${vehicles.__error}`) }
  else {
    console.log(`   ✅ ${vehicles.length} vehicle(s)`)
    for (const v of vehicles) console.log(`      [${v.id}] ${v.license_plate} | ${v.name} | cap:${v.x_studio_max_load_capacity}kg | status:${v.x_studio_trip_status || "—"}`)
  }

  // 2. Drivers (use phone instead of mobile)
  console.log("\n👤 Drivers (res.partner with license):")
  const drivers = await executeKw("res.partner", "search_read",
    [[["x_studio_license_number", "!=", false]]],
    { fields: ["id", "name", "phone", "x_studio_license_number", "x_studio_license_category", "x_studio_license_expiry_date", "x_studio_safety_score", "x_studio_driver_status"], limit: 10 }
  )
  if (drivers.__error) { console.log(`   ❌ ${drivers.__error}`) }
  else {
    console.log(`   ✅ ${drivers.length} driver(s)`)
    for (const d of drivers) console.log(`      [${d.id}] ${d.name} | license:${d.x_studio_license_number} | cat:${d.x_studio_license_category} | safety:${d.x_studio_safety_score} | status:${d.x_studio_driver_status || "—"}`)
  }

  // 3. Trips
  console.log("\n🚛 Trips (x_trip):")
  const trips = await executeKw("x_trip", "search_read", [[]], {
    fields: ["id", "x_name", "x_studio_source", "x_studio_destination", "x_studio_vehicle", "x_studio_driver", "x_studio_stage_id", "x_studio_cargo_weight", "x_studio_planned_distance", "x_studio_fuel_consumed"],
    limit: 10,
  })
  if (trips.__error) { console.log(`   ❌ ${trips.__error}`) }
  else {
    console.log(`   ✅ ${trips.length} trip(s)`)
    for (const t of trips) console.log(`      [${t.id}] ${t.x_name} | ${t.x_studio_source} → ${t.x_studio_destination} | vehicle:${t.x_studio_vehicle?.[1] || "—"} | driver:${t.x_studio_driver?.[1] || "—"} | stage:${t.x_studio_stage_id?.[1] || "—"} | cargo:${t.x_studio_cargo_weight}kg`)
  }

  // 4. Trip Stages
  console.log("\n📋 Stages (x_trip_stage):")
  const stages = await executeKw("x_trip_stage", "search_read", [[]], {
    fields: ["id", "x_name", "x_studio_sequence"],
  })
  if (stages.__error) { console.log(`   ❌ ${stages.__error}`) }
  else {
    console.log(`   ✅ ${stages.length} stage(s)`)
    for (const s of stages) console.log(`      [${s.id}] ${s.x_name} (seq: ${s.x_studio_sequence})`)
  }

  // 5. Maintenance — expect failure since module not deployed
  console.log("\n🔧 Maintenance (transit.maintenance):")
  const maint = await executeKw("transit.maintenance", "search_read", [[]], {
    fields: ["id", "name"], limit: 5,
  })
  if (maint.__error) { console.log(`   ⚠️  Not available yet (Shikha's module not deployed): ${maint.__error}`) }
  else { console.log(`   ✅ ${maint.length} record(s)`) }

  console.log("\n🏁 Done!")
}

main().catch(console.error)
