import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import {
  createBooking,
  fetchHostBookings,
  fetchMyBookings,
  updateBookingStatus,
} from "@/lib/api"
import type { BookingStatus, CreateBookingPayload } from "@/lib/types"

export const bookingKeys = {
  all: ["bookings"] as const,
  mine: (guestId: string) => ["bookings", "mine", guestId] as const,
  host: (hostId: string) => ["bookings", "host", hostId] as const,
}

export function useMyBookings(userId: string | undefined) {
  return useQuery({
    queryKey: bookingKeys.mine(userId ?? ""),
    queryFn: () => fetchMyBookings(),
    enabled: Boolean(userId),
  })
}

export function useHostBookings(hostId: string | undefined, enabled = true) {
  return useQuery({
    queryKey: bookingKeys.host(hostId ?? ""),
    queryFn: () => fetchHostBookings(),
    enabled: Boolean(hostId) && enabled,
  })
}

export function useCreateBooking() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (args: { addressId: string; payload: CreateBookingPayload }) =>
      createBooking(args.addressId, args.payload),
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
