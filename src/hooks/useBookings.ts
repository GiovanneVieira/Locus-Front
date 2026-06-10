import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import {
  createBooking,
  fetchHostBookings,
  fetchMyBookings,
  updateBookingStatus,
  type CreateBookingArgs,
} from "@/lib/communityApi"
import type { BookingStatus } from "@/lib/types"

export const bookingKeys = {
  all: ["bookings"] as const,
  mine: (guestId: string) => ["bookings", "mine", guestId] as const,
  host: (hostId: string) => ["bookings", "host", hostId] as const,
}

export function useMyBookings(guestId: string | undefined) {
  return useQuery({
    queryKey: bookingKeys.mine(guestId ?? ""),
    queryFn: () => fetchMyBookings(guestId as string),
    enabled: Boolean(guestId),
  })
}

export function useHostBookings(hostId: string | undefined, enabled = true) {
  return useQuery({
    queryKey: bookingKeys.host(hostId ?? ""),
    queryFn: () => fetchHostBookings(hostId as string),
    enabled: Boolean(hostId) && enabled,
  })
}

export function useCreateBooking() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (args: CreateBookingArgs) => createBooking(args),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: bookingKeys.all })
    },
  })
}

export function useUpdateBookingStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: BookingStatus }) =>
      updateBookingStatus(id, status),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: bookingKeys.all })
    },
  })
}
