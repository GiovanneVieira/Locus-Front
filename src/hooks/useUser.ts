import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import {
  becomeHost,
  createUser,
  deleteUserById,
  enableUser,
  fetchUserById,
  fetchUsers,
  updateCurrentUser,
  updateUser,
  uploadProfileImage,
} from "@/lib/api"
import { ApiError } from "@/lib/api"
import type { ActivateUserPayload, UpdateUserPayload, UserRequestDTO, UserSession } from "@/lib/types"
import { authKeys } from "@/hooks/useAuth"

export interface UpdateProfileWithAvatarParams {
  values: Omit<UpdateUserPayload, "pfpUrl">
  currentPfpUrl?: string | null
  avatarFile?: File | null
}

export const userKeys = {
  all: ["users"] as const,
  list: ["users", "list"] as const,
  detail: (id: string) => ["users", "detail", id] as const,
}

export function useUsers() {
  return useQuery({
    queryKey: userKeys.list,
    queryFn: fetchUsers,
  })
}

export function useUserById(id: string | undefined) {
  return useQuery({
    queryKey: userKeys.detail(id ?? ""),
    queryFn: () => fetchUserById(id as string),
    enabled: Boolean(id),
  })
}

export function useCreateUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: UserRequestDTO) => createUser(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: userKeys.all })
    },
  })
}

export function useUpdateUser(id: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: UserRequestDTO) => updateUser(id, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: userKeys.all })
      await queryClient.invalidateQueries({ queryKey: userKeys.detail(id) })
    },
  })
}

export function useDeleteUserById() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => deleteUserById(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: userKeys.all })
    },
  })
}

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

export function useEnableUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: ActivateUserPayload) => enableUser(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: userKeys.all })
    },
  })
}

export function useUploadProfileImage() {
  return useMutation({
    mutationFn: (file: File) => uploadProfileImage(file),
  })
}

export function useUpdateProfileWithAvatar() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (params: UpdateProfileWithAvatarParams): Promise<UserSession> => {
      let pfpUrl: string | null = params.currentPfpUrl ?? null

      if (params.avatarFile) {
        const uploadedUrl = await uploadProfileImage(params.avatarFile)
        if (!uploadedUrl) {
          throw new ApiError("Upload concluído, mas a URL da imagem não foi retornada pelo servidor.", 0)
        }
        pfpUrl = uploadedUrl
      }

      const payload: UpdateUserPayload = {
        name: params.values.name,
        phone: params.values.phone?.trim() || null,
        bio: params.values.bio?.trim() || null,
        pfpUrl,
      }

      return updateCurrentUser(payload)
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: authKeys.currentUser })
    },
  })
}
