import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import {
  createPersonalAddress,
  createRentableAddress,
  deletePersonalAddress,
  fetchRentableAddressById,
  fetchAddresses,
  fetchMyAddresses,
  fetchPersonalAddressByUserId,
  updatePersonalAddress,
  updateRentableAddress,
  uploadImages,
  uploadRentableAddressImages,
  getRentableAddressImageUrl,
  deleteRentableAddress,
} from "@/lib/api"
import type {
  AddressSearchParams,
  CreateAddressPayload,
  PersonalAddressRequestDTO,
  RentableAddressesParams,
  RentableAddressImageResponse,
  UpdateAddressPayload,
} from "@/lib/types"

export const addressKeys = {
  all: ["addresses"] as const,
  list: (params?: RentableAddressesParams | AddressSearchParams) =>
    ["addresses", "list", params ?? {}] as const,
  mine: ["addresses", "mine"] as const,
  detail: (id: string) => ["addresses", "detail", id] as const,
  personalByUser: (id: string) => ["addresses", "personal", "user", id] as const,
}

export function useAddresses(params?: RentableAddressesParams | AddressSearchParams) {
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
    queryFn: () => fetchRentableAddressById(id as string),
    enabled: Boolean(id),
  })
}

export function usePersonalAddressByUserId(id: string | undefined) {
  return useQuery({
    queryKey: addressKeys.personalByUser(id ?? ""),
    queryFn: () => fetchPersonalAddressByUserId(id as string),
    enabled: Boolean(id),
  })
}

export function useCreateAddress() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateAddressPayload) => createRentableAddress(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: addressKeys.all })
    },
  })
}

export function useCreatePersonalAddress() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: PersonalAddressRequestDTO) => createPersonalAddress(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: addressKeys.all })
    },
  })
}

export function useUpdateRentableAddress(id: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: UpdateAddressPayload) => updateRentableAddress(id, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: addressKeys.all })
      await queryClient.invalidateQueries({ queryKey: addressKeys.detail(id) })
    },
  })
}

export function useUpdatePersonalAddress(id: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: UpdateAddressPayload) => updatePersonalAddress(id, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: addressKeys.all })
      await queryClient.invalidateQueries({ queryKey: addressKeys.detail(id) })
    },
  })
}

export function useDeleteRentableAddress() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => deleteRentableAddress(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: addressKeys.all })
    },
  })
}

export function useDeletePersonalAddress() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => deletePersonalAddress(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: addressKeys.all })
    },
  })
}


export function useRentableAddressImages(images: RentableAddressImageResponse[] = []) {
  return images.map((img) => getRentableAddressImageUrl(img.id))
}

/**
 * SCRUM-126 — Upload de imagens do imóvel (devolve URLs públicas no S3).
 */

export function useUploadRentableAddressImages() {
  return useMutation({
    mutationFn: (files: File[]) => uploadRentableAddressImages(files),
  })
}

export function useUploadAddressImages() {
  return useMutation({
    mutationFn: (files: File[]) => uploadImages(files),
  })
}
