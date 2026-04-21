import { useState } from "react"
import { Link, useNavigate } from "react-router"
import { useForm } from "@tanstack/react-form"
import { ArrowLeft, MapPin, Save } from "lucide-react"

import Header from "@/components/Header/Header"
import { Footer } from "@/components/Footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { useCreateAddress } from "@/hooks/useAddresses"
import { ApiError } from "@/lib/api"
import type { CreateAddressPayload } from "@/lib/types"

const defaultValues = {
  title: "",
  description: "",
  street: "",
  number: "",
  complement: "",
  neighborhood: "",
  city: "",
  state: "",
  country: "Brasil",
  zipCode: "",
  pricePerNight: "",
  maxGuests: "",
  coverImageUrl: "",
}

function requireText(value: string, fieldLabel: string) {
  if (!value || !value.trim()) return `${fieldLabel} é obrigatório`
  return undefined
}

export default function NewAddressPage() {
  const navigate = useNavigate()
  const createMutation = useCreateAddress()
  const [feedback, setFeedback] = useState<string | null>(null)

  const form = useForm({
    defaultValues,
    onSubmit: async ({ value }) => {
      setFeedback(null)

      const payload: CreateAddressPayload = {
        title: value.title.trim(),
        description: value.description.trim() || null,
        street: value.street.trim(),
        number: value.number.trim(),
        complement: value.complement.trim() || null,
        neighborhood: value.neighborhood.trim(),
        city: value.city.trim(),
        state: value.state.trim(),
        country: value.country.trim(),
        zipCode: value.zipCode.trim(),
        pricePerNight: value.pricePerNight ? Number(value.pricePerNight) : null,
        maxGuests: value.maxGuests ? Number(value.maxGuests) : null,
        coverImageUrl: value.coverImageUrl.trim() || null,
      }

      try {
        const created = await createMutation.mutateAsync(payload)
        navigate(`/enderecos/${created.id}`, { replace: true })
      } catch (error) {
        const message =
          error instanceof ApiError ? error.message : "Não foi possível publicar o endereço agora."
        setFeedback(message)
      }
    },
  })

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      <main className="mx-auto max-w-4xl px-6 py-12">
        <Link
          to="/enderecos"
          className="mb-6 inline-flex items-center gap-2 text-xs font-medium text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft size={14} /> Voltar para endereços
        </Link>

        <section className="glass-card relative overflow-hidden p-8">
          <div className="pointer-events-none absolute inset-0">
            <div className="hero-orb top-[-40px] right-[-80px] opacity-30" />
            <div className="grid-pattern absolute inset-0 opacity-20" />
          </div>

          <div className="relative flex flex-col gap-6">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-primary">
                <MapPin size={11} /> Novo endereço
              </span>
              <h1 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">
                Publique um novo lugar para hospedar
              </h1>
              <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
                Preencha as informações com cuidado — elas aparecem nos resultados de busca para os usuários.
              </p>
            </div>

            <Separator className="bg-white/10" />

            <form
              className="flex flex-col gap-6"
              onSubmit={(event) => {
                event.preventDefault()
                form.handleSubmit()
              }}
            >
              <div className="grid gap-4 md:grid-cols-2">
                <form.Field
                  name="title"
                  validators={{ onChange: ({ value }) => requireText(value, "Título") }}
                >
                  {(field) => (
                    <FormField label="Título *" error={field.state.meta.errors[0]}>
                      <Input
                        value={field.state.value}
                        onChange={(event) => field.handleChange(event.target.value)}
                        placeholder="Loft moderno em Pinheiros"
                        className="h-11 rounded-xl border-white/10 bg-white/5 text-sm"
                      />
                    </FormField>
                  )}
                </form.Field>

                <form.Field name="coverImageUrl">
                  {(field) => (
                    <FormField label="URL da imagem de capa">
                      <Input
                        value={field.state.value}
                        onChange={(event) => field.handleChange(event.target.value)}
                        placeholder="https://..."
                        className="h-11 rounded-xl border-white/10 bg-white/5 text-sm"
                      />
                    </FormField>
                  )}
                </form.Field>
              </div>

              <form.Field name="description">
                {(field) => (
                  <FormField label="Descrição">
                    <Textarea
                      value={field.state.value}
                      onChange={(event) => field.handleChange(event.target.value)}
                      rows={4}
                      placeholder="Conte o que torna esse lugar único, estilo, vizinhança e pontos próximos."
                    />
                  </FormField>
                )}
              </form.Field>

              <div className="grid gap-4 md:grid-cols-[1.5fr_0.5fr_1fr]">
                <form.Field
                  name="street"
                  validators={{ onChange: ({ value }) => requireText(value, "Rua") }}
                >
                  {(field) => (
                    <FormField label="Rua *" error={field.state.meta.errors[0]}>
                      <Input
                        value={field.state.value}
                        onChange={(event) => field.handleChange(event.target.value)}
                        placeholder="Rua Harmonia"
                        className="h-11 rounded-xl border-white/10 bg-white/5 text-sm"
                      />
                    </FormField>
                  )}
                </form.Field>
                <form.Field
                  name="number"
                  validators={{ onChange: ({ value }) => requireText(value, "Número") }}
                >
                  {(field) => (
                    <FormField label="Número *" error={field.state.meta.errors[0]}>
                      <Input
                        value={field.state.value}
                        onChange={(event) => field.handleChange(event.target.value)}
                        placeholder="123"
                        className="h-11 rounded-xl border-white/10 bg-white/5 text-sm"
                      />
                    </FormField>
                  )}
                </form.Field>
                <form.Field name="complement">
                  {(field) => (
                    <FormField label="Complemento">
                      <Input
                        value={field.state.value}
                        onChange={(event) => field.handleChange(event.target.value)}
                        placeholder="Apto 42, bloco B"
                        className="h-11 rounded-xl border-white/10 bg-white/5 text-sm"
                      />
                    </FormField>
                  )}
                </form.Field>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <form.Field
                  name="neighborhood"
                  validators={{ onChange: ({ value }) => requireText(value, "Bairro") }}
                >
                  {(field) => (
                    <FormField label="Bairro *" error={field.state.meta.errors[0]}>
                      <Input
                        value={field.state.value}
                        onChange={(event) => field.handleChange(event.target.value)}
                        placeholder="Pinheiros"
                        className="h-11 rounded-xl border-white/10 bg-white/5 text-sm"
                      />
                    </FormField>
                  )}
                </form.Field>
                <form.Field
                  name="zipCode"
                  validators={{ onChange: ({ value }) => requireText(value, "CEP") }}
                >
                  {(field) => (
                    <FormField label="CEP *" error={field.state.meta.errors[0]}>
                      <Input
                        value={field.state.value}
                        onChange={(event) => field.handleChange(event.target.value)}
                        placeholder="05435-000"
                        className="h-11 rounded-xl border-white/10 bg-white/5 text-sm"
                      />
                    </FormField>
                  )}
                </form.Field>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <form.Field
                  name="city"
                  validators={{ onChange: ({ value }) => requireText(value, "Cidade") }}
                >
                  {(field) => (
                    <FormField label="Cidade *" error={field.state.meta.errors[0]}>
                      <Input
                        value={field.state.value}
                        onChange={(event) => field.handleChange(event.target.value)}
                        placeholder="São Paulo"
                        className="h-11 rounded-xl border-white/10 bg-white/5 text-sm"
                      />
                    </FormField>
                  )}
                </form.Field>
                <form.Field
                  name="state"
                  validators={{ onChange: ({ value }) => requireText(value, "Estado") }}
                >
                  {(field) => (
                    <FormField label="Estado *" error={field.state.meta.errors[0]}>
                      <Input
                        value={field.state.value}
                        onChange={(event) => field.handleChange(event.target.value)}
                        placeholder="SP"
                        className="h-11 rounded-xl border-white/10 bg-white/5 text-sm"
                      />
                    </FormField>
                  )}
                </form.Field>
                <form.Field
                  name="country"
                  validators={{ onChange: ({ value }) => requireText(value, "País") }}
                >
                  {(field) => (
                    <FormField label="País *" error={field.state.meta.errors[0]}>
                      <Input
                        value={field.state.value}
                        onChange={(event) => field.handleChange(event.target.value)}
                        placeholder="Brasil"
                        className="h-11 rounded-xl border-white/10 bg-white/5 text-sm"
                      />
                    </FormField>
                  )}
                </form.Field>
              </div>

              <Separator className="bg-white/10" />

              <div className="grid gap-4 md:grid-cols-2">
                <form.Field name="pricePerNight">
                  {(field) => (
                    <FormField label="Preço por noite (R$)">
                      <Input
                        type="number"
                        inputMode="numeric"
                        min={0}
                        value={field.state.value}
                        onChange={(event) => field.handleChange(event.target.value)}
                        placeholder="350"
                        className="h-11 rounded-xl border-white/10 bg-white/5 text-sm"
                      />
                    </FormField>
                  )}
                </form.Field>
                <form.Field name="maxGuests">
                  {(field) => (
                    <FormField label="Máximo de hóspedes">
                      <Input
                        type="number"
                        inputMode="numeric"
                        min={0}
                        value={field.state.value}
                        onChange={(event) => field.handleChange(event.target.value)}
                        placeholder="4"
                        className="h-11 rounded-xl border-white/10 bg-white/5 text-sm"
                      />
                    </FormField>
                  )}
                </form.Field>
              </div>

              {feedback ? (
                <p className="rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
                  {feedback}
                </p>
              ) : null}

              <div className="flex flex-wrap gap-3">
                <Button
                  type="submit"
                  className="h-12 rounded-xl px-6 shadow-lg"
                  disabled={createMutation.isPending}
                >
                  <Save size={16} />
                  {createMutation.isPending ? "Publicando…" : "Publicar endereço"}
                </Button>
                <Button
                  asChild
                  type="button"
                  variant="outline"
                  className="h-12 rounded-xl border-white/15 bg-white/5 px-6"
                >
                  <Link to="/enderecos">Cancelar</Link>
                </Button>
              </div>
            </form>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

function FormField({
  label,
  error,
  children,
}: {
  label: string
  error?: unknown
  children: React.ReactNode
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[11px] font-medium uppercase tracking-widest text-muted-foreground">
        {label}
      </span>
      {children}
      {typeof error === "string" && error ? (
        <span className="text-[11px] text-destructive">{error}</span>
      ) : null}
    </label>
  )
}