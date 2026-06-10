import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { createReview, deleteReview, fetchReviews } from "@/lib/api"
import { summarizeReviews } from "@/lib/communityApi"
import type { CreateReviewPayload } from "@/lib/types"

export const reviewKeys = {
  all: ["reviews"] as const,
  list: (addressId: string) => ["reviews", "list", addressId] as const,
}

export function useReviews(addressId: string | undefined) {
  return useQuery({
    queryKey: reviewKeys.list(addressId ?? ""),
    queryFn: () => fetchReviews(addressId as string),
    enabled: Boolean(addressId),
    select: (reviews) => ({
      reviews,
      summary: summarizeReviews(reviews),
    }),
  })
}

export function useCreateReview(addressId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateReviewPayload) => createReview(addressId, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: reviewKeys.list(addressId) })
    },
  })
}

export function useDeleteReview(addressId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (reviewId: string) => deleteReview(reviewId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: reviewKeys.list(addressId) })
    },
  })
}
