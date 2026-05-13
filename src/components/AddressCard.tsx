import { Link } from "react-router"
import { Image as ImageIcon, MapPin, Users } from "lucide-react"

import type { Address } from "@/lib/types"

interface AddressCardProps {
  address: Address
}

function formatPrice(value: number | null | undefined) {
  if (value === null || value === undefined) return null
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  }).format(value)
}

export function AddressCard({ address }: AddressCardProps) {
  const price = formatPrice(address.pricePerNight)
  const cover = address.coverImageUrl ?? address.imageUrls?.[0]

  return (
    <Link
      to={`/enderecos/${address.id}`}
      aria-label={`Ver ${address.title}`}
      className="group flex flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
    >
      {/* Capa */}
      <div className="relative h-48 w-full overflow-hidden bg-gradient-to-br from-primary/15 via-primary/5 to-transparent">
        {cover ? (
          <img
            src={cover}
            alt={address.title}
            className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-1.5 text-muted-foreground">
            <ImageIcon size={26} />
            <span className="text-xs">Sem imagem</span>
          </div>
        )}

        {price ? (
          <span className="absolute top-3 right-3 rounded-full border border-border bg-card/95 px-3 py-1 text-xs font-semibold shadow-xs backdrop-blur">
            {price} <span className="text-[10px] text-muted-foreground">/ noite</span>
          </span>
        ) : null}
      </div>

      {/* Conteúdo */}
      <div className="flex flex-1 flex-col gap-2 p-5">
        <div className="flex items-start justify-between gap-2">
          <h3 className="line-clamp-1 text-base font-semibold leading-snug">
            {address.title}
          </h3>
          {address.maxGuests ? (
            <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-secondary px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
              <Users size={11} /> {address.maxGuests}
            </span>
          ) : null}
        </div>

        <p className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
          <MapPin size={12} className="shrink-0" />
          <span className="truncate">
            {address.neighborhood}, {address.city} — {address.state}
          </span>
        </p>

        {address.description ? (
          <p className="mt-0.5 line-clamp-2 text-xs leading-5 text-muted-foreground">
            {address.description}
          </p>
        ) : null}
      </div>
    </Link>
  )
}

export default AddressCard
