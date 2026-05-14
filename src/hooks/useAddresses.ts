import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import {
  createAddress,
  createRentableAddress,
  deleteAddress,
  fetchAddressById,
  fetchAddresses,
  fetchMyAddresses,
  updateAddress,
  uploadImages,
} from "@/lib/api"
import type {
  AddressSearchParams,
  CreateAddressPayload,
  UpdateAddressPayload,
} from "@/lib/types"

export const addressKeys = {
  all: ["addresses"] as const,
  list: (params?: AddressSearchParams) =>
    ["addresses", "list", params ?? {}] as const,
  mine: ["addresses", "mine"] as const,
  detail: (id: string) => ["addresses", "detail", id] as const,
}

export function useAddresses(params?: AddressSearchParams) {
  return useQuery({
    queryKey: addressKeys.list(params),
    queryFn: () => fetchAddresses(params),
    placeholderData: (previous) => previous,
  })
}

export function useMyAddresses() {
  return useQuery({
    queryKey: addressKeys.mine,
    queryFn: fetchMyAddresses,
  })
}

export function useAddress(id: string | undefined) {
  return useQuery({
    queryKey: addressKeys.detail(id ?? ""),
    queryFn: () => fetchAddressById(id as string),
    enabled: Boolean(id),
  })
}

export function useCreateAddress() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateAddressPayload) => createRentableAddress(payload),
    mutationFn: (payload: CreateAddressPayload) => createAddress(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: addressKeys.all })
    },
  })
}

export function useUpdateAddress(id: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: UpdateAddressPayload) => updateAddress(id, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: addressKeys.all })
      await queryClient.invalidateQueries({ queryKey: addressKeys.detail(id) })
    },
  })
}

export function useDeleteAddress() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => deleteAddress(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: addressKeys.all })
    },
  })
}

/**
 * SCRUM-126 — Upload de imagens do imóvel (devolve URLs públicas no S3).
 */
export function useUploadAddressImages() {
  return useMutation({
    mutationFn: (files: File[]) => uploadImages(files),
  })
}