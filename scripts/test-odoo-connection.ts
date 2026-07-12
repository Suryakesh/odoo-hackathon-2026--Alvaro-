/**
 * Quick smoke test — verifies Odoo API connection works.
 * Run with: npx tsx scripts/test-odoo-connection.ts
 */

// Load .env.local
import { config } from "dotenv"
config({ path: ".env.local" })

async function jsonRpc(endpoint: string, params: Record<string, unknown>) {
  const url = process.env.ODOO_URL!
  const apiKey = process.env.ODOO_API_KEY!

  const res = await fetch(`${url}${endpoint}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: 1,
      method: "call",
      params,
    }),
  })

  const json = await res.json()
  if (json.error) {
    console.error("❌ Odoo Error:", json.error.data?.message || json.error.message)
    console.error("   Debug:", json.error.data?.debug?.slice(0, 200))
    return null
  }
  return json.result
}

async function main() {
  console.log("🔌 Testing Odoo connection...")
  console.log(`   URL: ${process.env.ODOO_URL}`)
  console.log(`   DB:  ${process.env.ODOO_DB}`)
  console.log(`   Key: ${process.env.ODOO_API_KEY?.slice(0, 8)}...`)
  console.log()

  // Test 1: Fetch vehicles
  console.log("📦 Test 1: Fetching vehicles (fleet.vehicle)...")
  const vehicles = await jsonRpc("/web/dataset/call_kw", {
    model: "fleet.vehicle",
    method: "search_read",
    args: [],
    kwargs: {
      domain: [],
      fields: ["id", "name", "license_plate", "x_studio_max_load_capacity", "x_studio_trip_status"],
      limit: 5,
    },
  })
  if (vehicles) {
    console.log(`   ✅ Found ${vehicles.length} vehicle(s):`)
    vehicles.forEach((v: any) =>
      console.log(`      - ${v.license_plate || "no plate"} | ${v.name} | capacity: ${v.x_studio_max_load_capacity} | status: ${v.x_studio_trip_status}`)
    )
  }
  console.log()

  // Test 2: Fetch drivers (res.partner with license number)
  console.log("👤 Test 2: Fetching drivers (res.partner with license)...")
  const drivers = await jsonRpc("/web/dataset/call_kw", {
    model: "res.partner",
    method: "search_read",
    args: [],
    kwargs: {
      domain: [["x_studio_license_number", "!=", false]],
      fields: ["id", "name", "x_studio_license_number", "x_studio_driver_status", "x_studio_safety_score"],
      limit: 5,
    },
  })
  if (drivers) {
    console.log(`   ✅ Found ${drivers.length} driver(s):`)
    drivers.forEach((d: any) =>
      console.log(`      - ${d.name} | license: ${d.x_studio_license_number} | status: ${d.x_studio_driver_status} | safety: ${d.x_studio_safety_score}`)
    )
  }
  console.log()

  // Test 3: Fetch trips (x_trip)
  console.log("🚛 Test 3: Fetching trips (x_trip)...")
  const trips = await jsonRpc("/web/dataset/call_kw", {
    model: "x_trip",
    method: "search_read",
    args: [],
    kwargs: {
      domain: [],
      fields: ["id", "x_name", "x_studio_source", "x_studio_destination", "x_studio_vehicle", "x_studio_driver", "x_studio_stage_id", "x_studio_cargo_weight"],
      limit: 5,
    },
  })
  if (trips) {
    console.log(`   ✅ Found ${trips.length} trip(s):`)
    trips.forEach((t: any) =>
      console.log(`      - ${t.x_name} | ${t.x_studio_source} → ${t.x_studio_destination} | vehicle: ${t.x_studio_vehicle?.[1] || "none"} | driver: ${t.x_studio_driver?.[1] || "none"} | stage: ${t.x_studio_stage_id?.[1] || "none"}`)
    )
  }
  console.log()

  // Test 4: Trip stages
  console.log("📋 Test 4: Fetching trip stages (x_trip_stage)...")
  const stages = await jsonRpc("/web/dataset/call_kw", {
    model: "x_trip_stage",
    method: "search_read",
    args: [],
    kwargs: {
      domain: [],
      fields: ["id", "x_name", "x_studio_sequence"],
    },
  })
  if (stages) {
    console.log(`   ✅ Found ${stages.length} stage(s):`)
    stages.forEach((s: any) =>
      console.log(`      - [${s.id}] ${s.x_name} (seq: ${s.x_studio_sequence})`)
    )
  }
  console.log()

  console.log("🏁 Done! If you see ✅ above, the API key works.")
}

main().catch(console.error)
