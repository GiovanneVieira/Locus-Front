import { useMutation, useQueryClient } from "@tanstack/react-query"
import { sendOtp, validateOtp } from "@/lib/api"
import type { SendOtpPayload, VerifyOtpPayload } from "@/lib/types"
import { authKeys } from "./useAuth"

export function useSendOtp() {
  return useMutation({
    mutationFn: (payload: SendOtpPayload) => sendOtp(payload),
  })
}

export function useValidateOtp() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: VerifyOtpPayload) => validateOtp(payload),
    onSuccess: async () => {
      // Como a validação conclui o login/cadastro, agora sim limpamos e redefinimos o cache
      await queryClient.invalidateQueries({ queryKey: authKeys.currentUser })
      await queryClient.invalidateQueries({ queryKey: ["dashboard", "board"] })
    },
  })
}