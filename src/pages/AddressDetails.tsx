import { Link, useNavigate, useParams } from "react-router"
import {
  ArrowLeft, BadgeCheck, Building2, Globe2, MapPin, Trash2, Users,
} from "lucide-react"

import Header from "@/components/Header/Header"
import { Footer } from "@/components/Footer"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useAddress, useDeleteAddress } from "@/hooks/useAddresses"
import { useCurrentUser } from "@/hooks/useAuth"
import { formatDate } from "@/lib/user"
import { ApiError } from "@/lib/api"
import { useState } from "react"

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
  const [feedback, setFeedback] = useState<string | null>(null)

  const isOwner = Boolean(
    address && currentUser && address.ownerId === currentUser.id
  )

  async function handleDelete() {
    if (!address) return
    const confirmed = window.confirm(
      "Tem certeza que deseja remover este endereço? Esta ação não pode ser desfeita."
    )
    if (!confirmed) return

    try {
      await deleteMutation.mutateAsync(address.id)
      navigate("/enderecos", { replace: true })
    } catch (err) {
      const message =
        err instanceof ApiError ? err.message : "Não foi possível remover agora."
      setFeedback(message)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Header />
        <main className="mx-auto max-w-5xl px-6 py-12">
          <div className="h-80 animate-pulse rounded-3xl border border-white/5 bg-white/5" />
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
            <Link to="/enderecos">Ver outros endereços</Link>
          </Button>
        </main>
        <Footer />
      </div>
    )
  }

  const price = formatPrice(address.pricePerNight)

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      <main className="mx-auto max-w-5xl px-6 py-12">
        <Link
          to="/enderecos"
          className="mb-6 inline-flex items-center gap-2 text-xs font-medium text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft size={14} /> Voltar para endereços
        </Link>

        <section className="glass-card overflow-hidden p-0">
          <div
            className="relative h-64 w-full bg-gradient-to-br from-primary/30 via-primary/10 to-transparent md:h-80"
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
            <div className="absolute inset-0 bg-gradient-to-t from-background/85 via-background/10 to-transparent" />
            <div className="absolute bottom-5 left-5 right-5 flex flex-wrap items-end justify-between gap-3">
              <div>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-primary backdrop-blur">
                  <MapPin size={11} /> Localização
                </span>
                <h1 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">
                  {address.title}
                </h1>
                <p className="mt-1 inline-flex items-center gap-1.5 text-sm text-muted-foreground">
                  <MapPin size={14} /> {address.neighborhood}, {address.city} — {address.state}, {address.country}
                </p>
              </div>
              {price ? (
                <div className="rounded-2xl border border-white/10 bg-background/70 px-4 py-3 text-right backdrop-blur">
                  <p className="text-xs text-muted-foreground">A partir de</p>
                  <p className="text-xl font-semibold">{price}</p>
                  <p className="text-[10px] text-muted-foreground">por noite</p>
                </div>
              ) : null}
            </div>
          </div>

          <div className="grid gap-8 p-8 md:grid-cols-[1.4fr_0.6fr]">
            <div className="flex flex-col gap-6">
              {address.description ? (
                <div>
                  <h2 className="text-lg font-semibold">Sobre este lugar</h2>
                  <p className="mt-2 whitespace-pre-line text-sm leading-6 text-muted-foreground">
                    {address.description}
                  </p>
                </div>
              ) : null}

              <div className="grid gap-3 sm:grid-cols-2">
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
              </div>
            </div>

            <aside className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-white/5 p-5">
              <div>
                <p className="text-xs uppercase tracking-widest text-muted-foreground">
                  Anfitrião
                </p>
                <p className="mt-1 text-base font-semibold">
                  {address.ownerName ?? "Anfitrião Locus"}
                </p>
                <p className="text-xs text-muted-foreground">
                  Publicado em {formatDate(address.createdAt)}
                </p>
              </div>

              <Separator className="bg-white/10" />

              <Button className="rounded-full shadow-lg">Entrar em contato</Button>

              {isOwner ? (
                <>
                  <Separator className="bg-white/10" />
                  <div className="flex flex-col gap-2">
                    <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
                      Ações do anfitrião
                    </p>
                    <Button
                      variant="destructive"
                      className="rounded-full"
                      onClick={handleDelete}
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
          </div>
        </section>
      </main>

      <Footer />
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
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Icon size={14} /> {label}
      </div>
      <p className="mt-1 text-sm">{children}</p>
    </div>
  )
}