/**
 * Odoo JSON-RPC Client for TransitOps
 *
 * Communicates with Odoo via JSON-RPC 2.0 over HTTP.
 * Uses the /jsonrpc endpoint with execute_kw (works with Odoo Online SaaS).
 *
 * Authentication: API key is used in place of password in execute_kw calls.
 * The UID is resolved once on first call and cached.
 *
 * API credentials are read from environment variables:
 *   ODOO_URL       — e.g. "https://alvaro33.odoo.com"
 *   ODOO_DB        — e.g. "alvaro33"
 *   ODOO_API_KEY   — generated from Profile → Account Security → API Keys
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type OdooConfig = {
  /** Base URL of the Odoo instance, e.g. "https://alvaro33.odoo.com" */
  url: string
  /** Database name, e.g. "alvaro33" */
  db: string
  /** API key (used as password in execute_kw calls) */
  apiKey: string
}

type JsonRpcResponse<T = unknown> = {
  jsonrpc: "2.0"
  id: number
  result?: T
  error?: {
    code: number
    message: string
    data: {
      name: string
      debug: string
      message: string
      arguments: string[]
    }
  }
}

export type SearchReadParams = {
  model: string
  /** Odoo domain filter, e.g. [["status", "=", "active"]] */
  domain?: unknown[][]
  /** Fields to return. Empty = all. */
  fields?: string[]
  /** Max records */
  limit?: number
  /** Offset for pagination */
  offset?: number
  /** Sort order, e.g. "create_date desc" */
  order?: string
}

export class OdooError extends Error {
  code: number
  debug: string

  constructor(code: number, message: string, debug: string) {
    super(message)
    this.name = "OdooError"
    this.code = code
    this.debug = debug
  }
}

// ---------------------------------------------------------------------------
// Configuration from env vars
// ---------------------------------------------------------------------------

function getConfig(): OdooConfig {
  const url = process.env.ODOO_URL
  const db = process.env.ODOO_DB
  const apiKey = process.env.ODOO_API_KEY

  if (!url) throw new Error("Missing env var ODOO_URL")
  if (!db) throw new Error("Missing env var ODOO_DB")
  if (!apiKey) throw new Error("Missing env var ODOO_API_KEY")

  return { url, db, apiKey }
}

// ---------------------------------------------------------------------------
// UID resolution (cached)
// ---------------------------------------------------------------------------

let _uid: number | null = null

/**
 * Resolve the UID for the API key holder.
 * Calls /jsonrpc with service=common, method=authenticate.
 * Falls back to UID=2 (default admin) if authenticate returns false.
 */
async function getUid(): Promise<number> {
  if (_uid !== null) return _uid

  const config = getConfig()

  const res = await fetch(`${config.url}/jsonrpc`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: 0,
      method: "call",
      params: {
        service: "common",
        method: "authenticate",
        args: [config.db, "__api_key__", config.apiKey, {}],
      },
    }),
  })

  const json = (await res.json()) as JsonRpcResponse<number | false>

  if (json.error) {
    throw new OdooError(
      json.error.code,
      json.error.data?.message ?? json.error.message,
      json.error.data?.debug ?? ""
    )
  }

  // Some Odoo versions return false for __api_key__ user but the key still
  // works with UID=2 (admin). Fall back gracefully.
  _uid = json.result && json.result !== 0 ? json.result : 2
  return _uid
}

// ---------------------------------------------------------------------------
// Low-level execute_kw via /jsonrpc
// ---------------------------------------------------------------------------

let _requestId = 0

/**
 * Call execute_kw on a model. This is the core transport for all ORM operations.
 * Uses /jsonrpc endpoint (works with Odoo Online / SaaS).
 */
async function executeKw<T = unknown>(
  model: string,
  method: string,
  args: unknown[] = [],
  kwargs: Record<string, unknown> = {}
): Promise<T> {
  const config = getConfig()
  const uid = await getUid()

  const res = await fetch(`${config.url}/jsonrpc`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: ++_requestId,
      method: "call",
      params: {
        service: "object",
        method: "execute_kw",
        args: [config.db, uid, config.apiKey, model, method, args, kwargs],
      },
    }),
    cache: "no-store",
  })

  const json = (await res.json()) as JsonRpcResponse<T>

  if (json.error) {
    throw new OdooError(
      json.error.code,
      json.error.data?.message ?? json.error.message,
      json.error.data?.debug ?? ""
    )
  }

  return json.result as T
}

// ---------------------------------------------------------------------------
// ORM helpers (public API)
// ---------------------------------------------------------------------------

/**
 * search_read — the workhorse for fetching records.
 * Returns an array of record objects.
 */
export async function searchRead<T = Record<string, unknown>>(
  params: SearchReadParams
): Promise<T[]> {
  const { model, domain = [], fields = [], limit, offset, order } = params

  const kwargs: Record<string, unknown> = {}
  if (fields.length) kwargs.fields = fields
  if (limit !== undefined) kwargs.limit = limit
  if (offset !== undefined) kwargs.offset = offset
  if (order !== undefined) kwargs.order = order

  return executeKw<T[]>(model, "search_read", [domain], kwargs)
}

/**
 * search_count — returns the total count matching a domain.
 */
export async function searchCount(
  model: string,
  domain: unknown[][] = []
): Promise<number> {
  return executeKw<number>(model, "search_count", [domain])
}

/**
 * read — fetch specific records by ID.
 */
export async function read<T = Record<string, unknown>>(
  model: string,
  ids: number[],
  fields?: string[]
): Promise<T[]> {
  const kwargs: Record<string, unknown> = {}
  if (fields) kwargs.fields = fields
  return executeKw<T[]>(model, "read", [ids], kwargs)
}

/**
 * create — create one or more records. Returns array of new IDs.
 */
export async function create(
  model: string,
  values: Record<string, unknown> | Record<string, unknown>[]
): Promise<number[]> {
  const vals = Array.isArray(values) ? values : [values]
  const ids: number[] = []

  for (const v of vals) {
    const id = await executeKw<number>(model, "create", [v])
    ids.push(id)
  }

  return ids
}

/**
 * write — update existing records.
 */
export async function write(
  model: string,
  ids: number[],
  values: Record<string, unknown>
): Promise<boolean> {
  return executeKw<boolean>(model, "write", [ids, values])
}

/**
 * unlink — delete records.
 */
export async function unlink(
  model: string,
  ids: number[]
): Promise<boolean> {
  return executeKw<boolean>(model, "unlink", [ids])
}

/**
 * callMethod — invoke any arbitrary method on a model.
 * Useful for custom server actions / business logic.
 */
export async function callMethod<T = unknown>(
  model: string,
  method: string,
  args: unknown[] = [],
  kwargs: Record<string, unknown> = {}
): Promise<T> {
  return executeKw<T>(model, method, args, kwargs)
}

/**
 * authenticate — verify credentials and return the UID.
 * Mostly useful for testing connectivity.
 */
export async function authenticate(): Promise<number> {
  return getUid()
}
