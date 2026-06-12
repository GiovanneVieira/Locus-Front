import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import {
  createDestination,
  deleteDestination,
  fetchDestinationByCity,
  fetchDestinationById,
  fetchDestinationRecommendations,
  fetchDestinations,
  updateDestination,
} from "@/lib/api"
import type { DestinationRequestDTO, DestinationSearchParams } from "@/lib/types"

export const destinationKeys = {
  all: ["destinations"] as const,
  list: (params?: DestinationSearchParams) => ["destinations", "list", params ?? {}] as const,
  detail: (id: string) => ["destinations", "detail", id] as const,
  city: (city: string) => ["destinations", "city", city] as const,
  recommendations: (city: string) => ["destinations", "recommendations", city] as const,
}

export function useDestinations(params?: DestinationSearchParams) {
  return useQuery({
    queryKey: destinationKeys.list(params),
    queryFn: () => fetchDestinations(params),
    placeholderData: (previousData) => previousData,
  })
}

export function useDestination(id: string | undefined) {
  return useQuery({
    queryKey: destinationKeys.detail(id ?? ""),
    queryFn: () => fetchDestinationById(id as string),
    enabled: Boolean(id),
  })
}

export function useDestinationByCity(city: string | undefined) {
  return useQuery({
    queryKey: destinationKeys.city(city ?? ""),
    queryFn: () => fetchDestinationByCity(city as string),
    enabled: Boolean(city),
  })
}

export function useDestinationRecommendations(city: string | undefined) {
  return useQuery({
    queryKey: destinationKeys.recommendations(city ?? ""),
    queryFn: () => fetchDestinationRecommendations(city as string),
    enabled: Boolean(city),
  })
}

export function useCreateDestination() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: DestinationRequestDTO) => createDestination(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: destinationKeys.all })
    },
  })
}

export function useUpdateDestination() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: DestinationRequestDTO }) =>
      updateDestination(id, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: destinationKeys.all })
    },
  })
}

export function useDeleteDestination() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => deleteDestination(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: destinationKeys.all })
    },
  })
}