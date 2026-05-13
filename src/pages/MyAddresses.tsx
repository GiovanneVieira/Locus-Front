import { useState } from "react"
import { Link } from "react-router"
import { Building2, Eye, Loader2, Plus, Trash2 } from "lucide-react"

import Header from "@/components/Header/Header"
import { Footer } from "@/components/Footer"
import { Breadcrumbs } from "@/components/Breadcrumbs"
import { Button } from "@/components/ui/button"
import AddressCard from "@/components/AddressCard"
import { Tooltip } from "@/components/Tooltip"
import { ConfirmDialog } from "@/components/feedback/ConfirmDialog"
import { useToast } from "@/components/feedback/ToastProvider"
import { useDeleteAddress, useMyAddresses } from "@/hooks/useAddresses"
import { useCurrentUser } from "@/hooks/useAuth"
import { isHost } from "@/lib/user"
import { ApiError } from "@/lib/api"
import type { Address } from "@/lib/types"

export default function MyAddressesPage() {
  const { data: currentUser } = useCurrentUser()
  const canPublish = isHost(currentUser)
  const { data: addresses, isLoading, error } = useMyAddresses()
  const deleteMutation = useDeleteAddress()
  const toast = useToast()

  const [pendingDelete, setPendingDelete] = useState<Address | null>(null)

  async function confirmDelete() {
    if (!pendingDelete) return
    try {
      await deleteMutation.mutateAsync(pendingDelete.id)
      toast.success("Endereço removido", `"${pendingDelete.title}" foi excluído.`)
      setPendingDelete(null)
    } catch (caught) {
      const message =
        caught instanceof ApiError ? caught.message : "Não foi possível remover agora."
      toast.error("Falha ao remover", message)
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      <main className="mx-auto max-w-7xl px-6 py-10">
        <Breadcrumbs
          items={[
            { label: "Hospedagens", href: "/enderecos" },
            { label: "Meus Hospedagens" },
          ]}
          className="mb-5"
        />

        <header className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="section-badge">
              <Building2 size={12} />
              Meu portfólio
            </span>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">
              Seus Hospedagens publicados
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
              Gerencie os imóveis que você publicou no Locus. Edite informações ou remova quando precisar.
            </p>
          </div>

          {canPublish ? (
            <Button asChild className="h-11 rounded-xl px-5 shadow-sm">
              <Link to="/enderecos/novo" className="inline-flex items-center gap-2">
                <Plus size={16} /> Publicar novo
              </Link>
            </Button>
          ) : null}
        </header>

        {!canPublish ? (
          <div className="rounded-3xl border border-amber-300 bg-amber-50 p-8 text-center text-amber-900 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-100">
            <p className="text-base font-semibold">Você ainda não é anfitrião</p>
            <p className="mt-1 text-sm">
              Para publicar imóveis no Locus, você precisa ativar o perfil de anfitrião primeiro.
            </p>
            <Button asChild className="mt-4 h-11 rounded-xl" variant="outline">
              <Link to="/tornar-anfitriao">Tornar-me anfitrião</Link>
            </Button>
          </div>
        ) : isLoading ? (
          <div className="flex items-center justify-center gap-3 rounded-3xl border border-border bg-card px-6 py-20 text-sm text-muted-foreground">
            <Loader2 size={16} className="animate-spin" />
            Buscando seus imóveis…
          </div>
        ) : error ? (
          <div
            role="alert"
            className="rounded-3xl border border-destructive/30 bg-destructive/5 px-6 py-10 text-sm text-destructive"
          >
            {error instanceof ApiError ? error.message : "Não foi possível carregar seus imóveis."}
          </div>
        ) : !addresses || addresses.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-border bg-card px-6 py-20 text-center">
            <Building2 size={28} className="mx-auto mb-3 text-muted-foreground" />
            <p className="text-base font-semibold">Você ainda não publicou nenhum endereço</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Comece pelo cadastro do primeiro — leva poucos minutos.
            </p>
            <Button asChild className="mt-4 h-11 rounded-xl">
              <Link to="/enderecos/novo">Publicar primeiro endereço</Link>
            </Button>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {addresses.map((address) => (
              <div key={address.id} className="flex flex-col gap-2">
                <AddressCard address={address} />
                <div className="flex gap-2">
                  <Button asChild variant="outline" className="h-11 flex-1 rounded-xl">
                    <Link
                      to={`/enderecos/${address.id}`}
                      className="inline-flex items-center justify-center gap-1.5"
                    >
                      <Eye size={14} /> Ver detalhes
                    </Link>
                  </Button>
                  <Tooltip label={`Remover "${address.title}"`}>
                    <Button
                      variant="outline"
                      className="h-11 rounded-xl text-destructive hover:bg-destructive/10"
                      onClick={() => setPendingDelete(address)}
                      aria-label={`Remover ${address.title}`}
                    >
                      <Trash2 size={14} />
                    </Button>
                  </Tooltip>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        onOpenChange={(open) => !open && setPendingDelete(null)}
        title="Remover este endereço?"
        description={
          pendingDelete
            ? `"${pendingDelete.title}" deixará de aparecer no catálogo. Esta ação é definitiva.`
            : ""
        }
        confirmLabel="Sim, remover"
        destructive
        loading={deleteMutation.isPending}
        onConfirm={confirmDelete}
      />
    </div>
  )
}
