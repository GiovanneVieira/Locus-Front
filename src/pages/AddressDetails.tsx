import { useState } from "react"
import { Link, useNavigate, useParams } from "react-router"
import {
  ArrowLeft,
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
  Pencil, 
  Users,
  MessageSquare,
  ShieldCheck
} from "lucide-react"

import Header from "@/components/Header/Header"
import { Footer } from "@/components/Footer"
import { Breadcrumbs } from "@/components/Breadcrumbs"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useAddress, useDeleteRentableAddress, useRentableAddressImages } from "@/hooks/useAddresses"
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
  const deleteMutation = useDeleteRentableAddress()
  const toast = useToast()
  
  const [feedback, setFeedback] = useState<string | null>(null)
  const [activeImage, setActiveImage] = useState(0)
  const [confirmOpen, setConfirmOpen] = useState(false)

  const isOwner = Boolean(address && currentUser && address.hostId === currentUser.id)
  
  const images = useRentableAddressImages(address?.images) || []
  const cover = images[activeImage]
  const price = formatPrice(address?.pricePerNight)

  console.log(`Current user id ${currentUser?.id}`)

  async function handleDelete() {
    if (!address) return
    try {
      await deleteMutation.mutateAsync(address.id)
      toast.success("Endereço removido", `"${address.title}" foi excluído.`)
      navigate("/enderecos/meus", { replace: true })
    } catch (err) {
      const message = err instanceof ApiError ? err.message : "Não foi possível remover agora."
      setFeedback(message)
      toast.error("Falha ao remover", message)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 size={28} className="animate-spin text-primary" />
        </div>
        <Footer />
      </div>
    )
  }

  if (isError || !address) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Header />
        <main className="mx-auto max-w-3xl px-6 py-24 text-center">
          <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-destructive/10 text-destructive mb-4">
            <MapPin size={24} />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">Hospedagem não encontrada</h1>
          <p className="mt-2 text-sm text-muted-foreground max-w-sm mx-auto">
            {(error as Error)?.message ?? "O anúncio pode ter sido removido pelo anfitrião ou o link está incorreto."}
          </p>
          <Button asChild className="mt-6 rounded-xl px-5 h-11">
            <Link to="/enderecos">Explorar o catálogo</Link>
          </Button>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/20">
      <Header />

      <main className="mx-auto max-w-7xl px-6 py-8">
        {/* Navegação Superior */}
        <div className="flex items-center justify-between mb-6">
          <Breadcrumbs
            items={[
              { label: "Hospedagens", href: "/enderecos" },
              { label: address.title ?? "Detalhes" },
            ]}
          />
          <Link
            to="/enderecos"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition hover:text-foreground bg-secondary/50 px-3 py-1.5 rounded-lg border border-border"
          >
            <ArrowLeft size={12} /> Voltar ao catálogo
          </Link>
        </div>

        {/* Título e Localização Principal */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl text-balance">
            {address.title}
          </h1>
          <p className="mt-2 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
            <MapPin size={15} className="text-primary" />
            {address.neighborhood ? `${address.neighborhood}, ` : ""}
            {address.city} — {address.state}, {address.country}
          </p>
        </div>

        {/* =========================================================================
            Galeria de Imagens com Efeito Transição de Fade Suave e Troca Dinâmica
            ========================================================================= */}
        <section className="mb-10">
          {images.length === 0 ? (
            <div className="flex h-[380px] w-full flex-col items-center justify-center gap-3 rounded-3xl border border-dashed border-border bg-card text-muted-foreground">
              <ImageIcon size={40} className="stroke-[1.5]" />
              <span className="text-sm font-medium">Nenhuma foto publicada para este imóvel</span>
            </div>
          ) : images.length === 1 ? (
            <div className="relative aspect-[21/9] w-full overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
              <img src={images[0]} alt={address.title} className="size-full object-cover" />
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-[1.5fr_1fr] lg:grid-cols-[1.8fr_1fr]">
              {/* Box da Imagem Ativa (Destaque Esquerdo) */}
              <div className="relative aspect-[16/10] md:aspect-auto md:h-[480px] overflow-hidden rounded-3xl border border-border bg-card shadow-sm group">
                <img 
                  key={cover} // Mudar a key força o React a re-renderizar a imagem aplicando a animação de fade
                  src={cover} 
                  alt={address.title} 
                  className="size-full object-cover transition-opacity duration-500 ease-in-out animate-in fade-in" 
                />
                
                {/* Controles internos de navegação por seta */}
                <div className="absolute inset-x-4 top-1/2 flex -translate-y-1/2 justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                  <button
                    type="button"
                    onClick={() => setActiveImage((current) => (current - 1 + images.length) % images.length)}
                    className="inline-flex size-9 items-center justify-center rounded-full border border-border bg-background/90 text-foreground shadow-md backdrop-blur-xs hover:bg-background transition"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveImage((current) => (current + 1) % images.length)}
                    className="inline-flex size-9 items-center justify-center rounded-full border border-border bg-background/90 text-foreground shadow-md backdrop-blur-xs hover:bg-background transition"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
                
                {/* Contador indicador de fotos */}
                <span className="absolute bottom-4 right-4 rounded-xl bg-background/80 px-3 py-1.5 text-xs font-semibold tracking-wider text-foreground backdrop-blur-md border border-border/40 z-10">
                  {activeImage + 1} / {images.length}
                </span>
              </div>

              {/* Grid Lateral Dinâmico: Oculta temporariamente a foto que já está em foco na esquerda */}
              <div className="grid grid-cols-2 gap-3 h-auto md:h-[480px]">
                {images
                  .map((url, origIdx) => ({ url, origIdx })) // Preserva o ID original do array de fotos
                  .filter((item) => item.origIdx !== activeImage) // Remove do grid lateral a imagem em destaque
                  .slice(0, 4) // Pega as próximas 4 imagens ordenadas
                  .map((item, gridIdx) => (
                    <button
                      key={`${item.url}-${item.origIdx}`}
                      type="button"
                      onClick={() => setActiveImage(item.origIdx)} // Restaura o índice global correto ao clicar
                      className="group relative overflow-hidden rounded-2xl border border-border hover:border-primary/50 transition-all duration-300 h-full w-full bg-secondary/10"
                    >
                      <img 
                        src={item.url} 
                        alt={`Painel lateral ${gridIdx + 1}`} 
                        className="size-full object-cover group-hover:scale-103 transition duration-500 ease-out" 
                        loading="lazy" 
                      />
                      
                      {/* Overlay com contador de fotos extras na última célula da direita */}
                      {gridIdx === 3 && images.length > 5 && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/70 font-semibold text-sm backdrop-blur-xs border border-border/10 transition group-hover:bg-background/60">
                          <span className="text-primary text-base font-bold">+{images.length - 5}</span>
                          <span className="text-[10px] text-muted-foreground uppercase tracking-wider mt-0.5">fotos disponíveis</span>
                        </div>
                      )}
                    </button>
                  ))}
              </div>
            </div>
          )}
        </section>

        {/* Corpo Principal */}
        <section className="grid gap-10 lg:grid-cols-[1.4fr_0.6fr] items-start">
          <div className="flex flex-col gap-8">
            <div className="grid grid-cols-3 gap-4 bg-card border border-border p-5 rounded-2xl shadow-sm text-center">
              <div className="flex flex-col items-center justify-center gap-1 border-r border-border">
                <Users size={18} className="text-primary/80" />
                <span className="text-xs text-muted-foreground font-medium mt-1">Capacidade</span>
                <span className="text-sm font-semibold">{address.maxGuests ? `${address.maxGuests} hóspedes` : "A combinar"}</span>
              </div>
              <div className="flex flex-col items-center justify-center gap-1 border-r border-border">
                <Building2 size={18} className="text-primary/80" />
                <span className="text-xs text-muted-foreground font-medium mt-1">Tipologia</span>
                <span className="text-sm font-semibold">Imóvel Inteiro</span>
              </div>
              <div className="flex flex-col items-center justify-center gap-1">
                <ShieldCheck size={18} className="text-primary/80" />
                <span className="text-xs text-muted-foreground font-medium mt-1">Garantia</span>
                <span className="text-sm font-semibold">Reserva Segura</span>
              </div>
            </div>

            {address.description && (
              <article className="prose prose-sm max-w-none">
                <h2 className="text-xl font-bold tracking-tight text-foreground border-b border-border pb-3">
                  Sobre a hospedagem
                </h2>
                <p className="mt-4 whitespace-pre-line text-sm leading-7 text-muted-foreground font-normal">
                  {address.description}
                </p>
              </article>
            )}

            {address.amenities && address.amenities.length > 0 && (
              <article>
                <h2 className="text-xl font-bold tracking-tight text-foreground border-b border-border pb-3 flex items-center gap-2">
                  <Sparkles size={18} className="text-primary" />
                  O que o espaço oferece
                </h2>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {address.amenities.map((amenity) => (
                    <div
                      key={amenity}
                      className="inline-flex items-center gap-3 rounded-xl border border-border bg-card/60 px-4 py-3 text-sm font-medium transition hover:bg-card"
                    >
                      <span className="size-2 rounded-full bg-primary shrink-0" />
                      {getAmenityLabel(amenity)}
                    </div>
                  ))}
                </div>
              </article>
            )}

            <article>
              <h2 className="text-xl font-bold tracking-tight text-foreground border-b border-border pb-3 mb-4">
                Localização e Logística
              </h2>
              <div className="grid gap-3 sm:grid-cols-2">
                <InfoRow icon={Building2} label="Logradouro">
                  {address.street}, {address.houseNumber}
                  {address.complement ? ` (${address.complement})` : ""}
                </InfoRow>
                <InfoRow icon={MapPin} label="Região Cadastral">
                  {address.cep} · {address.neighborhood || "Bairro não informado"}
                </InfoRow>
                <InfoRow icon={Globe2} label="Município / Estado">
                  {address.city} — {address.state}
                </InfoRow>
                <InfoRow icon={Globe2} label="País Sede">
                  {address.country}
                </InfoRow>
              </div>
            </article>
          </div>

          {/* Coluna de Ações Lateral */}
          <aside className="flex flex-col gap-5 rounded-3xl border border-border bg-card p-6 shadow-md lg:sticky lg:top-24">
            <div className="flex items-baseline justify-between">
              {price ? (
                <div>
                  <span className="text-2xl font-bold tracking-tight">{price}</span>
                  <span className="text-xs text-muted-foreground font-medium"> / noite</span>
                </div>
              ) : (
                <span className="text-lg font-semibold text-muted-foreground">Preço sob consulta</span>
              )}
              <div className="inline-flex items-center gap-1 rounded-md bg-primary/10 px-2 py-1 text-[11px] font-bold text-primary tracking-wide">
                DISPONÍVEL
              </div>
            </div>

            <Separator className="bg-border/60" />

            {address.availableFrom || address.availableTo ? (
              <div className="rounded-xl border border-border/80 bg-secondary/20 p-3.5">
                <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                  <CalendarDays size={13} className="text-primary/70" /> Intervalo Regulamentado
                </div>
                <div className="text-sm font-medium text-foreground/90 flex flex-col gap-1">
                  <div><span className="text-muted-foreground text-xs font-normal">Início:</span> {address.availableFrom ? formatDate(address.availableFrom) : "Imediato"}</div>
                  <div><span className="text-muted-foreground text-xs font-normal">Término:</span> {address.availableTo ? formatDate(address.availableTo) : "A definir"}</div>
                </div>
              </div>
            ) : null}

            <div className="bg-secondary/10 border border-border/40 rounded-xl p-4">
              <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground block">
                Anfitrião responsável
              </span>
              <p className="mt-1 text-sm font-semibold text-foreground/90">
                {address.hostName ?? "Membro Locus"}
              </p>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                Imóvel listado em {formatDate(address.createdAt)}
              </p>
            </div>
            
            <div className="flex flex-col gap-2 mt-2">
              <Button className="w-full h-11 rounded-xl font-semibold shadow-sm gap-2">
                <MessageSquare size={16} /> Solicitar reserva
              </Button>
              
              {/* Painel Exclusivo do Proprietário */}
              {isOwner && (
                <>
                  <Separator className="my-2" />
                  <div className="flex flex-col gap-2">
                    <span className="section-title text-[10px] font-bold uppercase tracking-widest text-muted-foreground block">
                      Gerenciamento do anúncio
                    </span>
                    
                    <Button asChild variant="outline" className="w-full h-10 rounded-xl text-xs font-semibold gap-1.5 hover:bg-secondary">
                      <Link to={`/enderecos/${address.id}/editar`}>
                        <Pencil size={13} />
                        Editar dados da hospedagem
                      </Link>
                    </Button>

                    <Button
                      variant="destructive"
                      className="w-full h-10 rounded-xl text-xs font-semibold gap-1.5"
                      onClick={() => setConfirmOpen(true)}
                      disabled={deleteMutation.isPending}
                    >
                      <Trash2 size={13} />
                      {deleteMutation.isPending ? "Efetuando exclusão…" : "Remover listagem do catálogo"}
                    </Button>
                    
                    {feedback && (
                      <p className="text-xs text-center font-medium text-destructive animate-pulse mt-1">{feedback}</p>
                    )}
                  </div>
                </>
              )}
            </div>
          </aside>
        </section>
      </main>

      <Footer />

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Remover esta hospedagem permanentemente?"
        description={`O anúncio "${address.title}" e todo o seu histórico operacional serão deletados do Locus de forma definitiva.`}
        confirmLabel="Confirmar exclusão"
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
    <div className="rounded-xl border border-border bg-card p-4 shadow-2xs">
      <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
        <Icon size={13} className="text-primary/70" /> {label}
      </div>
      <p className="mt-2 text-sm font-semibold text-foreground/90">{children}</p>
    </div>
  )
}