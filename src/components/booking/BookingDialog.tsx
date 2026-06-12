import { useMemo, useState } from "react"
import { useNavigate } from "react-router"
import { CalendarDays, CheckCircle2, Loader2, Users } from "lucide-react"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/feedback/ToastProvider"
import { useCreateBooking } from "@/hooks/useBookings"
import { ApiError } from "@/lib/api"
import type { RentableAddressDetailResponse } from "@/lib/types"

interface BookingDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  address: RentableAddressDetailResponse
}

function formatPrice(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  }).format(value)
}

function todayISO() {
  return new Date().toISOString().slice(0, 10)
}

function countNights(checkIn: string, checkOut: string): number {
  if (!checkIn || !checkOut) return 0
  const diff = new Date(`${checkOut}T00:00:00`).getTime() - new Date(`${checkIn}T00:00:00`).getTime()
  if (Number.isNaN(diff) || diff <= 0) return 0
  return Math.round(diff / (1000 * 60 * 60 * 24))
}

export function BookingDialog({ open, onOpenChange, address }: BookingDialogProps) {
  const toast = useToast()
  const navigate = useNavigate()
  const createBooking = useCreateBooking()

  const [checkIn, setCheckIn] = useState("")
  const [checkOut, setCheckOut] = useState("")
  const [guests, setGuests] = useState(1)
  const [message, setMessage] = useState("")

  const pricePerNight = address.pricePerNight ?? 0
  const maxGuests = address.maxGuests ?? 16
  const nights = useMemo(() => countNights(checkIn, checkOut), [checkIn, checkOut])
  const total = nights * pricePerNight

  const minCheckIn = useMemo(() => {
    const floor = todayISO()
    if (address.availableFrom) {
      const from = address.availableFrom.slice(0, 10)
      return from > floor ? from : floor
    }
    return floor
  }, [address.availableFrom])

  function resetAndClose(openValue: boolean) {
    if (!openValue) {
      setCheckIn("")
      setCheckOut("")
      setGuests(1)
      setMessage("")
    }
    onOpenChange(openValue)
  }

  async function handleSubmit() {
    if (!checkIn || !checkOut) {
      toast.error("Informe as datas", "Escolha a data de entrada e de saída.")
      return
    }
    if (nights <= 0) {
      toast.error("Datas inválidas", "A saída precisa ser depois da entrada.")
      return
    }
    if (address.availableTo && checkOut.slice(0, 10) > address.availableTo.slice(0, 10)) {
      toast.error("Fora da disponibilidade", "Este imóvel não está disponível nessas datas.")
      return
    }
    if (guests < 1 || guests > maxGuests) {
      toast.error("Número de hóspedes", `Capacidade máxima de ${maxGuests} hóspedes.`)
      return
    }

    try {
      await createBooking.mutateAsync({
        addressId: address.id,
        payload: { checkIn, checkOut, guests, message: message || undefined },
      })
      toast.success(
        "Reserva solicitada!",
        "O anfitrião vai analisar seu pedido. Acompanhe em Minhas reservas."
      )
      resetAndClose(false)
      navigate("/reservas")
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : "Não foi possível solicitar agora."
      toast.error("Falha na reserva", msg)
    }
  }

  return (
    <Dialog open={open} onOpenChange={resetAndClose}>
      <DialogContent className="max-w-md rounded-3xl border-border bg-card p-6 sm:max-w-md sm:rounded-3xl">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold tracking-tight">Solicitar reserva</DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            {address.title}
            {address.city ? ` · ${address.city}` : ""}
          </DialogDescription>
        </DialogHeader>

        <div className="mt-1 flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-3">
            <label className="flex flex-col gap-1.5 text-xs font-semibold text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <CalendarDays size={13} className="text-primary/70" /> Entrada
              </span>
              <Input
                type="date"
                value={checkIn}
                min={minCheckIn}
                onChange={(event) => {
                  setCheckIn(event.target.value)
                  if (checkOut && event.target.value >= checkOut) setCheckOut("")
                }}
                className="h-11 rounded-xl text-sm"
              />
            </label>
            <label className="flex flex-col gap-1.5 text-xs font-semibold text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <CalendarDays size={13} className="text-primary/70" /> Saída
              </span>
              <Input
                type="date"
                value={checkOut}
                min={checkIn || minCheckIn}
                disabled={!checkIn}
                onChange={(event) => setCheckOut(event.target.value)}
                className="h-11 rounded-xl text-sm"
              />
            </label>
          </div>

          <label className="flex flex-col gap-1.5 text-xs font-semibold text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <Users size={13} className="text-primary/70" /> Hóspedes
              <span className="font-normal lowercase">(máx. {maxGuests})</span>
            </span>
            <Input
              type="number"
              min={1}
              max={maxGuests}
              value={guests}
              onChange={(event) =>
                setGuests(Math.max(1, Math.min(maxGuests, Number(event.target.value) || 1)))
              }
              className="h-11 rounded-xl text-sm"
            />
          </label>

          <label className="flex flex-col gap-1.5 text-xs font-semibold text-muted-foreground">
            <span>Mensagem ao anfitrião (opcional)</span>
            <Textarea
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              placeholder="Conte o motivo da viagem, horário de chegada…"
              rows={2}
              maxLength={300}
            />
          </label>

          {/* Resumo de preço */}
          <div className="rounded-2xl border border-border bg-secondary/20 p-4 text-sm">
            {nights > 0 ? (
              <>
                <div className="flex items-center justify-between text-muted-foreground">
                  <span>
                    {formatPrice(pricePerNight)} × {nights} {nights === 1 ? "noite" : "noites"}
                  </span>
                  <span>{formatPrice(total)}</span>
                </div>
                <div className="mt-3 flex items-center justify-between border-t border-border pt-3 text-base font-bold text-foreground">
                  <span>Total</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </>
            ) : (
              <p className="text-center text-xs text-muted-foreground">
                Selecione as datas para ver o valor total.
              </p>
            )}
          </div>

          <Button
            className="h-11 w-full gap-2 rounded-xl font-semibold shadow-sm"
            onClick={handleSubmit}
            disabled={createBooking.isPending}
          >
            {createBooking.isPending ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <CheckCircle2 size={16} />
            )}
            Confirmar solicitação
          </Button>
          <p className="text-center text-[11px] text-muted-foreground">
            Você ainda não será cobrado — o anfitrião precisa aceitar a reserva.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
