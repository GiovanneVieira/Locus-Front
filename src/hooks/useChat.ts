import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import {
  fetchMyThreads,
  openThread,
  sendHostAutoReply,
  sendMessage,
  type OpenThreadArgs,
} from "@/lib/communityApi"

export const chatKeys = {
  all: ["chat"] as const,
  thread: (threadId: string) => ["chat", "thread", threadId] as const,
  mine: (guestId: string) => ["chat", "mine", guestId] as const,
}

/** Abre (ou cria) o thread entre o hóspede e o anfitrião de um imóvel. */
export function useChatThread(args: OpenThreadArgs | null) {
  const threadId = args ? `${args.addressId}:${args.guest.id}` : ""
  return useQuery({
    queryKey: chatKeys.thread(threadId),
    queryFn: () => openThread(args as OpenThreadArgs),
    enabled: Boolean(args),
  })
}

export function useMyThreads(guestId: string | undefined) {
  return useQuery({
    queryKey: chatKeys.mine(guestId ?? ""),
    queryFn: () => fetchMyThreads(guestId as string),
    enabled: Boolean(guestId),
  })
}

export function useSendMessage(threadId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (args: {
      sender: { id: string; name: string; fromHost: boolean }
      text: string
    }) => sendMessage(threadId, args.sender, args.text),
    onSuccess: (thread) => {
      queryClient.setQueryData(chatKeys.thread(threadId), thread)
    },
  })
}

/** Dispara a resposta automática do anfitrião (apoio à demonstração). */
export function useHostAutoReply(threadId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => sendHostAutoReply(threadId),
    onSuccess: (thread) => {
      queryClient.setQueryData(chatKeys.thread(threadId), thread)
    },
  })
}
