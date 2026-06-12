/* eslint-disable react-refresh/only-export-components */
import {
  Bath,
  Building2,
  ChefHat,
  Flame,
  PawPrint,
  Snowflake,
  Tv,
  Waves,
  Wifi,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"

export interface AmenityOption {
  value: string
  label: string
  Icon: LucideIcon
}

/**
 * Catálogo de amenidades disponíveis no Locus.
 * Conforme DoD do SCRUM-126: "Ar condicionado, televisão, piscina, churrasqueira..."
 */
export const AMENITY_OPTIONS: AmenityOption[] = [
  { value: "air_conditioning", label: "Ar-condicionado", Icon: Snowflake },
  { value: "tv", label: "Televisão", Icon: Tv },
  { value: "pool", label: "Piscina", Icon: Waves },
  { value: "barbecue", label: "Churrasqueira", Icon: Flame },
  { value: "wifi", label: "Wi-Fi", Icon: Wifi },
  { value: "kitchen", label: "Cozinha equipada", Icon: ChefHat },
  { value: "parking", label: "Estacionamento", Icon: Building2 },
  { value: "pet_friendly", label: "Aceita pets", Icon: PawPrint },
  { value: "bathtub", label: "Banheira", Icon: Bath },
]

export function getAmenityLabel(value: string) {
  return AMENITY_OPTIONS.find((option) => option.value === value)?.label ?? value
}

interface AmenitySelectorProps {
  value: string[]
  onChange: (next: string[]) => void
}

/**
 * Grid de checkboxes de amenidades.
 * Cada item é um botão de toggle acessível, com feedback visual claro
 * (Nielsen #1 - visibilidade do estado do sistema).
 */
export function AmenitySelector({ value, onChange }: AmenitySelectorProps) {
  function toggle(amenity: string) {
    if (value.includes(amenity)) {
      onChange(value.filter((item) => item !== amenity))
    } else {
      onChange([...value, amenity])
    }
  }

  return (
    <div
      role="group"
      aria-label="Amenidades disponíveis no imóvel"
      className="grid grid-cols-2 gap-2.5 sm:grid-cols-3"
    >
      {AMENITY_OPTIONS.map((amenity) => {
        const checked = value.includes(amenity.value)
        return (
          <button
            key={amenity.value}
            type="button"
            role="switch"
            aria-checked={checked}
            onClick={() => toggle(amenity.value)}
            className={`relative inline-flex items-center gap-2 rounded-xl border px-3 py-2.5 text-left text-sm font-medium transition ${
              checked
                ? "border-primary/50 bg-primary/10 text-foreground shadow-xs"
                : "border-border bg-card text-muted-foreground hover:border-primary/30 hover:text-foreground"
            }`}
          >
            <span
              className={`inline-flex size-7 shrink-0 items-center justify-center rounded-lg ${
                checked
                  ? "bg-primary/15 text-primary"
                  : "bg-secondary text-muted-foreground"
              }`}
            >
              <amenity.Icon size={14} />
            </span>
            <span className="flex-1 truncate">{amenity.label}</span>
            <span
              aria-hidden
              className={`inline-flex size-4 items-center justify-center rounded-md border ${
                checked ? "border-primary bg-primary" : "border-border"
              }`}
            >
              {checked ? (
                <svg viewBox="0 0 12 12" className="size-3 text-primary-foreground" fill="none">
                  <path
                    d="M2.5 6.5L5 9L9.5 4"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              ) : null}
            </span>
          </button>
        )
      })}
    </div>
  )
}

export default AmenitySelector
