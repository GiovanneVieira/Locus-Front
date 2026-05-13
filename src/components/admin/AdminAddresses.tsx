import { useEffect, useMemo, useState } from "react"
import { Link } from "react-router"
import {
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Loader2,
  MapPin,
  Search,
  Trash2,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAdminAddresses, useDeleteAddressAsAdmin } from "@/hooks/useAdmin"
import { ApiError } from "@/lib/api"
import type { Address } from "@/lib/types"
import { formatDate } from "@/lib/user"

const PAGE_SIZE = 10

function useDebouncedValue<T>(value: T, delay = 350) {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(id)
  }, [value, delay])
  return debounced
}

function formatPrice(value: number | null | undefined) {
  if (value === null || value === undefined) return "—"
  try {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value)
  } catch {
    return String(value)
  }
}

export default function AdminAddresses() {
  const [query, setQuery] = useState("")
  const [city, setCity] = useState("")
  const [page, setPage] = useState(0)
  const [feedback, setFeedback] = useState<{ type: "ok" | "err"; message: string } | null>(null)

  const debouncedQuery = useDebouncedValue(query)
  const debouncedCity = useDebouncedValue(city)

  const params = useMemo(
    () => ({
      query: debouncedQuery || undefined,
      city: debouncedCity || undefined,
      page,
      size: PAGE_SIZE,
    }),
    [debouncedQuery, debouncedCity, page]
  )

  useEffect(() => {
    setPage(0)
  }, [debouncedQuery, debouncedCity])

  const { data, isLoading, isFetching, isError, error, refetch } = useAdminAddresses(params)
  const deleteAddress = useDeleteAddressAsAdmin()

  const addresses = data?.content ?? []
  const totalPages = data?.totalPages ?? 0
  const totalElements = data?.totalElements ?? 0

  async function handleDelete(address: Address) {
    const confirmed = window.confirm(
      `Remover o endereço "${address.title}"? Esta ação não pode ser desfeita.`
    )
    if (!confirmed) return

    setFeedback(null)
    try {
      await deleteAddress.mutateAsync(address.id)
      setFeedback({ type: "ok", message: `"${address.title}" foi removido.` })
    } catch (err) {
      setFeedback({
        type: "err",
        message: err instanceof ApiError ? err.message : "Não foi possível remover agora.",
      })
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-4 rounded-3xl border border-border bg-secondary/50 p-5 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="text-lg font-semibold tracking-tight">Moderação de Hospedagens</h2>
          <p className="text-sm text-muted-foreground">
            Visualize todos os imóveis e remova publicações que violem as regras.
          </p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row">
          <div className="relative">
            <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Buscar por título"
              className="w-full rounded-full border-border bg-secondary/50 pl-9 sm:w-56"
            />
          </div>
          <div className="relative">
            <MapPin className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={city}
              onChange={(event) => setCity(event.target.value)}
              placeholder="Cidade"
              className="w-full rounded-full border-border bg-secondary/50 pl-9 sm:w-44"
            />
          </div>
        </div>
      </div>

      {feedback ? (
        <div
          className={`rounded-2xl border px-4 py-3 text-sm ${
            feedback.type === "ok"
              ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-200"
              : "border-destructive/40 bg-destructive/10 text-destructive"
          }`}
        >
          {feedback.message}
        </div>
      ) : null}

      {isError ? (
        <div className="rounded-3xl border border-destructive/30 bg-destructive/5 p-6 text-sm text-destructive">
          <p className="font-semibold">Não foi possível carregar os Hospedagens.</p>
          <p className="mt-1 text-xs opacity-90">
            {(error as Error)?.message ?? "Tente novamente em instantes."}
          </p>
          <Button variant="outline" size="sm" className="mt-3" onClick={() => void refetch()}>
            Tentar novamente
          </Button>
        </div>
      ) : null}

      <div className="overflow-hidden rounded-3xl border border-border bg-secondary/50">
        <div className="flex items-center justify-between border-b border-border px-5 py-3 text-xs text-muted-foreground">
          <span>
            {isLoading
              ? "Carregando…"
              : `${totalElements} endereço${totalElements === 1 ? "" : "s"}`}
          </span>
          {isFetching && !isLoading ? (
            <span className="inline-flex items-center gap-1.5">
              <Loader2 className="size-3 animate-spin" /> Atualizando…
            </span>
          ) : null}
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-16 text-muted-foreground">
            <Loader2 className="mr-2 size-5 animate-spin text-primary" /> Carregando Hospedagens…
          </div>
        ) : addresses.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 py-16 text-sm text-muted-foreground">
            <MapPin className="size-6 opacity-70" />
            Nenhum endereço encontrado.
          </div>
        ) : (
          <ul className="divide-y divide-white/5">
            {addresses.map((address) => {
              const busy = deleteAddress.isPending && deleteAddress.variables === address.id
              return (
                <li
                  key={address.id}
                  className="flex flex-col gap-4 px-5 py-4 md:flex-row md:items-center md:justify-between"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    {address.coverImageUrl ? (
                      <img
                        src={address.coverImageUrl}
                        alt={address.title}
                        className="size-14 shrink-0 rounded-xl border border-border object-cover"
                      />
                    ) : (
                      <span className="flex size-14 shrink-0 items-center justify-center rounded-xl border border-border bg-secondary text-muted-foreground">
                        <MapPin size={20} />
                      </span>
                    )}
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-foreground">{address.title}</p>
                      <p className="truncate text-xs text-muted-foreground">
                        {address.city}, {address.state} · {address.country}
                      </p>
                      <p className="mt-0.5 text-[11px] text-muted-foreground/80">
                        {address.ownerName ? `Por ${address.ownerName} · ` : ""}
                        Publicado em {formatDate(address.createdAt)} ·{" "}
                        {formatPrice(address.pricePerNight)}/noite
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <Button
                      asChild
                      size="sm"
                      variant="outline"
                      className="gap-1.5 rounded-full border-border px-3 text-xs"
                    >
                      <Link to={`/enderecos/${address.id}`}>
                        <ExternalLink size={12} /> Ver detalhes
                      </Link>
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={busy}
                      onClick={() => void handleDelete(address)}
                      className="gap-1.5 rounded-full border-destructive/40 px-3 text-xs text-destructive hover:bg-destructive/10"
                    >
                      {busy ? (
                        <>
                          <Loader2 size={12} className="animate-spin" /> Removendo…
                        </>
                      ) : (
                        <>
                          <Trash2 size={12} /> Remover
                        </>
                      )}
                    </Button>
                  </div>
                </li>
              )
            })}
          </ul>
        )}

        {totalPages > 1 ? (
          <div className="flex items-center justify-between border-t border-border px-5 py-3 text-xs text-muted-foreground">
            <span>
              Página {page + 1} de {totalPages}
            </span>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                disabled={page === 0}
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                className="gap-1 rounded-full border-border px-3"
              >
                <ChevronLeft size={14} /> Anterior
              </Button>
              <Button
                size="sm"
                variant="outline"
                disabled={page + 1 >= totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="gap-1 rounded-full border-border px-3"
              >
                Próxima <ChevronRight size={14} />
              </Button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  )
}