import { Link } from "react-router"
import { MapPin, Users } from "lucide-react"

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

  return (
    <Link
      to={`/enderecos/${address.id}`}
      className="group glass-card flex flex-col overflow-hidden p-0 transition hover:-translate-y-0.5"
    >
      <div
        className="relative h-40 w-full overflow-hidden bg-gradient-to-br from-primary/30 via-primary/10 to-transparent"
        style={
          address.coverImageUrl
            ? {
                backgroundImage: `url(${address.coverImageUrl})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }
            : undefined
        }
      >
        <div className="absolute inset-0 bg-gradient-to-t from-background/70 via-transparent to-transparent" />
        {price ? (
          <span className="absolute top-3 right-3 rounded-full border border-white/10 bg-background/70 px-3 py-1 text-xs font-semibold backdrop-blur">
            {price} <span className="text-[10px] text-muted-foreground">/ noite</span>
          </span>
        ) : null}
      </div>

      <div className="flex flex-col gap-2 p-5">
        <div className="flex items-start justify-between gap-2">
          <h3 className="truncate text-base font-semibold">{address.title}</h3>
          {address.maxGuests ? (
            <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[10px] font-medium text-muted-foreground">
              <Users size={11} /> {address.maxGuests}
            </span>
          ) : null}
        </div>
        <p className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
          <MapPin size={12} /> {address.neighborhood}, {address.city} — {address.state}
        </p>
        {address.description ? (
          <p className="mt-1 line-clamp-2 text-xs leading-5 text-muted-foreground">
            {address.description}
          </p>
        ) : null}
      </div>
    </Link>
  )
}

export default AddressCard