import { useState } from "react"
import { Link } from "react-router"
import {
  CalendarCheck,
  CalendarDays,
  Check,
  Inbox,
  Loader2,
  MapPin,
  Users,
  X,
} from "lucide-react"

import Header from "@/components/Header/Header"
import { Footer } from "@/components/Footer"
import { Breadcrumbs } from "@/components/Breadcrumbs"
import { Button } from "@/components/ui/button"
import { ConfirmDialog } from "@/components/feedback/ConfirmDialog"
import { useToast } from "@/components/feedback/ToastProvider"
import { useCurrentUser } from "@/hooks/useAuth"
import { useHostBookings, useMyBookings, useUpdateBookingStatus } from "@/hooks/useBookings"
import { getRentableAddressImageUrl } from "@/lib/api"
import { isHost } from "@/lib/user"
import type { Booking, BookingStatus } from "@/lib/types"

const STATUS_META: Record<BookingStatus, { label: string; className: string }> = {
  PENDING: {
    label: "Aguardando anfitrião",
    className: "bg-amber-400/15 text-amber-600 dark:text-amber-400",
  },
  CONFIRMED: {
    label: "Confirmada",
    className: "bg-emerald-400/15 text-emerald-600 dark:text-emerald-400",
  },
  DECLINED: {
    label: "Recusada",
    className: "bg-destructive/10 text-destructive",
  },
  CANCELLED: {
    label: "Cancelada",
    className: "bg-secondary text-muted-foreground",
  },
}

function formatPrice(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  }).format(value)
}

function formatDate(value: string) {
  try {
    return new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "short" }).format(
      new Date(`${value}T00:00:00`)
    )
  } catch {
    return value
  }
}

export default function ReservasPage() {
  const { data: user } = useCurrentUser()
  const host = Boolean(isHost(user))
  const toast = useToast()

  const { data: myBookings, isLoading: loadingMine } = useMyBookings(user?.id)
  const { data: hostBookings, isLoading: loadingHost } = useHostBookings(user?.id, host)
  const updateStatus = useUpdateBookingStatus()

  const [cancelTarget, setCancelTarget] = useState<Booking | null>(null)

  async function changeStatus(booking: Booking, status: BookingStatus, message: string) {
    try {
      await updateStatus.mutateAsync({ id: booking.id, status })
      toast.success(message)
    } catch {
      toast.error("Não foi possível atualizar", "Tente novamente em instantes.")
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      <main className="mx-auto max-w-5xl px-6 py-10">
        <Breadcrumbs items={[{ label: "Minhas reservas" }]} className="mb-5" />

        <header className="mb-8">
          <span className="section-badge">
            <CalendarCheck size={12} />
            Reservas
          </span>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">
            Minhas reservas
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Acompanhe suas solicitações de hospedagem e o status de cada pedido.
          </p>
        </header>

        {/* Solicitações enviadas (hóspede) */}
        <section className="mb-12">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-bold tracking-tight">
            <CalendarDays size={18} className="text-primary" />
            Viagens solicitadas
          </h2>

          {loadingMine ? (
            <LoadingRow />
          ) : !myBookings || myBookings.length === 0 ? (
            <EmptyState
              icon={CalendarDays}
              title="Você ainda não fez reservas"
              description="Explore o catálogo e solicite a sua primeira hospedagem."
              action={
                <Button asChild className="mt-4 rounded-xl">
                  <Link to="/enderecos">Explorar hospedagens</Link>
                </Button>
              }
            />
          ) : (
            <div className="grid gap-4">
              {myBookings.map((booking) => (
                <BookingCard
                  key={booking.id}
                  booking={booking}
                  perspective="guest"
                  actions={
                    booking.status === "PENDING" || booking.status === "CONFIRMED" ? (
                      <Button
                        variant="destructive"
                        className="h-9 rounded-xl text-xs"
                        disabled={updateStatus.isPending}
                        onClick={() => setCancelTarget(booking)}
                      >
                        <X size={13} /> Cancelar
                      </Button>
                    ) : null
                  }
                />
              ))}
            </div>
          )}
        </section>

        {/* Solicitações recebidas (anfitrião) */}
        {host ? (
          <section>
            <h2 className="mb-4 flex items-center gap-2 text-lg font-bold tracking-tight">
              <Inbox size={18} className="text-primary" />
              Solicitações recebidas
            </h2>

            {loadingHost ? (
              <LoadingRow />
            ) : !hostBookings || hostBookings.length === 0 ? (
              <EmptyState
                icon={Inbox}
                title="Nenhuma solicitação ainda"
                description="Quando um hóspede reservar um dos seus imóveis, o pedido aparece aqui."
              />
            ) : (
              <div className="grid gap-4">
                {hostBookings.map((booking) => (
                  <BookingCard
                    key={booking.id}
                    booking={booking}
                    perspective="host"
                    actions={
                      booking.status === "PENDING" ? (
                        <div className="flex gap-2">
                          <Button
                            className="h-9 rounded-xl text-xs"
                            disabled={updateStatus.isPending}
                            onClick={() =>
                              changeStatus(booking, "CONFIRMED", "Reserva confirmada!")
                            }
                          >
                            <Check size={13} /> Aceitar
                          </Button>
                          <Button
                            variant="outline"
                            className="h-9 rounded-xl text-xs"
                            disabled={updateStatus.isPending}
                            onClick={() =>
                              changeStatus(booking, "DECLINED", "Solicitação recusada.")
                            }
                          >
                            <X size={13} /> Recusar
                          </Button>
                        </div>
                      ) : null
                    }
                  />
                ))}
              </div>
            )}
          </section>
        ) : null}
      </main>

      <Footer />

      <ConfirmDialog
        open={Boolean(cancelTarget)}
        onOpenChange={(open) => !open && setCancelTarget(null)}
        title="Cancelar esta reserva?"
        description={
          cancelTarget
            ? `Sua reserva em "${cancelTarget.addressTitle}" será cancelada. Esta ação não pode ser desfeita.`
            : ""
        }
        confirmLabel="Sim, cancelar"
        cancelLabel="Manter reserva"
        destructive
        loading={updateStatus.isPending}
        onConfirm={async () => {
          if (cancelTarget) {
            await changeStatus(cancelTarget, "CANCELLED", "Reserva cancelada.")
            setCancelTarget(null)
          }
        }}
      />
    </div>
  )
}

function BookingCard({
  booking,
  perspective,
  actions,
}: {
  booking: Booking
  perspective: "guest" | "host"
  actions?: React.ReactNode
}) {
  const meta = STATUS_META[booking.status]
  const cover = booking.coverImageId ? getRentableAddressImageUrl(booking.coverImageId) : null

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-4 shadow-sm sm:flex-row sm:items-center">
      <Link
        to={`/enderecos/${booking.addressId}`}
        className="relative aspect-[16/10] w-full shrink-0 overflow-hidden rounded-xl border border-border bg-secondary/30 sm:size-24 sm:aspect-square"
      >
        {cover ? (
          <img src={cover} alt={booking.addressTitle} className="size-full object-cover" />
        ) : (
          <div className="flex size-full items-center justify-center text-muted-foreground">
            <MapPin size={20} />
          </div>
        )}
      </Link>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div className="min-w-0">
            <Link
              to={`/enderecos/${booking.addressId}`}
              className="block truncate font-semibold text-foreground hover:text-primary"
            >
              {booking.addressTitle}
            </Link>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {perspective === "host" ? `Hóspede: ${booking.guestName}` : booking.addressCity}
            </p>
          </div>
          <span
            className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${meta.className}`}
          >
            {meta.label}
          </span>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <CalendarDays size={13} className="text-primary/70" />
            {formatDate(booking.checkIn)} → {formatDate(booking.checkOut)}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Users size={13} className="text-primary/70" />
            {booking.guests} {booking.guests === 1 ? "hóspede" : "hóspedes"}
          </span>
          <span className="font-semibold text-foreground">
            {formatPrice(booking.totalPrice)}
            <span className="font-normal text-muted-foreground">
              {" "}
              · {booking.nights} {booking.nights === 1 ? "noite" : "noites"}
            </span>
          </span>
        </div>

        {booking.message ? (
          <p className="mt-2 line-clamp-2 rounded-lg bg-secondary/30 px-3 py-1.5 text-xs text-muted-foreground">
            “{booking.message}”
          </p>
        ) : null}
      </div>

      {actions ? <div className="shrink-0 sm:self-center">{actions}</div> : null}
    </div>
  )
}

function LoadingRow() {
  return (
    <div className="flex items-center justify-center rounded-2xl border border-dashed border-border py-10 text-muted-foreground">
      <Loader2 size={22} className="animate-spin text-primary" />
    </div>
  )
}

function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: React.ComponentType<{ size?: number; className?: string }>
  title: string
  description: string
  action?: React.ReactNode
}) {
  return (
    <div className="flex flex-col items-center rounded-2xl border border-dashed border-border py-12 text-center">
      <div className="mb-3 flex size-12 items-center justify-center rounded-2xl bg-secondary text-muted-foreground">
        <Icon size={22} />
      </div>
      <p className="text-sm font-semibold text-foreground">{title}</p>
      <p className="mt-1 max-w-sm text-xs text-muted-foreground">{description}</p>
      {action}
    </div>
  )
}
