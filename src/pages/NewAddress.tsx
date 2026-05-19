import { useState } from "react"
import { Link, useNavigate } from "react-router"
import { useForm, useStore } from "@tanstack/react-form"
import { ArrowLeft, MapPin, Save, Loader2, AlertCircle } from "lucide-react"

import Header from "@/components/Header/Header"
import { Footer } from "@/components/Footer"
import { Breadcrumbs } from "@/components/Breadcrumbs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/components/feedback/ToastProvider"

import { FormField } from "@/components/forms/FormField"
import { FormSection } from "@/components/forms/FormSection"
import { AmenitySelector } from "@/components/forms/AmenitySelector"
import { ImageUploader, type UploaderImage } from "@/components/forms/ImageUploader"
import { AddressPreviewCard } from "@/components/AddressPreviewCard"

import { useCreateAddress, useUploadAddressImages } from "@/hooks/useAddresses"
import { ApiError } from "@/lib/api"
import type { CreateAddressPayload } from "@/lib/types"

interface FormValues {
  title: string
  description: string
  street: string
  number: string
  complement: string
  neighborhood: string
  city: string
  state: string
  country: string
  zipCode: string
  pricePerNight: string
  maxGuests: string
  availableFrom: string
  availableTo: string
  amenities: string[]
}

const defaultValues: FormValues = {
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
  availableFrom: "",
  availableTo: "",
  amenities: [],
}

/* ============================
   Validações (puras, testáveis)
   ============================ */

function requireText(value: string, label: string) {
  if (!value || !value.trim()) return `${label} é obrigatório`
  return undefined
}

function validateState(value: string) {
  if (!value || !value.trim()) return "Estado é obrigatório"
  if (value.trim().length !== 2) return "Use a sigla com 2 letras (ex.: SP)"
  return undefined
}

function validateZip(value: string) {
  if (!value || !value.trim()) return "CEP é obrigatório"
  const cleaned = value.replace(/\D/g, "")
  if (cleaned.length !== 8) return "CEP deve ter 8 dígitos"
  return undefined
}

function validateNonNegativeNumber(value: string, label: string) {
  if (!value) return undefined
  const num = Number(value)
  if (!Number.isFinite(num) || num < 0) return `${label} inválido`
  return undefined
}

function validateDateRange(from: string, to: string) {
  if (!from && !to) return undefined
  if (from && !to) return "Informe a data final"
  if (!from && to) return "Informe a data inicial"
  if (new Date(to) < new Date(from)) return "A data final precisa vir depois da inicial"
  return undefined
}

export default function NewAddressPage() {
  const navigate = useNavigate()
  const toast = useToast()
  const createMutation = useCreateAddress()
  const uploadMutation = useUploadAddressImages()

  const [images, setImages] = useState<UploaderImage[]>([])
  const [submitError, setSubmitError] = useState<string | null>(null)

  const form = useForm({
    defaultValues,
    onSubmit: async ({ value }) => {
      setSubmitError(null)

      // Validação cross-field das datas
      const dateError = validateDateRange(value.availableFrom, value.availableTo)
      if (dateError) {
        setSubmitError(dateError)
        return
      }

      try {
        // 1) Upload das imagens novas (as remotas já têm URL pública)
        let uploadedUrls: string[] = []
        const filesToUpload = images
          .map((image) => (image.file ? image.file : null))
          .filter((file): file is File => file !== null)

        if (filesToUpload.length > 0) {
          uploadedUrls = await uploadMutation.mutateAsync(filesToUpload)
          if (uploadedUrls.length !== filesToUpload.length) {
            throw new Error("Upload incompleto: quantidade de URLs diferente da quantidade de arquivos.")
          }
        }

        const remoteUrls = images
          .filter((image) => image.remote)
          .map((image) => image.url)

        // Mantém a ordem (capa primeiro)
        const allImageUrls: string[] = []
        let uploadIdx = 0
        let remoteIdx = 0
        for (const image of images) {
          if (image.remote) {
            allImageUrls.push(remoteUrls[remoteIdx++])
          } else {
              const nextUploadedUrl = uploadedUrls[uploadIdx++]
              if (!nextUploadedUrl) {
              throw new Error("Falha ao montar lista de imagens publicadas.")
              }
              allImageUrls.push(nextUploadedUrl)
           }
        }
        
        const payload: CreateAddressPayload = {
          title: value.title.trim(),
          description: value.description.trim() || null,
          street: value.street.trim(),
          number: value.number.trim(),
          type: "RENTABLE",
          complement: value.complement.trim() || null,
          neighborhood: value.neighborhood.trim(),
          city: value.city.trim(),
          state: value.state.trim().toUpperCase(),
          country: value.country.trim(),
          zipCode: value.zipCode.trim(),
          pricePerNight: value.pricePerNight ? Number(value.pricePerNight) : null,
          maxGuests: value.maxGuests ? Number(value.maxGuests) : null,
          coverImageUrl: allImageUrls[0] ?? null,
          imageUrls: allImageUrls,
          amenities: value.amenities,
          availableFrom: value.availableFrom || null,
          availableTo: value.availableTo || null,
        }

        console.log(`Payload from address form:\n${JSON.stringify(payload)}`)
        const created = await createMutation.mutateAsync(payload)
        toast.success("Endereço publicado", `"${payload.title}" já está no catálogo do Locus.`)
        navigate(`/enderecos/${created.id}`, { replace: true })
      } catch (error) {
        const message =
          error instanceof ApiError
            ? error.message
            : "Não foi possível publicar o endereço agora. Tente novamente."
        setSubmitError(message)
        toast.error("Não foi possível publicar", message)
      }
    },
  })

  // Subscribe aos valores para o preview ao vivo
  const watched = useStore(form.store, (state) => state.values)
  const submitting = createMutation.isPending || uploadMutation.isPending

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      <main className="mx-auto max-w-7xl px-6 py-10">
        <Breadcrumbs
          items={[
            { label: "Hospedagens", href: "/enderecos" },
            { label: "Novo endereço" },
          ]}
          className="mb-4"
        />
        <Link
          to="/enderecos"
          className="mb-5 inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition hover:text-foreground"
        >
          <ArrowLeft size={14} />
          Voltar para a lista
        </Link>

        <div className="mb-8">
          <span className="section-badge">
            <MapPin size={12} />
            Novo endereço
          </span>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">
            Publique um lugar para hospedar
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Preencha as informações com cuidado — elas aparecem em tempo real no card à direita,
            que é como os hóspedes vão ver o seu imóvel.
          </p>
        </div>

        <form
          onSubmit={(event) => {
            event.preventDefault()
            form.handleSubmit()
          }}
          className="grid gap-6 lg:grid-cols-[1.45fr_1fr] lg:items-start"
        >
          {/* ============ Formulário ============ */}
          <div className="flex flex-col gap-7 rounded-3xl border border-border bg-card p-6 shadow-sm">
            <FormSection
              title="Identificação"
              description="Como o seu imóvel vai ser apresentado no catálogo."
            >
              <form.Field
                name="title"
                validators={{ onBlur: ({ value }) => requireText(value, "Título") }}
              >
                {(field) => (
                  <FormField
                    label="Título do anúncio"
                    required
                    error={field.state.meta.errors[0] as string | undefined}
                    hint="Curto e descritivo. Ex.: 'Loft moderno em Pinheiros'"
                  >
                    <Input
                      id="title"
                      value={field.state.value}
                      onChange={(event) => field.handleChange(event.target.value)}
                      onBlur={field.handleBlur}
                      maxLength={120}
                      placeholder="Loft moderno em Pinheiros"
                      className="h-11 rounded-xl"
                    />
                  </FormField>
                )}
              </form.Field>

              <form.Field name="description">
                {(field) => (
                  <FormField
                    label="Descrição"
                    hint="Conte o que torna esse lugar único — vizinhança, estilo, diferenciais."
                  >
                    <Textarea
                      id="description"
                      value={field.state.value}
                      onChange={(event) => field.handleChange(event.target.value)}
                      rows={4}
                      maxLength={1200}
                      placeholder="Apartamento aconchegante, perto de metrô, com varanda gourmet..."
                    />
                  </FormField>
                )}
              </form.Field>
            </FormSection>

            <Separator />

            <FormSection title="Endereço" description="Onde o imóvel fica.">
              <div className="grid gap-3 md:grid-cols-[2fr_1fr_1.2fr]">
                <form.Field
                  name="street"
                  validators={{ onBlur: ({ value }) => requireText(value, "Rua") }}
                >
                  {(field) => (
                    <FormField
                      label="Rua"
                      required
                      error={field.state.meta.errors[0] as string | undefined}
                    >
                      <Input
                        value={field.state.value}
                        onChange={(event) => field.handleChange(event.target.value)}
                        onBlur={field.handleBlur}
                        placeholder="Rua Harmonia"
                        className="h-11 rounded-xl"
                      />
                    </FormField>
                  )}
                </form.Field>

                <form.Field
                  name="number"
                  validators={{ onBlur: ({ value }) => requireText(value, "Número") }}
                >
                  {(field) => (
                    <FormField
                      label="Número"
                      required
                      error={field.state.meta.errors[0] as string | undefined}
                    >
                      <Input
                        value={field.state.value}
                        onChange={(event) =>
                          field.handleChange(event.target.value.replace(/[^\dA-Za-z]/g, ""))
                        }
                        onBlur={field.handleBlur}
                        placeholder="123"
                        className="h-11 rounded-xl"
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
                        className="h-11 rounded-xl"
                      />
                    </FormField>
                  )}
                </form.Field>
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                <form.Field
                  name="neighborhood"
                  validators={{ onBlur: ({ value }) => requireText(value, "Bairro") }}
                >
                  {(field) => (
                    <FormField
                      label="Bairro"
                      required
                      error={field.state.meta.errors[0] as string | undefined}
                    >
                      <Input
                        value={field.state.value}
                        onChange={(event) => field.handleChange(event.target.value)}
                        onBlur={field.handleBlur}
                        placeholder="Pinheiros"
                        className="h-11 rounded-xl"
                      />
                    </FormField>
                  )}
                </form.Field>

                <form.Field
                  name="zipCode"
                  validators={{ onBlur: ({ value }) => validateZip(value) }}
                >
                  {(field) => (
                    <FormField
                      label="CEP"
                      required
                      error={field.state.meta.errors[0] as string | undefined}
                    >
                      <Input
                        value={field.state.value}
                        onChange={(event) => {
                          // Auto-formata 12345678 -> 12345-678
                          const onlyDigits = event.target.value.replace(/\D/g, "").slice(0, 8)
                          const formatted =
                            onlyDigits.length > 5
                              ? `${onlyDigits.slice(0, 5)}-${onlyDigits.slice(5)}`
                              : onlyDigits
                          field.handleChange(formatted)
                        }}
                        onBlur={field.handleBlur}
                        placeholder="05435-000"
                        className="h-11 rounded-xl"
                        inputMode="numeric"
                      />
                    </FormField>
                  )}
                </form.Field>
              </div>

              <div className="grid gap-3 md:grid-cols-3">
                <form.Field
                  name="city"
                  validators={{ onBlur: ({ value }) => requireText(value, "Cidade") }}
                >
                  {(field) => (
                    <FormField
                      label="Cidade"
                      required
                      error={field.state.meta.errors[0] as string | undefined}
                    >
                      <Input
                        value={field.state.value}
                        onChange={(event) => field.handleChange(event.target.value)}
                        onBlur={field.handleBlur}
                        placeholder="São Paulo"
                        className="h-11 rounded-xl"
                      />
                    </FormField>
                  )}
                </form.Field>

                <form.Field
                  name="state"
                  validators={{ onBlur: ({ value }) => validateState(value) }}
                >
                  {(field) => (
                    <FormField
                      label="UF"
                      required
                      error={field.state.meta.errors[0] as string | undefined}
                    >
                      <Input
                        value={field.state.value}
                        onChange={(event) =>
                          field.handleChange(event.target.value.toUpperCase().slice(0, 2))
                        }
                        onBlur={field.handleBlur}
                        placeholder="SP"
                        className="h-11 rounded-xl uppercase"
                      />
                    </FormField>
                  )}
                </form.Field>

                <form.Field
                  name="country"
                  validators={{ onBlur: ({ value }) => requireText(value, "País") }}
                >
                  {(field) => (
                    <FormField
                      label="País"
                      required
                      error={field.state.meta.errors[0] as string | undefined}
                    >
                      <Input
                        value={field.state.value}
                        onChange={(event) => field.handleChange(event.target.value)}
                        onBlur={field.handleBlur}
                        placeholder="Brasil"
                        className="h-11 rounded-xl"
                      />
                    </FormField>
                  )}
                </form.Field>
              </div>
            </FormSection>

            <Separator />

            <FormSection
              title="Disponibilidade e capacidade"
              description="Período em que o imóvel pode ser reservado e capacidade máxima."
            >
              <div className="grid gap-3 md:grid-cols-3">
                <form.Field name="availableFrom">
                  {(field) => (
                    <FormField label="Check-in disponível a partir de">
                      <Input
                        type="date"
                        value={field.state.value}
                        onChange={(event) => field.handleChange(event.target.value)}
                        className="h-11 rounded-xl"
                      />
                    </FormField>
                  )}
                </form.Field>

                <form.Field name="availableTo">
                  {(field) => (
                    <FormField label="Check-out até">
                      <Input
                        type="date"
                        value={field.state.value}
                        min={watched.availableFrom || undefined}
                        onChange={(event) => field.handleChange(event.target.value)}
                        className="h-11 rounded-xl"
                      />
                    </FormField>
                  )}
                </form.Field>

                <form.Field
                  name="maxGuests"
                  validators={{
                    onBlur: ({ value }) => validateNonNegativeNumber(value, "Capacidade"),
                  }}
                >
                  {(field) => (
                    <FormField
                      label="Hóspedes (máx.)"
                      error={field.state.meta.errors[0] as string | undefined}
                    >
                      <Input
                        type="number"
                        inputMode="numeric"
                        min={1}
                        max={20}
                        value={field.state.value}
                        onChange={(event) => field.handleChange(event.target.value)}
                        onBlur={field.handleBlur}
                        placeholder="4"
                        className="h-11 rounded-xl"
                      />
                    </FormField>
                  )}
                </form.Field>
              </div>

              <form.Field
                name="pricePerNight"
                validators={{
                  onBlur: ({ value }) => validateNonNegativeNumber(value, "Preço"),
                }}
              >
                {(field) => (
                  <FormField
                    label="Preço por noite (R$)"
                    hint="Deixe vazio para combinar diretamente."
                    error={field.state.meta.errors[0] as string | undefined}
                  >
                    <Input
                      type="number"
                      inputMode="numeric"
                      min={0}
                      value={field.state.value}
                      onChange={(event) => field.handleChange(event.target.value)}
                      onBlur={field.handleBlur}
                      placeholder="350"
                      className="h-11 rounded-xl"
                    />
                  </FormField>
                )}
              </form.Field>
            </FormSection>

            <Separator />

            <FormSection
              title="O que o imóvel oferece"
              description="Marque tudo que o hóspede vai encontrar por lá."
            >
              <form.Field name="amenities">
                {(field) => (
                  <AmenitySelector
                    value={field.state.value}
                    onChange={(next) => field.handleChange(next)}
                  />
                )}
              </form.Field>
            </FormSection>

            <Separator />

            <FormSection
              title="Imagens do imóvel"
              description="Adicione fotos reais do espaço. A primeira é a capa."
            >
              <ImageUploader
                images={images}
                onChange={setImages}
                externalError={uploadMutation.error instanceof Error ? uploadMutation.error.message : null}
              />
            </FormSection>

            {/* Erro geral de submit */}
            {submitError ? (
              <div
                role="alert"
                className="flex items-start gap-2 rounded-2xl border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive"
              >
                <AlertCircle size={16} className="mt-0.5 shrink-0" />
                <span>{submitError}</span>
              </div>
            ) : null}

            {/* Ações */}
            <div className="flex flex-wrap items-center justify-end gap-3 border-t border-border pt-5">
              <Button
                asChild
                type="button"
                variant="outline"
                className="h-11 rounded-xl px-5"
                disabled={submitting}
              >
                <Link to="/enderecos">Cancelar</Link>
              </Button>
              <Button type="submit" className="h-11 rounded-xl px-6 shadow-md" disabled={submitting}>
                {submitting ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Publicando…
                  </>
                ) : (
                  <>
                    <Save size={16} />
                    Publicar endereço
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* ============ Preview ============ */}
          <AddressPreviewCard
            title={watched.title}
            description={watched.description}
            city={watched.city}
            state={watched.state}
            neighborhood={watched.neighborhood}
            pricePerNight={watched.pricePerNight}
            maxGuests={watched.maxGuests}
            availableFrom={watched.availableFrom}
            availableTo={watched.availableTo}
            amenities={watched.amenities}
            imageUrls={images.map((image) => image.url)}
          />
        </form>
      </main>

      <Footer />
    </div>
  )
}
