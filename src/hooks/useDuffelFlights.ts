import { useEffect, useState } from "react"
import { useQuery } from "@tanstack/react-query"

import {
  fetchDuffelFlightOffers,
  fetchDuffelIataCode,
  reverseGeocodeCity,
} from "@/lib/duffelApi"

export const duffelFlightKeys = {
  all: ["duffel-flights"] as const,
  search: (originCity: string, destinationCity: string) =>
    ["duffel-flights", originCity, destinationCity] as const,
}

type OriginStatus = "detecting" | "detected" | "manual"

export function useDuffelFlights(destinationCity: string | undefined) {
  const [originCity, setOriginCity] = useState("")
  const [originInput, setOriginInput] = useState("")
  const [originStatus, setOriginStatus] = useState<OriginStatus>(() =>
    typeof navigator === "undefined" || !navigator.geolocation ? "manual" : "detecting",
  )

  useEffect(() => {
    if (!navigator.geolocation) {
      return
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const city = await reverseGeocodeCity(
            position.coords.latitude,
            position.coords.longitude,
          )
          setOriginCity(city)
          setOriginInput(city)
          setOriginStatus("detected")
        } catch {
          setOriginStatus("manual")
        }
      },
      () => setOriginStatus("manual"),
      { enableHighAccuracy: false, timeout: 9000, maximumAge: 300000 },
    )
  }, [])

  const flightsQuery = useQuery({
    queryKey: duffelFlightKeys.search(originCity, destinationCity ?? ""),
    queryFn: async () => {
      const [originIataCode, destinationIataCode] = await Promise.all([
        fetchDuffelIataCode(originCity),
        fetchDuffelIataCode(destinationCity as string),
      ])

      return fetchDuffelFlightOffers(originIataCode, destinationIataCode)
    },
    enabled: Boolean(originCity && destinationCity),
    retry: 1,
    staleTime: 1000 * 60 * 15,
  })

  function submitManualOrigin() {
    const city = originInput.trim()
    if (!city) return
    setOriginCity(city)
    setOriginStatus("manual")
  }

  const errorMessage = flightsQuery.error
    ? flightsQuery.error instanceof Error
      ? flightsQuery.error.message
      : "Não foi possível encontrar passagens para este destino."
    : null

  return {
    originCity,
    originInput,
    originStatus,
    setOriginInput,
    submitManualOrigin,
    ...flightsQuery,
    errorMessage,
  }
}
