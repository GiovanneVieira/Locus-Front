import type {
  DuffelFlightOffer,
  DuffelOfferRequestResponse,
  DuffelPlaceSuggestion,
  DuffelPlaceSuggestionsResponse,
} from "@/lib/types"

const DUFFEL_API_BASE_URL = import.meta.env.VITE_DUFFEL_API_BASE_URL ?? "/api/duffel"
const DUFFEL_API_TOKEN = import.meta.env.VITE_DUFFEL_API_TOKEN ?? ""
const DUFFEL_VERSION = import.meta.env.VITE_DUFFEL_VERSION ?? "v2"

class DuffelApiError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "DuffelApiError"
  }
}

function getDuffelHeaders() {
  const usesDirectDuffelApi = DUFFEL_API_BASE_URL.startsWith("https://api.duffel.com")

  if (usesDirectDuffelApi && !DUFFEL_API_TOKEN) {
    throw new DuffelApiError("Token da Duffel não configurado.")
  }

  return {
    ...(usesDirectDuffelApi ? { Authorization: `Bearer ${DUFFEL_API_TOKEN}` } : {}),
    "Duffel-Version": DUFFEL_VERSION,
    Accept: "application/json",
    "Content-Type": "application/json",
  }
}

async function parseDuffelError(response: Response, fallback: string) {
  try {
    const data = (await response.json()) as { errors?: { message?: string; title?: string }[] }
    const firstError = data.errors?.[0]
    return firstError?.message || firstError?.title || fallback
  } catch {
    return fallback
  }
}

async function duffelRequest<T>(path: string, init?: RequestInit): Promise<T> {
  const isInternalProxy = DUFFEL_API_BASE_URL.startsWith("/api/duffel")
  const requestUrl = isInternalProxy
    ? `${DUFFEL_API_BASE_URL}?path=${encodeURIComponent(path)}`
    : `${DUFFEL_API_BASE_URL}${path}`

  const response = await fetch(requestUrl, {
    ...init,
    headers: {
      ...getDuffelHeaders(),
      ...(init?.headers ?? {}),
    },
  })

  if (!response.ok) {
    const message = await parseDuffelError(response, "Falha ao consultar a Duffel.")
    throw new DuffelApiError(message)
  }

  return response.json() as Promise<T>
}

async function fetchDuffelAirportSuggestion(query: string): Promise<DuffelPlaceSuggestion> {
  const params = new URLSearchParams({ query })
  const response = await duffelRequest<DuffelPlaceSuggestionsResponse>(
    `/air/airports?${params.toString()}`,
  )
  const normalizedQuery = normalizeSearchText(query)
  const place = response.data.find((item) => {
    if (!item.iata_code) return false
    const candidates = [item.name, item.city_name, item.country_name]
    return candidates.some((candidate) => normalizeSearchText(candidate ?? "").includes(normalizedQuery))
  })

  if (!place) {
    throw new DuffelApiError(`Nenhum aeroporto encontrado para ${query}.`)
  }

  return place
}

function normalizeSearchText(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
}

function matchesQuery(place: DuffelPlaceSuggestion, query: string) {
  const normalizedQuery = normalizeSearchText(query)
  const candidates = [place.name, place.city_name, place.city?.name, place.city?.city_name]
    .filter(Boolean)
    .map((value) => normalizeSearchText(value as string))

  return candidates.some(
    (candidate) => candidate === normalizedQuery || candidate.includes(normalizedQuery),
  )
}

function pickBestAirport(place: DuffelPlaceSuggestion, query: string) {
  const airports = place.airports?.filter((airport) => airport.iata_code) ?? []
  const matchingAirports = airports.filter((airport) => matchesQuery(airport, query))
  const candidates = matchingAirports.length > 0 ? matchingAirports : airports

  return (
    candidates.find((airport) => /international/i.test(airport.name)) ??
    candidates.find((airport) => airport.type === "airport") ??
    candidates[0]
  )
}

async function fetchDuffelPlaceSuggestions(query: string): Promise<DuffelPlaceSuggestion[]> {
  const params = new URLSearchParams({ query })
  const response = await duffelRequest<DuffelPlaceSuggestionsResponse>(
    `/places/suggestions?${params.toString()}`,
  )

  return response.data
}

export async function fetchDuffelIataCode(query: string) {
  try {
    const places = await fetchDuffelPlaceSuggestions(query)
    const matchingCity = places.find((place) => place.type === "city" && matchesQuery(place, query))
    const cityAirport = matchingCity ? pickBestAirport(matchingCity, query) : undefined
    if (cityAirport?.iata_code) return cityAirport.iata_code

    const matchingAirport = places.find(
      (place) => place.type === "airport" && place.iata_code && matchesQuery(place, query),
    )
    if (matchingAirport?.iata_code) return matchingAirport.iata_code

    const airport =
      places.map((place) => pickBestAirport(place, query)).find((place) => place?.iata_code) ??
      places.find((place) => place.type === "airport" && place.iata_code)

    if (!airport?.iata_code) {
      throw new DuffelApiError(`Nenhum aeroporto encontrado para ${query}.`)
    }

    return airport.iata_code
  } catch {
    const airport = await fetchDuffelAirportSuggestion(query)
    return airport.iata_code as string
  }
}

function getDepartureDateTwoWeeksFromNow() {
  const date = new Date()
  date.setDate(date.getDate() + 14)
  return date.toISOString().slice(0, 10)
}

export async function fetchDuffelFlightOffers(origin: string, destination: string) {
  if (origin === destination) {
    throw new DuffelApiError("Origem e destino resolveram para o mesmo aeroporto. Informe outra cidade de origem.")
  }

  const response = await duffelRequest<DuffelOfferRequestResponse>("/air/offer_requests", {
    method: "POST",
    body: JSON.stringify({
      data: {
        passengers: [{ type: "adult" }],
        slices: [
          {
            origin,
            destination,
            departure_date: getDepartureDateTwoWeeksFromNow(),
          },
        ],
        cabin_class: "economy",
        return_offers: true,
      },
    }),
  })

  return (response.data.offers ?? [])
    .slice()
    .sort((a, b) => Number(a.total_amount) - Number(b.total_amount))
    .slice(0, 4) satisfies DuffelFlightOffer[]
}

export async function reverseGeocodeCity(latitude: number, longitude: number) {
  const params = new URLSearchParams({
    format: "jsonv2",
    lat: String(latitude),
    lon: String(longitude),
  })
  const response = await fetch(`https://nominatim.openstreetmap.org/reverse?${params.toString()}`, {
    headers: { Accept: "application/json" },
  })

  if (!response.ok) {
    throw new Error("Não foi possível detectar sua cidade atual.")
  }

  const data = (await response.json()) as {
    address?: {
      city?: string
      town?: string
      village?: string
      municipality?: string
      state?: string
    }
  }

  const city =
    data.address?.city ||
    data.address?.town ||
    data.address?.village ||
    data.address?.municipality ||
    data.address?.state

  if (!city) {
    throw new Error("Não foi possível detectar sua cidade atual.")
  }

  return city
}
