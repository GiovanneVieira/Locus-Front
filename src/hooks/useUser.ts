import { useMutation, useQueryClient } from "@tanstack/react-query"

import { becomeHost, enableUser, updateCurrentUser } from "@/lib/api"
import type { ActivateUserPayload, UpdateUserPayload } from "@/lib/types"
import { authKeys } from "@/hooks/useAuth"

export function useUpdateCurrentUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: UpdateUserPayload) => updateCurrentUser(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: authKeys.currentUser })
    },
  })
}

export function useBecomeHost() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: becomeHost,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: authKeys.currentUser })
      await queryClient.invalidateQueries({ queryKey: ["addresses"] })
    },
  })
}

export function useEnableUser(){
  return useMutation({
    mutationFn: (payload: ActivateUserPayload) => enableUser(payload)
  })
}