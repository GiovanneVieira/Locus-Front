const DUFFEL_API_BASE_URL = "https://api.duffel.com"

function getDuffelToken() {
  return process.env.DUFFEL_API_TOKEN || process.env.VITE_DUFFEL_API_TOKEN || ""
}

function getDuffelVersion() {
  return process.env.DUFFEL_VERSION || process.env.VITE_DUFFEL_VERSION || "v2"
}

export default async function handler(request: Request): Promise<Response> {
  const token = getDuffelToken()

  if (!token) {
    return Response.json(
      { errors: [{ message: "Token da Duffel não configurado no ambiente da Vercel." }] },
      { status: 500 },
    )
  }

  const incomingUrl = new URL(request.url)
  const duffelPath = incomingUrl.pathname.replace(/^\/api\/duffel/, "")
  const duffelUrl = `${DUFFEL_API_BASE_URL}${duffelPath}${incomingUrl.search}`

  const response = await fetch(duffelUrl, {
    method: request.method,
    headers: {
      Authorization: `Bearer ${token}`,
      "Duffel-Version": getDuffelVersion(),
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: request.method === "GET" || request.method === "HEAD" ? undefined : await request.text(),
  })

  const body = await response.text()

  return new Response(body, {
    status: response.status,
    headers: {
      "Content-Type": response.headers.get("Content-Type") || "application/json",
    },
  })
}
