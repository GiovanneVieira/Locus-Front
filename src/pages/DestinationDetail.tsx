import { useMemo, useState } from "react"
import { useParams, Link } from "react-router"
import { ArrowLeft, Camera, MapPin, Plane, Sparkles, XIcon } from "lucide-react"

import { FlightCard } from "@/components/FlightCard"
import Header from "@/components/Header/Header"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel"
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Footer } from "@/components/Footer"
import { useDuffelFlights } from "@/hooks/useDuffelFlights"
import { useDestinationByCity, useDestinationRecommendations } from "@/hooks/useDestinations"
import { usePexelsImages, usePexelsImagesForTerms } from "@/hooks/usePexelsImages"
import type { TouristPointResponseDTO, TouristPointDTO, PexelsPhoto } from "@/lib/types"

interface NormalizedTouristPoint {
  id: string
  name: string
  description: string
  category: string
}

function normalizeTouristPoint(
  point: TouristPointResponseDTO | TouristPointDTO,
  index: number,
): NormalizedTouristPoint {
  if ("nome" in point) {
    return {
      id: `ai-${index}`,
      name: point.nome,
      description: point.descricao,
      category: point.categoria,
    }
  }
  return point as TouristPointResponseDTO
}

const CATEGORY_COLORS: Record<string, string> = {
  História: "bg-amber-500/80 text-white",
  Cultura: "bg-purple-500/80 text-white",
  Natureza: "bg-emerald-500/80 text-white",
  Gastronomia: "bg-rose-500/80 text-white",
  Entretenimento: "bg-sky-500/80 text-white",
  Religioso: "bg-indigo-500/80 text-white",
  Arquitetura: "bg-orange-500/80 text-white",
}

function getCategoryColor(category: string) {
  return CATEGORY_COLORS[category] ?? "bg-white/20 text-white"
}

function FlightSearchSkeleton() {
  return (
    <div className="grid gap-3 lg:grid-cols-2">
      {Array.from({ length: 4 }).map((_, index) => (
        <div
          key={index}
          className="rounded-[24px] border border-white/10 bg-zinc-950/70 p-5"
        >
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Skeleton className="size-10 rounded-full bg-white/10" />
              <div className="space-y-2">
                <Skeleton className="h-3 w-28 rounded-full bg-white/10" />
                <Skeleton className="h-2 w-20 rounded-full bg-white/10" />
              </div>
            </div>
            <Skeleton className="h-6 w-24 rounded-full bg-white/10" />
          </div>
          <div className="mt-6 grid grid-cols-[1fr_auto_1fr] items-center gap-4">
            <div className="space-y-2">
              <Skeleton className="h-7 w-16 rounded-full bg-white/10" />
              <Skeleton className="h-3 w-24 rounded-full bg-white/10" />
            </div>
            <Skeleton className="h-px w-16 bg-white/10" />
            <div className="ml-auto space-y-2">
              <Skeleton className="ml-auto h-7 w-16 rounded-full bg-white/10" />
              <Skeleton className="h-3 w-24 rounded-full bg-white/10" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default function DestinationDetailPage() {
  const { city } = useParams<{ city: string }>()
  const decodedCity = city ? decodeURIComponent(city) : ""

  const { data: destination, isLoading: loadingDest } = useDestinationByCity(decodedCity)
  const { data: aiData, isLoading: loadingAI } = useDestinationRecommendations(decodedCity)
  const { data: pexelsData } = usePexelsImages(decodedCity, 8)
  const {
    data: flights = [],
    errorMessage: flightsErrorMessage,
    isFetching: loadingFlights,
    originCity,
    originInput,
    originStatus,
    setOriginInput,
    submitManualOrigin,
  } = useDuffelFlights(decodedCity)

  const touristPoints = useMemo(() => {
    const allPoints = [
      ...(destination?.touristPoints ?? []),
      ...(aiData?.pontosTuristicos ?? []),
    ]
    return allPoints.map((p, i) => normalizeTouristPoint(p, i))
  }, [destination, aiData])

  const pointSearchTerms = useMemo(
    () => touristPoints.map((p) => `${p.name} ${decodedCity}`),
    [touristPoints, decodedCity],
  )
  const pointImagesMap = usePexelsImagesForTerms(pointSearchTerms, 5)

  const photos = pexelsData?.photos ?? []
  const country = destination?.country ?? aiData?.pais ?? ""

  const [lightbox, setLightbox] = useState<{ photos: PexelsPhoto[]; index: number } | null>(null)

  const isLoading = loadingDest && !destination

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      <main className="mx-auto max-w-7xl px-6 pb-24 pt-8">
        <Link
          to="/destinos"
          className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft size={16} />
          Voltar ao catálogo
        </Link>

        {isLoading ? (
          <div className="mt-6 space-y-6">
            <Skeleton className="h-12 w-64" />
            <Skeleton className="h-6 w-40" />
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-64 rounded-[28px]" />
              ))}
            </div>
          </div>
        ) : (
          <>
            <div className="mt-6">
              <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">
                {decodedCity}
              </h1>
              {country && (
                <p className="mt-2 text-lg text-muted-foreground">{country}</p>
              )}
            </div>

            {photos.length > 0 && (
              <section className="mt-10">
                <div className="mb-4 flex items-center gap-2">
                  <Camera size={20} className="text-primary" />
                  <h2 className="text-2xl font-semibold">Galeria</h2>
                  <span className="text-sm text-muted-foreground">
                    {photos.length} fotos
                  </span>
                </div>
                <Carousel
                  opts={{ align: "start", loop: true }}
                  className="w-full"
                >
                  <CarouselContent>
                    {photos.map((photo, i) => (
                      <CarouselItem key={photo.id} className="basis-1/2 md:basis-1/3 lg:basis-1/4">
                        <button
                          type="button"
                          onClick={() => setLightbox({ photos, index: i })}
                          className="group/img relative block overflow-hidden rounded-[20px] focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                          <img
                            src={photo.src.landscape}
                            alt={photo.alt || `${decodedCity} foto`}
                            loading="lazy"
                            className="h-56 w-full object-cover transition-transform duration-300 group-hover/img:scale-105"
                          />
                          {photo.photographer && (
                            <span className="absolute bottom-2 left-2 rounded-full bg-black/50 px-2 py-0.5 text-[10px] text-white/80 backdrop-blur">
                              {photo.photographer}
                            </span>
                          )}
                        </button>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious />
                  <CarouselNext />
                </Carousel>
              </section>
            )}

            {touristPoints.length > 0 && (
              <section className="mt-14">
                <div className="mb-6 flex items-center gap-2">
                  <Sparkles size={20} className="text-primary" />
                  <h2 className="text-2xl font-semibold">Pontos turísticos</h2>
                  <span className="text-sm text-muted-foreground">
                    {touristPoints.length} pontos
                  </span>
                </div>

                <Carousel
                  opts={{ align: "start", loop: false }}
                  className="w-full"
                >
                  <CarouselContent className="-ml-4">
                    {touristPoints.map((point, i) => {
                      const images = pointImagesMap[pointSearchTerms[i]] ?? []
                      const cover = images[0]
                      const remaining = Math.max(0, images.length - 1)

                      return (
                        <CarouselItem key={point.id} className="pl-4 basis-full md:basis-1/2 lg:basis-1/3">
                          <button
                            type="button"
                            onClick={() => {
                              if (images.length > 0) {
                                setLightbox({ photos: images, index: 0 })
                              }
                            }}
                            className="group/point relative block h-80 w-full overflow-hidden rounded-[20px] text-left focus:outline-none focus:ring-2 focus:ring-primary"
                          >
                            {cover ? (
                              <img
                                src={cover.src.landscape}
                                alt={point.name}
                                loading="lazy"
                                className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover/point:scale-110"
                              />
                            ) : (
                              <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-primary/10 to-transparent" />
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                            {remaining > 0 && (
                              <span className="absolute top-3 right-3 inline-flex items-center gap-1 rounded-full bg-black/50 px-2.5 py-1 text-xs font-medium text-white backdrop-blur">
                                <Camera size={12} />
                                +{remaining} fotos
                              </span>
                            )}
                            <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
                              <Badge
                                className={`mb-2 border-0 ${getCategoryColor(point.category)}`}
                              >
                                {point.category}
                              </Badge>
                              <h3 className="text-xl font-semibold drop-shadow-lg">
                                {point.name}
                              </h3>
                              {point.description && (
                                <p className="mt-1 line-clamp-2 text-sm text-white/80">
                                  {point.description}
                                </p>
                              )}
                            </div>
                          </button>
                        </CarouselItem>
                      )
                    })}
                  </CarouselContent>
                  <CarouselPrevious className="-left-12" />
                  <CarouselNext className="-right-12" />
                </Carousel>
              </section>
            )}

            <section className="mt-14 overflow-hidden rounded-[32px] border border-white/10 bg-gradient-to-br from-zinc-950 via-zinc-950/95 to-black p-6 shadow-2xl shadow-black/30 md:p-8">
              <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
                <div>
                  <div className="mb-3 flex items-center gap-2">
                    <Plane size={20} className="text-primary" />
                    <h2 className="text-2xl font-semibold">Passagens Aéreas Encontradas</h2>
                  </div>
                  <p className="max-w-2xl text-sm text-white/55">
                    Buscamos voos reais em modo de teste saindo da sua cidade para {decodedCity}.
                  </p>
                  {originCity && (
                    <p className="mt-2 text-xs text-white/40">
                      Origem considerada: <span className="text-white/70">{originCity}</span>
                    </p>
                  )}
                </div>

                {originStatus === "manual" && !originCity && (
                  <form
                    className="flex w-full flex-col gap-2 md:max-w-sm"
                    onSubmit={(event) => {
                      event.preventDefault()
                      submitManualOrigin()
                    }}
                  >
                    <label className="text-xs font-medium text-white/60" htmlFor="flight-origin-city">
                      De qual cidade você vai sair?
                    </label>
                    <div className="flex gap-2">
                      <Input
                        id="flight-origin-city"
                        value={originInput}
                        onChange={(event) => setOriginInput(event.target.value)}
                        placeholder="Ex: São Paulo"
                        className="h-10 rounded-full border-white/10 bg-white/[0.04] px-4 text-sm text-white placeholder:text-white/30"
                      />
                      <Button type="submit" className="h-10 rounded-full px-4">
                        Buscar
                      </Button>
                    </div>
                  </form>
                )}
              </div>

              {originStatus === "detecting" || loadingFlights ? (
                <div className="mt-7">
                  <FlightSearchSkeleton />
                </div>
              ) : flightsErrorMessage ? (
                <div className="mt-7 rounded-[24px] border border-amber-400/20 bg-amber-400/10 p-5 text-sm text-amber-100">
                  {flightsErrorMessage.includes("Nenhum aeroporto")
                    ? "Não encontramos um aeroporto compatível para uma das cidades informadas. Tente uma cidade maior próxima."
                    : flightsErrorMessage}
                </div>
              ) : flights.length > 0 ? (
                <div className="mt-7 grid gap-4 lg:grid-cols-2">
                  {flights.map((offer) => (
                    <FlightCard key={offer.id} offer={offer} />
                  ))}
                </div>
              ) : originCity ? (
                <div className="mt-7 rounded-[24px] border border-white/10 bg-white/[0.03] p-5 text-sm text-white/55">
                  Nenhuma oferta disponível para este destino no momento.
                </div>
              ) : null}
            </section>

            {!loadingAI && !loadingDest && touristPoints.length === 0 && photos.length === 0 && (
              <div className="mt-14 glass-card p-12 text-center">
                <MapPin size={48} className="mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold">Dados em breve</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  As informações sobre {decodedCity} serão carregadas assim que disponíveis.
                </p>
              </div>
            )}
          </>
        )}
      </main>

      {lightbox && lightbox.photos[lightbox.index] && (
        <Dialog open={lightbox !== null} onOpenChange={(open) => { if (!open) setLightbox(null) }}>
          <DialogContent className="sm:max-w-4xl p-2 bg-black/95 border-0" showCloseButton={false}>
            <DialogTitle className="sr-only">Visualização de imagem</DialogTitle>
            <DialogDescription className="sr-only">Foto de {decodedCity}</DialogDescription>
            <button
              type="button"
              onClick={() => setLightbox(null)}
              className="absolute top-3 right-3 z-10 rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20"
            >
              <XIcon size={20} />
            </button>
            <img
              src={lightbox.photos[lightbox.index].src.large2x}
              alt={lightbox.photos[lightbox.index].alt || `${decodedCity} foto`}
              className="max-h-[85vh] w-full rounded-lg object-contain"
            />
            {lightbox.photos[lightbox.index].photographer && (
              <p className="mt-2 text-center text-xs text-white/60">
                Foto por {lightbox.photos[lightbox.index].photographer} — Pexels
              </p>
            )}
            <div className="mt-3 flex items-center justify-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={lightbox.index === 0}
                onClick={() => setLightbox({ ...lightbox, index: lightbox.index - 1 })}
              >
                Anterior
              </Button>
              <span className="text-xs text-white/60">
                {lightbox.index + 1} / {lightbox.photos.length}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={lightbox.index >= lightbox.photos.length - 1}
                onClick={() => setLightbox({ ...lightbox, index: lightbox.index + 1 })}
              >
                Próximo
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      <Footer />
    </div>
  )
}
