import { useState } from "react"
import { Link } from "react-router"
import { ArrowRight, Globe, MapPinned } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

import type { DestinationResponseDTO } from "@/lib/types"

const GRADIENTS = [
  "bg-[linear-gradient(145deg,rgba(98,120,255,.72),rgba(113,76,255,.32),rgba(255,255,255,.02))]",
  "bg-[linear-gradient(145deg,rgba(34,197,255,.62),rgba(99,102,241,.34),rgba(255,255,255,.02))]",
  "bg-[linear-gradient(145deg,rgba(255,132,84,.62),rgba(124,58,237,.24),rgba(255,255,255,.02))]",
  "bg-[linear-gradient(145deg,rgba(56,189,248,.55),rgba(168,85,247,.24),rgba(255,255,255,.02))]",
  "bg-[linear-gradient(145deg,rgba(16,185,129,.55),rgba(59,130,246,.24),rgba(255,255,255,.02))]",
  "bg-[linear-gradient(145deg,rgba(244,114,182,.52),rgba(99,102,241,.24),rgba(255,255,255,.02))]",
] as const

interface DestinationCardProps {
  destination: DestinationResponseDTO
  gradientIndex?: number
  coverImageUrl?: string
}

export const DestinationCard = ({
  destination,
  gradientIndex = 0,
  coverImageUrl,
}: DestinationCardProps) => {
  const [imgError, setImgError] = useState(false)
  const gradient = GRADIENTS[gradientIndex % GRADIENTS.length]
  const showImage = coverImageUrl && !imgError

  return (
    <article className="glass-card group overflow-hidden p-5">
      <Link to={`/destinos/${encodeURIComponent(destination.city)}`} className="block">
        <div className="relative h-72 overflow-hidden rounded-[28px]">
          {showImage && (
            <img
              src={coverImageUrl}
              alt={destination.city}
              loading="lazy"
              onError={() => setImgError(true)}
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          )}
          <div
            className={`absolute inset-0 ${
              showImage
                ? "bg-gradient-to-t from-black/70 via-black/20 to-transparent"
                : gradient
            }`}
          />
          <div className="relative z-10 flex h-full flex-col justify-between p-5">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-black/25 px-4 py-2 text-xs font-medium text-white/90 backdrop-blur">
                <Globe size={12} />
                {destination.country}
              </span>
            </div>
            <div>
              <h3 className="text-3xl font-semibold text-white drop-shadow-lg">
                {destination.city}
              </h3>
              {destination.touristPoints.length > 0 && (
                <p className="mt-2 text-sm text-white/80">
                  {destination.touristPoints.length} pontos turísticos
                </p>
              )}
            </div>
          </div>
        </div>
      </Link>
      <div className="mt-5 flex items-center justify-between">
        <span className="inline-flex items-center gap-2 text-sm text-muted-foreground">
          <MapPinned size={16} />
          Tour visual e leitura de viagem
        </span>
        <Link
          to={`/destinos/${encodeURIComponent(destination.city)}`}
          className="inline-flex items-center gap-2 text-sm font-medium text-foreground transition-transform group-hover:translate-x-1"
        >
          Explorar <ArrowRight size={16} />
        </Link>
      </div>
    </article>
  )
}

export const DestinationCardSkeleton = () => (
  <article className="glass-card overflow-hidden p-5">
    <Skeleton className="h-72 rounded-[28px]" />
    <div className="mt-5 flex items-center justify-between">
      <Skeleton className="h-4 w-40" />
      <Skeleton className="h-4 w-20" />
    </div>
  </article>
)