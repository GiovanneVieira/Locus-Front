import { useMemo, useState } from "react"
import { Link } from "react-router"
import { ArrowRight, Compass, Plus, Sparkles, Waves } from "lucide-react"

import Header from "@/components/Header/Header"
import { Button } from "@/components/ui/button"
import { Hero } from "@/components/Hero"
import { SectionBadge } from "@/components/SectionBadge"
import { StatCard } from "@/components/StatCard"
import { DestinationCard, DestinationCardSkeleton } from "@/components/DestinationCard"
import { FeatureCheck } from "@/components/FeatureCheck"
import { Footer } from "@/components/Footer"
import { CreateDestinationModal } from "@/components/CreateDestinationModal"
import { useDestinations } from "@/hooks/useDestinations"
import { usePexelsImagesForTerms } from "@/hooks/usePexelsImages"
import { useCurrentUser } from "@/hooks/useAuth"

const diferenciais = [
  "Leitura visual do destino antes da compra",
  "Comparação entre clima, custo e experiência",
  "Base perfeita para tour imersivo e AR",
]

const checklistProximoNivel = [
  "Cards grandes e premium",
  "Período ideal e faixa de preço",
  "Consistência total com a Home",
]

export default function Destinations() {
  const [page, setPage] = useState(0)
  const { data, isLoading } = useDestinations({ page, size: 12 })
  const { data: currentUser } = useCurrentUser()
  const isAdmin = currentUser?.role === "ROLE_ADMIN" || currentUser?.role === "ADMIN"

  const destinations = useMemo(() => data?.content ?? [], [data])
  const totalPages = data?.totalPages ?? 0

  const cityTerms = useMemo(
    () => destinations.map((d) => d.city),
    [destinations],
  )
  const cityImages = usePexelsImagesForTerms(cityTerms, 1)

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      <main className="overflow-hidden">
        <Hero
          badge={
            <SectionBadge icon={Compass} premium>
              Catálogo de destinos do Locus
            </SectionBadge>
          }
          title={
            <>
              Destinos pensados para <br />
              <span className="gradient-text">inspirar, sentir e decidir.</span>
            </>
          }
          description="Cada destino precisa parecer uma experiência real antes mesmo da compra. Aqui o usuário entende o lugar, o período ideal e o potencial da viagem com muito mais clareza."
          actions={
            <>
              <Button asChild className="rounded-full px-6">
                <Link to="/radar" className="inline-flex items-center gap-2">
                  Ver radar
                  <ArrowRight size={16} />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="rounded-full border-border bg-secondary/50 px-6 text-foreground hover:bg-secondary"
              >
                <Link to="/planejamento">Planejar viagem</Link>
              </Button>
            </>
          }
        />

        <section className="mx-auto max-w-7xl px-6 pb-20">
          <div className="grid gap-5 md:grid-cols-3">
            {diferenciais.map((item) => (
              <StatCard key={item} icone={Sparkles} descricao={item} />
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 pb-24">
          <div className="mb-8 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Waves size={18} className="text-primary" />
              <span className="text-sm font-medium text-muted-foreground">
                Seleção premium de experiências
              </span>
            </div>
            {isAdmin && <CreateDestinationModal />}
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {isLoading
              ? Array.from({ length: 6 }).map((_, i) => (
                  <DestinationCardSkeleton key={i} />
                ))
              : destinations.map((dest, i) => (
                  <DestinationCard
                    key={dest.id}
                    destination={dest}
                    gradientIndex={i}
                    coverImageUrl={cityImages[dest.city]?.[0]?.src?.landscape}
                  />
                ))}
          </div>

          {totalPages > 1 && (
            <div className="mt-8 flex items-center justify-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page === 0}
                onClick={() => setPage((p) => Math.max(0, p - 1))}
              >
                Anterior
              </Button>
              <span className="text-sm text-muted-foreground">
                {page + 1} / {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= totalPages - 1}
                onClick={() => setPage((p) => p + 1)}
              >
                Próximo
              </Button>
            </div>
          )}

          {!isLoading && destinations.length === 0 && (
            <div className="glass-card mx-auto max-w-md p-12 text-center">
              <Compass size={48} className="mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold">Nenhum destino encontrado</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Novos destinos serão adicionados em breve.
              </p>
              {isAdmin && <CreateDestinationModal className="mt-4" />}
            </div>
          )}

          <div className="glass-card mt-10 p-8">
            <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
              <div>
                <SectionBadge icon={Plus} className="mb-4">
                  Próximo nível do produto
                </SectionBadge>
                <h3 className="text-3xl font-semibold tracking-tight md:text-4xl">
                  Esta página já está pronta para receber mapas, fotos reais e
                  visualização imersiva.
                </h3>
                <p className="mt-4 max-w-2xl text-base leading-8 text-muted-foreground">
                  A base visual está forte. O próximo salto é integrar dados
                  reais de destino, pontos turísticos, clima e módulos
                  interativos para transformar isso em uma experiência ainda
                  mais memorável.
                </p>
              </div>

              <div className="grid gap-4">
                {checklistProximoNivel.map((item) => (
                  <FeatureCheck key={item} text={item} />
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}