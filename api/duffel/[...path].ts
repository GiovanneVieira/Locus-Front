const DUFFEL_API_BASE_URL = "https://api.duffel.com"

interface VercelRequestLike {
  method?: string
  url?: string
  body?: unknown
  query?: Record<string, string | string[] | undefined>
}

interface VercelResponseLike {
  status: (statusCode: number) => VercelResponseLike
  setHeader: (name: string, value: string) => void
  send: (body: string) => void
  json: (body: unknown) => void
}

function getDuffelToken() {
  return process.env.DUFFEL_API_TOKEN || process.env.VITE_DUFFEL_API_TOKEN || ""
}

function getDuffelVersion() {
  return process.env.DUFFEL_VERSION || process.env.VITE_DUFFEL_VERSION || "v2"
}

export default async function handler(request: VercelRequestLike, response: VercelResponseLike) {
  const token = getDuffelToken()

  if (!token) {
    response.status(500).json({
      errors: [{ message: "Token da Duffel não configurado no ambiente da Vercel." }],
    })
    return
  }

  const incomingUrl = new URL(request.url ?? "/api/duffel", "https://locus.local")
  const pathQuery = request.query?.path
  const pathParts = Array.isArray(pathQuery) ? pathQuery : pathQuery ? [pathQuery] : []
  const duffelPath = pathParts.length > 0
    ? `/${pathParts.map(encodeURIComponent).join("/")}`
    : incomingUrl.pathname.replace(/^\/api\/duffel/, "")
  const duffelUrl = `${DUFFEL_API_BASE_URL}${duffelPath}${incomingUrl.search}`
  const method = request.method ?? "GET"
  const body = typeof request.body === "string" ? request.body : JSON.stringify(request.body ?? {})

  const duffelResponse = await fetch(duffelUrl, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      "Duffel-Version": getDuffelVersion(),
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: method === "GET" || method === "HEAD" ? undefined : body,
  })

  const responseBody = await duffelResponse.text()

  response.setHeader("Content-Type", duffelResponse.headers.get("Content-Type") || "application/json")
  response.status(duffelResponse.status).send(responseBody)
}
