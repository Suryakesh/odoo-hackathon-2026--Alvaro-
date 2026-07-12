/**
 * Model Discovery Script — searches for newly created custom models (e.g. Fuel Logs)
 * and lists their technical fields.
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
  console.log("🔍 Scanning Odoo for custom models...")
  
  // Search for models containing "fuel" or "expense"
  const models = await executeKw("ir.model", "search_read", 
    [[
      "model", "like", "x_"
    ]], 
    { fields: ["model", "name"] }
  )

  if (models.__error) {
    console.error("❌ Failed to search models:", models.__error)
    return
  }

  console.log(`✅ Found ${models.length} custom model(s) in Odoo:\n`)

  for (const m of models) {
    console.log(`📦 Model: ${m.model} (${m.name})`)
    
    // Get fields for this model
    const fields = await executeKw("ir.model.fields", "search_read",
      [[["model_id.model", "=", m.model]]],
      { fields: ["name", "field_description", "ttype", "relation"] }
    )

    if (fields && !fields.__error) {
      console.log("   Fields:")
      for (const f of fields) {
        // Highlight custom studio fields or important relational ones
        const isCustom = f.name.startsWith("x_") ? "⭐️" : "  "
        const relationStr = f.relation ? ` → ${f.relation}` : ""
        console.log(`      ${isCustom} ${f.name.padEnd(30)} | Type: ${f.ttype.padEnd(10)}${relationStr} | Label: ${f.field_description}`)
      }
    }
    console.log("\n" + "─".repeat(60) + "\n")
  }
}

main().catch(console.error)
