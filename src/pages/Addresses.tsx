import { useEffect, useMemo, useState } from "react"
import { Link, useSearchParams } from "react-router"
import { Filter, Loader2, MapPin, Plus, Search, X } from "lucide-react"

import Header from "@/components/Header/Header"
import { Footer } from "@/components/Footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import AddressCard from "@/components/AddressCard"
import { useAddresses } from "@/hooks/useAddresses"
import { useCurrentUser } from "@/hooks/useAuth"
import { isHost } from "@/lib/user"

const PAGE_SIZE = 12

function useDebouncedValue<T>(value: T, delay = 350) {
  const [debounced, setDebounced] = useState(value)

  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(id)
  }, [value, delay])

  return debounced
}

export default function AddressesPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const { data: currentUser } = useCurrentUser()
  const canPublish = isHost(currentUser)

  const [query, setQuery] = useState(searchParams.get("q") ?? "")
  const [city, setCity] = useState(searchParams.get("city") ?? "")
  const [state, setState] = useState(searchParams.get("state") ?? "")
  const [country, setCountry] = useState(searchParams.get("country") ?? "")
  const [page, setPage] = useState(Number(searchParams.get("page") ?? "0"))
  const [showFilters, setShowFilters] = useState(false)

  const debouncedQuery = useDebouncedValue(query, 400)
  const debouncedCity = useDebouncedValue(city, 400)
  const debouncedState = useDebouncedValue(state, 400)
  const debouncedCountry = useDebouncedValue(country, 400)

  const params = useMemo(
    () => ({
      query: debouncedQuery || undefined,
      city: debouncedCity || undefined,
      state: debouncedState || undefined,
      country: debouncedCountry || undefined,
      page,
      size: PAGE_SIZE,
    }),
    [debouncedQuery, debouncedCity, debouncedState, debouncedCountry, page]
  )

  useEffect(() => {
    const next = new URLSearchParams()
    if (debouncedQuery) next.set("q", debouncedQuery)
    if (debouncedCity) next.set("city", debouncedCity)
    if (debouncedState) next.set("state", debouncedState)
    if (debouncedCountry) next.set("country", debouncedCountry)
    if (page > 0) next.set("page", String(page))
    setSearchParams(next, { replace: true })
  }, [debouncedQuery, debouncedCity, debouncedState, debouncedCountry, page, setSearchParams])

  const { data, isFetching, isLoading, isError, error } = useAddresses(params)
  const addresses = data?.content ?? []
  const totalPages = data?.totalPages ?? 0
  const totalElements = data?.totalElements ?? 0


  function clearFilters() {
    setQuery("")
    setCity("")
    setState("")
    setCountry("")
    setPage(0)
  }

  const hasActiveFilters = Boolean(query || city || state || country)

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      <main className="mx-auto max-w-7xl px-6 py-12">
        <section className="glass-card relative overflow-hidden p-8">
          <div className="pointer-events-none absolute inset-0">
            <div className="hero-orb top-[-60px] right-[-80px] opacity-40" />
            <div className="grid-pattern absolute inset-0 opacity-20" />
          </div>

          <div className="relative flex flex-col gap-6">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-primary">
                  <MapPin size={11} /> Descobrir
                </span>
                <h1 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">
                  Encontre o endereço certo para sua próxima viagem
                </h1>
                <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
                  Busque por cidade, estado ou país. Cada endereço é publicado por um anfitrião da comunidade Locus.
                </p>
              </div>

              {canPublish ? (
                <Button asChild className="rounded-full px-5 shadow-lg">
                  <Link to="/enderecos/novo" className="inline-flex items-center gap-2">
                    <Plus size={16} /> Publicar endereço
                  </Link>
                </Button>
              ) : null}
            </div>

            <div className="flex flex-col gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <div className="group relative flex-1 min-w-[240px]">
                  <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" />
                  <Input
                    value={query}
                    onChange={(event) => {
                      setQuery(event.target.value)
                      setPage(0)
                    }}
                    data-search-shortcut
                    placeholder="Buscar por título, bairro ou descrição"
                    className="h-12 rounded-xl border-border bg-secondary/50 pl-10 pr-12 text-sm"
                    aria-keyshortcuts="/"
                  />
                  <kbd className="pointer-events-none absolute top-1/2 right-3 hidden h-6 -translate-y-1/2 items-center rounded-md border border-border bg-card px-1.5 text-[10px] font-semibold text-muted-foreground sm:inline-flex">
                    /
                  </kbd>
                </div>

                <Button
                  variant="outline"
                  className="h-12 rounded-xl border-border bg-secondary/50 px-4"
                  onClick={() => setShowFilters((value) => !value)}
                >
                  <Filter size={14} /> Filtros
                </Button>

                {hasActiveFilters ? (
                  <Button
                    variant="ghost"
                    className="h-12 rounded-xl px-3 text-muted-foreground"
                    onClick={clearFilters}
                  >
                    <X size={14} /> Limpar
                  </Button>
                ) : null}
              </div>

              {showFilters ? (
                <div className="grid gap-3 rounded-2xl border border-border bg-secondary/50 p-4 sm:grid-cols-3">
                  <label className="flex flex-col gap-1.5">
                    <span className="text-[11px] font-medium uppercase tracking-widest text-muted-foreground">
                      Cidade
                    </span>
                    <Input
                      value={city}
                      onChange={(event) => {
                        setCity(event.target.value)
                        setPage(0)
                      }}
                      placeholder="São Paulo"
                      className="h-11 rounded-xl border-border bg-secondary/50 text-sm"
                    />
                  </label>
                  <label className="flex flex-col gap-1.5">
                    <span className="text-[11px] font-medium uppercase tracking-widest text-muted-foreground">
                      Estado
                    </span>
                    <Input
                      value={state}
                      onChange={(event) => {
                        setState(event.target.value)
                        setPage(0)
                      }}
                      placeholder="SP"
                      className="h-11 rounded-xl border-border bg-secondary/50 text-sm"
                    />
                  </label>
                  <label className="flex flex-col gap-1.5">
                    <span className="text-[11px] font-medium uppercase tracking-widest text-muted-foreground">
                      País
                    </span>
                    <Input
                      value={country}
                      onChange={(event) => {
                        setCountry(event.target.value)
                        setPage(0)
                      }}
                      placeholder="Brasil"
                      className="h-11 rounded-xl border-border bg-secondary/50 text-sm"
                    />
                  </label>
                </div>
              ) : null}
            </div>
          </div>
        </section>

        <section className="mt-10">
          <div className="mb-5 flex items-center justify-between text-sm text-muted-foreground">
            <p>
              {isLoading
                ? "Carregando Hospedagens…"
                : `${totalElements} ${totalElements === 1 ? "endereço encontrado" : "Hospedagens encontrados"}`}
            </p>
            {isFetching && !isLoading ? (
              <span className="inline-flex items-center gap-2 text-xs">
                <Loader2 className="size-3 animate-spin" /> atualizando
              </span>
            ) : null}
          </div>

          {isError ? (
            <div className="rounded-3xl border border-destructive/30 bg-destructive/10 p-6 text-sm text-destructive">
              Não foi possível carregar os Hospedagens: {(error as Error)?.message ?? "erro desconhecido"}
            </div>
          ) : isLoading ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className="h-72 animate-pulse rounded-3xl border border-border bg-secondary/50"
                />
              ))}
            </div>
          ) : addresses.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-border bg-secondary/50 p-10 text-center">
              <p className="text-base font-medium">Nenhum endereço encontrado</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Ajuste os filtros ou tente outra cidade.
              </p>
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {addresses.map((address) => (
                <AddressCard key={address.id} address={address} />
              ))}
            </div>
          )}

          {totalPages > 1 ? (
            <div className="mt-8 flex items-center justify-center gap-3">
              <Button
                variant="outline"
                className="rounded-full border-border bg-secondary/50"
                onClick={() => setPage((value) => Math.max(0, value - 1))}
                disabled={page === 0 || isFetching}
              >
                Anterior
              </Button>
              <span className="text-xs text-muted-foreground">
                página {page + 1} de {totalPages}
              </span>
              <Button
                variant="outline"
                className="rounded-full border-border bg-secondary/50"
                onClick={() => setPage((value) => Math.min(totalPages - 1, value + 1))}
                disabled={page >= totalPages - 1 || isFetching}
              >
                Próxima
              </Button>
            </div>
          ) : null}
        </section>
      </main>

      <Footer />
    </div>
  )
}