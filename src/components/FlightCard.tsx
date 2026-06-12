import { ArrowRight, Clock, Plane } from "lucide-react"

import { Button } from "@/components/ui/button"
import type { DuffelFlightOffer } from "@/lib/types"

interface FlightCardProps {
  offer: DuffelFlightOffer
}

function formatTime(value: string | undefined) {
  if (!value) return "--:--"
  return new Intl.DateTimeFormat("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value))
}

function formatDate(value: string | undefined) {
  if (!value) return "Data não informada"
  return new Intl.DateTimeFormat("pt-BR", {
    weekday: "short",
    day: "2-digit",
    month: "short",
  })
    .format(new Date(value))
    .replace(".", "")
}

function formatCurrency(amount: string, currency: string) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: currency || "BRL",
  }).format(Number(amount))
}

function formatDuration(duration: string | null | undefined) {
  if (!duration) return "Duração não informada"
  const match = duration.match(/P(?:(\d+)D)?T(?:(\d+)H)?(?:(\d+)M)?/)
  if (!match) return duration

  const days = Number(match[1] ?? 0)
  const hours = Number(match[2] ?? 0)
  const minutes = Number(match[3] ?? 0)
  return [days ? `${days}d` : "", hours ? `${hours}h` : "", minutes ? `${minutes}min` : ""]
    .filter(Boolean)
    .join(" ")
}

function airportName(airport: { iata_code?: string | null; name?: string | null; city_name?: string | null } | undefined) {
  if (!airport) return "Aeroporto não informado"
  return airport.name || airport.city_name || "Aeroporto não informado"
}

function airportLocation(airport: { iata_code?: string | null; city_name?: string | null } | undefined) {
  if (!airport) return ""
  return [airport.city_name, airport.iata_code ? `Código ${airport.iata_code}` : ""]
    .filter(Boolean)
    .join(" · ")
}

export function FlightCard({ offer }: FlightCardProps) {
  const firstSlice = offer.slices[0]
  const firstSegment = firstSlice?.segments[0]
  const lastSegment = firstSlice?.segments[firstSlice.segments.length - 1]

  return (
    <article className="group relative overflow-hidden rounded-[24px] border border-white/10 bg-zinc-950/80 p-5 shadow-2xl shadow-black/30 transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:bg-zinc-950">
      <div className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent" />

      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-primary">
            <Plane size={18} />
          </div>
          <div>
            <p className="text-sm font-semibold text-white">{offer.owner.name}</p>
            <p className="text-xs text-white/45">Classe econômica</p>
          </div>
        </div>

        <div className="text-right">
          <p className="text-xl font-semibold tracking-tight text-white">
            {formatCurrency(offer.total_amount, offer.total_currency)}
          </p>
          <p className="text-[11px] uppercase tracking-[0.22em] text-white/35">por adulto</p>
        </div>
      </div>

      <div className="mt-6 grid gap-5 md:grid-cols-[1fr_auto_1fr] md:items-center md:gap-4">
        <div>
          <p className="text-[11px] uppercase tracking-[0.22em] text-white/35">Saída</p>
          <p className="mt-1 text-2xl font-semibold text-white">{formatTime(firstSegment?.departing_at)}</p>
          <p className="mt-1 text-xs font-medium text-white/70">{formatDate(firstSegment?.departing_at)}</p>
          <p className="mt-3 text-sm font-medium leading-tight text-white">
            {airportName(firstSegment?.origin)}
          </p>
          <p className="mt-1 text-xs text-white/45">{airportLocation(firstSegment?.origin)}</p>
        </div>

        <div className="hidden flex-col items-center gap-2 text-white/40 md:flex">
          <ArrowRight size={18} />
          <span className="h-px w-12 bg-white/15" />
        </div>

        <div className="md:text-right">
          <p className="text-[11px] uppercase tracking-[0.22em] text-white/35">Chegada</p>
          <p className="mt-1 text-2xl font-semibold text-white">{formatTime(lastSegment?.arriving_at)}</p>
          <p className="mt-1 text-xs font-medium text-white/70">{formatDate(lastSegment?.arriving_at)}</p>
          <p className="mt-3 text-sm font-medium leading-tight text-white">
            {airportName(lastSegment?.destination)}
          </p>
          <p className="mt-1 text-xs text-white/45">{airportLocation(lastSegment?.destination)}</p>
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between gap-4 border-t border-white/10 pt-4">
        <span className="inline-flex items-center gap-2 text-xs text-white/55">
          <Clock size={14} />
          {formatDuration(firstSlice?.duration ?? firstSegment?.duration)}
        </span>
        <Button className="rounded-full bg-white px-4 text-zinc-950 hover:bg-primary hover:text-primary-foreground">
          Selecionar Voo
        </Button>
      </div>
    </article>
  )
}
