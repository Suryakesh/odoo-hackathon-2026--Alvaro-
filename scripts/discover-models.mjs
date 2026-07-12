/**
 * Model Discovery Script — Filters custom models in JS to avoid SQL wildcard issue.
 * Run: node --env-file=.env.local scripts/discover-models.mjs
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
  console.log("🔍 Scanning Odoo for newly created custom models...")
  
  // Fetch all models and filter in Javascript
  const allModels = await executeKw("ir.model", "search_read", [[]], { fields: ["model", "name"] })

  if (allModels.__error) {
    console.error("❌ Failed to search models:", allModels.__error)
    return
  }

  // Filter models that start with "x_" and are not our previous ones
  const customModels = allModels.filter(m => 
    m.model.startsWith("x_") && 
    !["x_trip", "x_trip_stage", "x_fuel_logs"].includes(m.model)
  )

  console.log(`✅ Found ${customModels.length} new custom model(s):\n`)

  for (const m of customModels) {
    console.log(`📦 Model: ${m.model} (${m.name})`)
    
    const fields = await executeKw("ir.model.fields", "search_read",
      [[["model_id.model", "=", m.model]]],
      { fields: ["name", "field_description", "ttype", "relation"] }
    )

    if (fields && !fields.__error) {
      console.log("   Fields:")
      for (const f of fields) {
        if (f.name.startsWith("x_") || f.name === "id") {
          const isCustom = f.name.startsWith("x_") ? "⭐️" : "  "
          const relationStr = f.relation ? ` → ${f.relation}` : ""
          console.log(`      ${isCustom} ${f.name.padEnd(30)} | Type: ${f.ttype.padEnd(10)}${relationStr} | Label: ${f.field_description}`)
        }
      }
    }
    console.log("\n" + "─".repeat(60) + "\n")
  }
}

main().catch(console.error)
