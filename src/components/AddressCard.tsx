import { useState } from "react"
import { Link } from "react-router"
import { Image as ImageIcon, MapPin, Users, MoreVertical, Pencil, Trash2 } from "lucide-react"

import { useRentableAddressImages } from "@/hooks/useAddresses"
import type { Address, RentableAddressDetailResponse } from "@/lib/types"

interface AddressCardProps {
  address: Address | RentableAddressDetailResponse
  isOwner?: boolean 
  onDelete?: () => void 
}

function formatPrice(value: number | null | undefined) {
  if (value === null || value === undefined) return null
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  }).format(value)
}

export function AddressCard({ address, isOwner, onDelete }: AddressCardProps) {
  const [showMenu, setShowMenu] = useState(false)
  const price = formatPrice(address.pricePerNight)
  const images = useRentableAddressImages(address.images) || []
  const cover = images[0] 
  const extraImagesCount = images.length - 1

  return (
    // 1. A raiz agora é um DIV para permitir elementos clicáveis independentes lá dentro
    <div className="group relative flex flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      
      {/* 2. O Link agora envolve apenas o conteúdo principal do card */}
      <Link
        to={`/enderecos/${address.id}`}
        aria-label={`Ver ${address.title}`}
        className="flex flex-col flex-1"
      >
        {/* Capa */}
        <div className="relative h-48 w-full overflow-hidden bg-gradient-to-br from-primary/15 via-primary/5 to-transparent">
          {cover ? (
            <img
              src={cover}
              alt={address.title}
              className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="flex h-full flex-col items-center justify-center gap-1.5 text-muted-foreground">
              <ImageIcon size={26} />
              <span className="text-xs">Sem imagem</span>
            </div>
          )}

          {/* Preço */}
          {price ? (
            <span className="absolute top-3 right-3 rounded-full border border-border bg-card/95 px-3 py-1 text-xs font-semibold shadow-sm backdrop-blur">
              {price} <span className="text-[10px] text-muted-foreground">/ noite</span>
            </span>
          ) : null}

          {/* Indicativo de fotos extras */}
          {extraImagesCount > 0 ? (
            <span className="absolute bottom-3 right-3 flex items-center gap-1 rounded-lg border border-border bg-card/90 px-2 py-0.5 text-[10px] font-medium text-muted-foreground shadow-sm backdrop-blur">
              <ImageIcon size={11} className="shrink-0" />
              <span>+{extraImagesCount}</span>
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

      {/* 🛑 3. Menu de 3 Pontos Absoluto (Só renderiza se for o Dono) */}
      {isOwner && (
        <div className="absolute top-3 left-3 z-10">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="flex size-7 items-center justify-center rounded-full border border-border bg-card/95 text-muted-foreground shadow-sm backdrop-blur transition hover:bg-secondary hover:text-foreground"
            aria-label="Opções do anúncio"
          >
            <MoreVertical size={14} />
          </button>

          {showMenu && (
            <>
              {/* Overlay invisível para fechar o menu ao clicar fora */}
              <div className="fixed inset-0 z-40" onClick={() => setShowMenu(false)} />
              
              {/* Caixa do Menu Dropdown */}
              <div className="absolute top-full left-0 mt-1 z-50 w-32 rounded-xl border border-border bg-card/95 p-1 shadow-md backdrop-blur flex flex-col">
                <Link
                  to={`/enderecos/${address.id}/editar`}
                  className="inline-flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs font-medium text-foreground hover:bg-secondary transition"
                  onClick={() => setShowMenu(false)}
                >
                  <Pencil size={12} /> Editar
                </Link>
                <button
                  onClick={() => {
                    onDelete?.()
                    setShowMenu(false)
                  }}
                  className="inline-flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs font-medium text-destructive hover:bg-destructive/10 transition text-left"
                >
                  <Trash2 size={12} /> Excluir
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}

export default AddressCard