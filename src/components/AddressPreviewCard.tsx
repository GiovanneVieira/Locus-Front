import { CalendarDays, Eye, Image as ImageIcon, MapPin, Users } from "lucide-react"

import { getAmenityLabel } from "@/components/forms/AmenitySelector"

interface AddressPreviewCardProps {
  title: string
  description: string
  city: string
  state: string
  neighborhood: string
  pricePerNight?: number | string | null
  maxGuests?: number | string | null
  availableFrom?: string
  availableTo?: string
  amenities: string[]
  /** URLs (locais ou remotas) das imagens, primeira é a capa */
  imageUrls: string[]
}

function formatPrice(value: number | string | null | undefined) {
  if (value === null || value === undefined || value === "") return null
  const numeric = typeof value === "number" ? value : Number(value)
  if (!Number.isFinite(numeric)) return null
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  }).format(numeric)
}

function formatDate(value?: string) {
  if (!value) return null
  try {
    return new Date(value).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
    })
  } catch {
    return value
  }
}

/**
 * Card de preview ao lado do formulário (SCRUM-126 DoD).
 * Mostra exatamente como o anúncio vai aparecer na vitrine — Nielsen #1 (visibilidade
 * do estado do sistema): o anfitrião vê em tempo real o resultado da edição.
 */
export function AddressPreviewCard(props: AddressPreviewCardProps) {
  const cover = props.imageUrls[0]
  const extraCount = Math.max(0, props.imageUrls.length - 1)
  const price = formatPrice(props.pricePerNight)
  const guests = props.maxGuests ? Number(props.maxGuests) : null
  const fromText = formatDate(props.availableFrom)
  const toText = formatDate(props.availableTo)

  const locationText =
    [props.neighborhood, props.city].filter(Boolean).join(", ") +
    (props.state ? ` — ${props.state}` : "")

  return (
    <div className="sticky top-24 flex flex-col gap-3">
      <p className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
        <Eye size={12} /> Pré-visualização ao vivo
      </p>

      <article className="overflow-hidden rounded-3xl border border-border bg-card shadow-md">
        {/* Imagem de capa */}
        <div className="relative h-56 w-full overflow-hidden bg-gradient-to-br from-primary/15 via-primary/5 to-transparent">
          {cover ? (
            <img src={cover} alt="Capa do imóvel" className="size-full object-cover" />
          ) : (
            <div className="flex h-full flex-col items-center justify-center gap-2 text-muted-foreground">
              <ImageIcon size={28} />
              <span className="text-xs">As imagens aparecem aqui</span>
            </div>
          )}

          {extraCount > 0 ? (
            <span className="absolute bottom-3 left-3 rounded-full bg-card/95 px-2.5 py-1 text-[10px] font-semibold text-foreground backdrop-blur">
              +{extraCount} foto{extraCount === 1 ? "" : "s"}
            </span>
          ) : null}

          {price ? (
            <span className="absolute top-3 right-3 rounded-full border border-border bg-card/95 px-3 py-1 text-xs font-semibold backdrop-blur">
              {price} <span className="text-[10px] text-muted-foreground">/ noite</span>
            </span>
          ) : null}
        </div>

        {/* Conteúdo */}
        <div className="flex flex-col gap-3 p-5">
          <div className="flex items-start justify-between gap-2">
            <h3 className="line-clamp-2 text-base font-semibold leading-tight">
              {props.title.trim() || "Título do imóvel"}
            </h3>
            {guests ? (
              <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-border bg-secondary px-2.5 py-1 text-[10px] font-medium text-muted-foreground">
                <Users size={11} /> {guests}
              </span>
            ) : null}
          </div>

          <p className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
            <MapPin size={12} />
            {locationText.trim() || "Bairro, cidade — UF"}
          </p>

          {props.description?.trim() ? (
            <p className="line-clamp-3 text-xs leading-5 text-muted-foreground">
              {props.description}
            </p>
          ) : (
            <p className="line-clamp-3 text-xs leading-5 text-muted-foreground/50 italic">
              A descrição do imóvel aparecerá aqui.
            </p>
          )}

          {/* Datas disponíveis */}
          {fromText || toText ? (
            <div className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-secondary/50 px-2.5 py-1.5 text-[11px] font-medium text-foreground">
              <CalendarDays size={11} />
              {fromText ?? "?"} → {toText ?? "?"}
            </div>
          ) : null}

          {/* Amenidades */}
          {props.amenities.length > 0 ? (
            <div className="flex flex-wrap gap-1.5">
              {props.amenities.slice(0, 4).map((amenity) => (
                <span
                  key={amenity}
                  className="rounded-full bg-secondary px-2.5 py-1 text-[10px] font-medium text-secondary-foreground"
                >
                  {getAmenityLabel(amenity)}
                </span>
              ))}
              {props.amenities.length > 4 ? (
                <span className="rounded-full bg-primary/10 px-2.5 py-1 text-[10px] font-medium text-primary">
                  +{props.amenities.length - 4}
                </span>
              ) : null}
            </div>
          ) : null}
        </div>
      </article>

      <p className="px-1 text-[10px] leading-relaxed text-muted-foreground">
        É assim que outros usuários verão o imóvel no catálogo.
      </p>
    </div>
  )
}

export default AddressPreviewCard
