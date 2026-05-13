import { useState } from "react"
import { Link, useNavigate, useParams } from "react-router"
import {
  ArrowLeft,
  BadgeCheck,
  Building2,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Globe2,
  Image as ImageIcon,
  Loader2,
  MapPin,
  Sparkles,
  Trash2,
  Users,
} from "lucide-react"

import Header from "@/components/Header/Header"
import { Footer } from "@/components/Footer"
import { Breadcrumbs } from "@/components/Breadcrumbs"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useAddress, useDeleteAddress } from "@/hooks/useAddresses"
import { useCurrentUser } from "@/hooks/useAuth"
import { formatDate } from "@/lib/user"
import { ApiError } from "@/lib/api"
import { getAmenityLabel } from "@/components/forms/AmenitySelector"
import { ConfirmDialog } from "@/components/feedback/ConfirmDialog"
import { useToast } from "@/components/feedback/ToastProvider"

function formatPrice(value: number | null | undefined) {
  if (value === null || value === undefined) return null
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  }).format(value)
}

export default function AddressDetailsPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data: address, isLoading, isError, error } = useAddress(id)
  const { data: currentUser } = useCurrentUser()
  const deleteMutation = useDeleteAddress()
  const toast = useToast()
  const [feedback, setFeedback] = useState<string | null>(null)
  const [activeImage, setActiveImage] = useState(0)
  const [confirmOpen, setConfirmOpen] = useState(false)

  const isOwner = Boolean(address && currentUser && address.ownerId === currentUser.id)

  async function handleDelete() {
    if (!address) return
    try {
      await deleteMutation.mutateAsync(address.id)
      toast.success("Endereço removido", `"${address.title}" foi excluído.`)
      navigate("/enderecos", { replace: true })
    } catch (err) {
      const message = err instanceof ApiError ? err.message : "Não foi possível remover agora."
      setFeedback(message)
      toast.error("Falha ao remover", message)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Header />
        <main className="mx-auto max-w-6xl px-6 py-12">
          <div className="flex items-center justify-center py-20">
            <Loader2 size={20} className="animate-spin text-muted-foreground" />
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (isError || !address) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Header />
        <main className="mx-auto max-w-3xl px-6 py-16 text-center">
          <h1 className="text-2xl font-semibold">Endereço não encontrado</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {(error as Error)?.message ?? "O endereço pode ter sido removido ou nunca existiu."}
          </p>
          <Button asChild className="mt-6 rounded-full px-5">
            <Link to="/enderecos">Ver outros Hospedagens</Link>
          </Button>
        </main>
        <Footer />
      </div>
    )
  }

  const price = formatPrice(address.pricePerNight)
  const images = address.imageUrls && address.imageUrls.length > 0
    ? address.imageUrls
    : address.coverImageUrl
      ? [address.coverImageUrl]
      : []
  const cover = images[activeImage]

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      <main className="mx-auto max-w-6xl px-6 py-10">
        <Breadcrumbs
          items={[
            { label: "Hospedagens", href: "/enderecos" },
            { label: address.title ?? "Detalhes" },
          ]}
          className="mb-4"
        />
        <Link
          to="/enderecos"
          className="mb-5 inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition hover:text-foreground"
        >
          <ArrowLeft size={14} /> Voltar para Hospedagens
        </Link>

        {/* Header com título */}
        <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
              {address.title}
            </h1>
            <p className="mt-1.5 inline-flex items-center gap-1.5 text-sm text-muted-foreground">
              <MapPin size={14} />
              {address.neighborhood}, {address.city} — {address.state}, {address.country}
            </p>
          </div>
          {price ? (
            <div className="rounded-2xl border border-border bg-card px-4 py-2.5 text-right shadow-sm">
              <p className="text-[11px] text-muted-foreground">A partir de</p>
              <p className="text-xl font-semibold leading-tight">{price}</p>
              <p className="text-[10px] text-muted-foreground">por noite</p>
            </div>
          ) : null}
        </div>

        {/* Galeria */}
        <section className="mb-8">
          <div className="grid gap-3 lg:grid-cols-[1.6fr_1fr]">
            <div className="relative aspect-[16/10] overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-primary/15 via-primary/5 to-transparent">
              {cover ? (
                <img src={cover} alt={address.title} className="size-full object-cover" />
              ) : (
                <div className="flex h-full flex-col items-center justify-center gap-2 text-muted-foreground">
                  <ImageIcon size={32} />
                  <span className="text-sm">Sem imagens cadastradas</span>
                </div>
              )}

              {images.length > 1 ? (
                <>
                  <button
                    type="button"
                    onClick={() =>
                      setActiveImage((current) => (current - 1 + images.length) % images.length)
                    }
                    className="absolute top-1/2 left-3 inline-flex size-10 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-card/95 text-foreground shadow-md transition hover:bg-background"
                    aria-label="Imagem anterior"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveImage((current) => (current + 1) % images.length)}
                    className="absolute top-1/2 right-3 inline-flex size-10 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-card/95 text-foreground shadow-md transition hover:bg-background"
                    aria-label="Próxima imagem"
                  >
                    <ChevronRight size={18} />
                  </button>
                </>
              ) : null}
            </div>

            {images.length > 1 ? (
              <div className="grid grid-cols-2 gap-3">
                {images.slice(0, 4).map((url, index) => (
                  <button
                    key={`${url}-${index}`}
                    type="button"
                    onClick={() => setActiveImage(index)}
                    className={`aspect-square overflow-hidden rounded-2xl border transition ${
                      activeImage === index
                        ? "border-primary ring-2 ring-primary/30"
                        : "border-border hover:border-primary/40"
                    }`}
                    aria-label={`Ver imagem ${index + 1}`}
                  >
                    <img src={url} alt={`Imagem ${index + 1}`} className="size-full object-cover" />
                  </button>
                ))}
                {images.length > 4 ? (
                  <div className="flex aspect-square items-center justify-center rounded-2xl border border-dashed border-border bg-secondary text-sm font-semibold text-muted-foreground">
                    +{images.length - 4} fotos
                  </div>
                ) : null}
              </div>
            ) : null}
          </div>
        </section>

        {/* Corpo */}
        <section className="grid gap-6 lg:grid-cols-[1.4fr_0.6fr]">
          <div className="flex flex-col gap-6">
            {/* Sobre */}
            {address.description ? (
              <article className="rounded-3xl border border-border bg-card p-6 shadow-sm">
                <h2 className="text-lg font-semibold">Sobre este lugar</h2>
                <p className="mt-2 whitespace-pre-line text-sm leading-7 text-muted-foreground">
                  {address.description}
                </p>
              </article>
            ) : null}

            {/* Amenidades */}
            {address.amenities && address.amenities.length > 0 ? (
              <article className="rounded-3xl border border-border bg-card p-6 shadow-sm">
                <h2 className="flex items-center gap-2 text-lg font-semibold">
                  <Sparkles size={16} className="text-primary" />
                  O que tem por aqui
                </h2>
                <div className="mt-4 grid gap-2 sm:grid-cols-2">
                  {address.amenities.map((amenity) => (
                    <div
                      key={amenity}
                      className="inline-flex items-center gap-2 rounded-xl border border-border bg-secondary/40 px-3 py-2 text-sm"
                    >
                      <span className="size-2 rounded-full bg-primary" />
                      {getAmenityLabel(amenity)}
                    </div>
                  ))}
                </div>
              </article>
            ) : null}

            {/* Info do endereço */}
            <article className="rounded-3xl border border-border bg-card p-6 shadow-sm">
              <h2 className="text-lg font-semibold">Informações do imóvel</h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <InfoRow icon={Building2} label="Endereço completo">
                  {address.street}, {address.number}
                  {address.complement ? ` — ${address.complement}` : ""}
                </InfoRow>
                <InfoRow icon={MapPin} label="CEP / Bairro">
                  {address.zipCode} · {address.neighborhood}
                </InfoRow>
                <InfoRow icon={Globe2} label="Cidade">
                  {address.city} — {address.state}
                </InfoRow>
                <InfoRow icon={Globe2} label="País">
                  {address.country}
                </InfoRow>
                {address.maxGuests ? (
                  <InfoRow icon={Users} label="Capacidade">
                    Até {address.maxGuests} hóspedes
                  </InfoRow>
                ) : null}
                {price ? (
                  <InfoRow icon={BadgeCheck} label="Preço por noite">
                    {price}
                  </InfoRow>
                ) : null}
                {address.availableFrom || address.availableTo ? (
                  <div className="sm:col-span-2 rounded-2xl border border-border bg-secondary/30 p-4">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <CalendarDays size={14} /> Disponibilidade
                    </div>
                    <p className="mt-1.5 text-sm">
                      {address.availableFrom ? formatDate(address.availableFrom) : "?"} →{" "}
                      {address.availableTo ? formatDate(address.availableTo) : "?"}
                    </p>
                  </div>
                ) : null}
              </div>
            </article>
          </div>

          {/* Aside */}
          <aside className="flex flex-col gap-4 rounded-3xl border border-border bg-card p-5 shadow-sm lg:sticky lg:top-24">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                Anfitrião
              </p>
              <p className="mt-1 text-base font-semibold">
                {address.ownerName ?? "Anfitrião Locus"}
              </p>
              <p className="text-xs text-muted-foreground">
                Publicado em {formatDate(address.createdAt)}
              </p>
            </div>

            <Separator />

            <Button className="rounded-xl shadow-sm">Entrar em contato</Button>

            {isOwner ? (
              <>
                <Separator />
                <div className="flex flex-col gap-2">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                    Ações do anfitrião
                  </p>
                  <Button
                    variant="destructive"
                    className="h-11 rounded-xl"
                    onClick={() => setConfirmOpen(true)}
                    disabled={deleteMutation.isPending}
                  >
                    <Trash2 size={14} />
                    {deleteMutation.isPending ? "Removendo…" : "Remover endereço"}
                  </Button>
                  {feedback ? (
                    <p className="text-xs text-destructive">{feedback}</p>
                  ) : null}
                </div>
              </>
            ) : null}
          </aside>
        </section>
      </main>

      <Footer />

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Remover este endereço?"
        description={`"${address.title}" deixará de aparecer no catálogo. Esta ação não pode ser desfeita.`}
        confirmLabel="Sim, remover"
        destructive
        loading={deleteMutation.isPending}
        onConfirm={async () => {
          await handleDelete()
          setConfirmOpen(false)
        }}
      />
    </div>
  )
}

function InfoRow({
  icon: Icon,
  label,
  children,
}: {
  icon: React.ComponentType<{ size?: number; className?: string }>
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="rounded-2xl border border-border bg-secondary/30 p-4">
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Icon size={14} /> {label}
      </div>
      <p className="mt-1 text-sm">{children}</p>
    </div>
  )
}
