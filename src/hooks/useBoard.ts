import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { createTask, deleteTask, fetchBoard, updateTask } from "@/lib/api"
import type { CreateTaskPayload, UpdateTaskPayload } from "@/lib/types"

export const boardKeys = {
  board: ["dashboard", "board"] as const,
}

export function useBoard() {
  return useQuery({
    queryKey: boardKeys.board,
    queryFn: fetchBoard,
  })
}

export function useCreateTask() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateTaskPayload) => createTask(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: boardKeys.board })
    },
  })
}

export function useUpdateTask() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ taskId, payload }: { taskId: string; payload: UpdateTaskPayload }) =>
      updateTask(taskId, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: boardKeys.board })
    },
  })
}

export function useDeleteTask() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (taskId: string) => deleteTask(taskId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: boardKeys.board })
    },
  })
}