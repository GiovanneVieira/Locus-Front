import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import {
  blockUser,
  changeUserRole,
  deleteAddressAsAdmin,
  deleteUser,
  fetchAdminAddresses,
  fetchAdminAudit,
  fetchAdminUsers,
  unblockUser,
} from "@/lib/api"
import type {
  AddressSearchParams,
  AdminUsersSearchParams,
  ChangeUserRolePayload,
} from "@/lib/types"

export {
  adminMetricKeys,
  useAdminAccessLogs,
  useAdminCriticalFailures,
  useAdminMetrics,
} from "@/hooks/useAdminMetrics"

export const adminKeys = {
  all: ["admin"] as const,
  users: (params?: AdminUsersSearchParams) =>
    ["admin", "users", params ?? {}] as const,
  addresses: (params?: AddressSearchParams) =>
    ["admin", "addresses", params ?? {}] as const,
  audit: (params?: { page?: number; size?: number }) =>
    ["admin", "audit", params ?? {}] as const,
}

export function useAdminUsers(params?: AdminUsersSearchParams) {
  return useQuery({
    queryKey: adminKeys.users(params),
    queryFn: () => fetchAdminUsers(params),
    placeholderData: (previous) => previous,
  })
}

export function useChangeUserRole() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: ChangeUserRolePayload }) =>
      changeUserRole(id, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: adminKeys.all })
    },
  })
}

export function useDeleteUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => deleteUser(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: adminKeys.all })
    },
  })
}

export function useBlockUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => blockUser(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: adminKeys.all })
    },
  })
}

export function useUnblockUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => unblockUser(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: adminKeys.all })
    },
  })
}

export function useAdminAddresses(params?: AddressSearchParams) {
  return useQuery({
    queryKey: adminKeys.addresses(params),
    queryFn: () => fetchAdminAddresses(params),
    placeholderData: (previous) => previous,
  })
}

export function useDeleteAddressAsAdmin() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => deleteAddressAsAdmin(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: adminKeys.all })
      await queryClient.invalidateQueries({ queryKey: ["addresses"] })
    },
  })
}

export function useAdminAudit(params?: { page?: number; size?: number }) {
  return useQuery({
    queryKey: adminKeys.audit(params),
    queryFn: () => fetchAdminAudit(params),
    placeholderData: (previous) => previous,
  })
}
