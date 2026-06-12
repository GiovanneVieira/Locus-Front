import { useEffect, useState } from "react"
import { Link, Navigate, useNavigate } from "react-router"
import { useForm } from "@tanstack/react-form"
import {
  CalendarDays,
  Camera,
  Loader2,
  LogOut,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  Sparkles,
  Upload,
  X,
} from "lucide-react"

import Header from "@/components/Header/Header"
import { Footer } from "@/components/Footer"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { useCurrentUser, useLogout } from "@/hooks/useAuth"
import { useMyAddresses } from "@/hooks/useAddresses"
import { useUpdateProfileWithAvatar } from "@/hooks/useUser"
import { ApiError } from "@/lib/api"
import { formatDate, getInitials, isHost } from "@/lib/user"

interface ProfileFormValues {
  name: string
  email: string
  phone: string
  bio: string
}

type ProfileFormErrors = Partial<Record<keyof ProfileFormValues | "avatar", string>>

const MAX_AVATAR_BYTES = 5 * 1024 * 1024

function validateProfileForm(values: ProfileFormValues) {
  const errors: ProfileFormErrors = {}

  if (!values.name.trim()) {
    errors.name = "Informe seu nome."
  }

  if (values.name.trim().length > 120) {
    errors.name = "Use no máximo 120 caracteres."
  }

  if (!values.email.trim()) {
    errors.email = "O e-mail é obrigatório."
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
    errors.email = "Informe um e-mail válido."
  }

  if (values.phone && values.phone.trim().length > 32) {
    errors.phone = "Use no máximo 32 caracteres."
  }

  if (values.bio && values.bio.trim().length > 300) {
    errors.bio = "Use no máximo 300 caracteres."
  }

  return errors
}

function validateAvatarFile(file: File) {
  if (!file.type.startsWith("image/")) {
    return "Selecione um arquivo de imagem."
  }

  if (file.size > MAX_AVATAR_BYTES) {
    return "A foto deve ter no máximo 5 MB."
  }

  return null
}

function formatFileSize(value: number) {
  return new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 1 }).format(value / 1024 / 1024)
}

export default function ProfilePage() {
  const navigate = useNavigate()
  const { data: user, isLoading } = useCurrentUser()
  const updateProfileMutation = useUpdateProfileWithAvatar()
  const logoutMutation = useLogout()
  const { data: myAddresses } = useMyAddresses()

  const [feedback, setFeedback] = useState<string | null>(null)
  const [validationErrors, setValidationErrors] = useState<ProfileFormErrors>({})
  const [isEditing, setIsEditing] = useState(false)
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [avatarPreviewUrl, setAvatarPreviewUrl] = useState<string | null>(null)
  const [isDraggingAvatar, setIsDraggingAvatar] = useState(false)

  const form = useForm({
    defaultValues: {
      name: user?.name ?? "",
      email: user?.email ?? "",
      phone: user?.phone ?? "",
      bio: user?.bio ?? "",
    },
    onSubmit: async ({ value }) => {
      const errors = validateProfileForm(value)
      if (Object.keys(errors).length > 0) {
        setValidationErrors(errors)
        setFeedback("Revise os campos destacados antes de salvar.")
        return
      }

      setValidationErrors({})
      setFeedback(null)

      try {
        const trimmedName = value.name.trim()
        if (!trimmedName) {
          setValidationErrors({ name: "Informe seu nome." })
          return
        }

        await updateProfileMutation.mutateAsync({
          values: {
            name: trimmedName,
            phone: value.phone.trim() || null,
            bio: value.bio.trim() || null,
          },
          currentPfpUrl: user?.pfpUrl ?? null,
          avatarFile,
        })

        setAvatarFile(null)
        setAvatarPreviewUrl(null)
        setValidationErrors({})
        setIsEditing(false)
        setFeedback("Perfil atualizado com sucesso.")
      } catch (error) {
        const message =
          error instanceof ApiError ? error.message :
          error instanceof Error ? error.message :
          "Não foi possível atualizar agora."
        setFeedback(message)
      }
    },
  })

  useEffect(() => {
    if (user) {
      form.reset({
        name: user.name ?? "",
        email: user.email ?? "",
        phone: user.phone ?? "",
        bio: user.bio ?? "",
      })
      setAvatarFile(null)
      setAvatarPreviewUrl(null)
      setValidationErrors({})
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id])

  useEffect(() => {
    return () => {
      if (avatarPreviewUrl?.startsWith("blob:")) {
        URL.revokeObjectURL(avatarPreviewUrl)
      }
    }
  }, [avatarPreviewUrl])

  function handleAvatarFile(file: File | undefined) {
    if (!file) return

    const error = validateAvatarFile(file)
    if (error) {
      setValidationErrors((current) => ({ ...current, avatar: error }))
      return
    }

    if (avatarPreviewUrl?.startsWith("blob:")) {
      URL.revokeObjectURL(avatarPreviewUrl)
    }

    setAvatarFile(file)
    setAvatarPreviewUrl(URL.createObjectURL(file))
    setValidationErrors((current) => ({ ...current, avatar: undefined }))
    setIsEditing(true)
  }

  function clearAvatarSelection() {
    if (avatarPreviewUrl?.startsWith("blob:")) {
      URL.revokeObjectURL(avatarPreviewUrl)
    }
    setAvatarFile(null)
    setAvatarPreviewUrl(null)
    setValidationErrors((current) => ({ ...current, avatar: undefined }))
  }

  async function handleLogout() {
    try {
      await logoutMutation.mutateAsync()
    } catch {
      // O backend pode já ter invalidado a sessão.
    }
    navigate("/", { replace: true })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Header />
        <main className="mx-auto flex max-w-5xl items-center justify-center px-6 py-24">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="size-4 animate-spin text-primary" /> Carregando seu perfil...
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/auth" replace />
  }

  const host = isHost(user)
  const busy = updateProfileMutation.isPending
  const avatarSrc = avatarPreviewUrl ?? user.pfpUrl ?? ""

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      <main className="mx-auto max-w-6xl px-6 py-12">
        <section className="glass-card relative overflow-hidden p-8">
          <div className="pointer-events-none absolute inset-0">
            <div className="hero-orb top-[-40px] right-[-80px] opacity-40" />
            <div className="grid-pattern absolute inset-0 opacity-20" />
          </div>

          <div className="relative flex flex-col items-start gap-6 sm:flex-row sm:items-center">
            <Avatar className="size-24 rounded-3xl border border-cyan-500/30 bg-slate-900/60 shadow-xl shadow-primary/10">
              {avatarSrc ? <AvatarImage src={avatarSrc} alt={user.name} /> : null}
              <AvatarFallback className="rounded-3xl text-2xl">{getInitials(user.name)}</AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">{user.name}</h1>
                {host ? (
                  <span className="inline-flex items-center gap-1 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-primary">
                    <ShieldCheck size={12} /> Anfitrião
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 rounded-full border border-border bg-secondary/50 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                    Usuário comum
                  </span>
                )}
              </div>
              <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <span className="inline-flex items-center gap-1.5">
                  <Mail size={14} /> {user.email}
                </span>
                {user.phone ? (
                  <span className="inline-flex items-center gap-1.5">
                    <Phone size={14} /> {user.phone}
                  </span>
                ) : null}
                <span className="inline-flex items-center gap-1.5">
                  <CalendarDays size={14} /> Desde {formatDate(user.createdAt)}
                </span>
              </div>
              {user.bio ? (
                <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">{user.bio}</p>
              ) : null}
            </div>

            <div className="flex shrink-0 flex-col gap-2 self-start sm:self-auto">
              {!host ? (
                <Button asChild className="rounded-full px-5 shadow-lg">
                  <Link to="/tornar-anfitriao" className="inline-flex items-center gap-2">
                    <Sparkles size={16} /> Virar anfitrião
                  </Link>
                </Button>
              ) : (
                <Button asChild className="rounded-full px-5 shadow-lg">
                  <Link to="/enderecos/novo" className="inline-flex items-center gap-2">
                    <MapPin size={16} /> Novo endereço
                  </Link>
                </Button>
              )}
              <Button
                variant="outline"
                className="rounded-full border-border bg-secondary/50"
                onClick={handleLogout}
                disabled={logoutMutation.isPending}
              >
                <LogOut size={14} />
                {logoutMutation.isPending ? "Saindo..." : "Sair da conta"}
              </Button>
            </div>
          </div>
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-[1.35fr_0.65fr]">
          <div className="glass-card overflow-hidden p-0">
            <div className="border-b border-border bg-slate-900/40 p-6 backdrop-blur-md">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h2 className="text-lg font-semibold">Atualização cadastral</h2>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Gerencie seus dados e envie uma nova foto com preview antes de salvar.
                  </p>
                </div>
                {!isEditing ? (
                  <Button
                    variant="outline"
                    className="rounded-full border-cyan-500/30 bg-secondary/50 px-4"
                    onClick={() => setIsEditing(true)}
                  >
                    Editar perfil
                  </Button>
                ) : null}
              </div>
            </div>

            <Form
              className="p-6"
              onSubmit={(event) => {
                event.preventDefault()
                event.stopPropagation()
                form.handleSubmit()
              }}
            >
              <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
                <FormItem>
                  <FormLabel>Foto de perfil</FormLabel>
                  <FormControl>
                    <label
                      onDragOver={(event) => {
                        event.preventDefault()
                        if (isEditing) setIsDraggingAvatar(true)
                      }}
                      onDragLeave={() => setIsDraggingAvatar(false)}
                      onDrop={(event) => {
                        event.preventDefault()
                        setIsDraggingAvatar(false)
                        if (isEditing) handleAvatarFile(event.dataTransfer.files[0])
                      }}
                      className={`group relative flex min-h-56 cursor-pointer flex-col items-center justify-center gap-4 rounded-3xl border border-dashed p-5 text-center transition ${
                        isDraggingAvatar
                          ? "border-cyan-400 bg-cyan-400/10"
                          : "border-cyan-500/30 bg-slate-900/60 hover:border-cyan-400/60 hover:bg-slate-900/80"
                      } ${!isEditing ? "cursor-not-allowed opacity-70" : ""}`}
                    >
                      <Avatar className="size-28 rounded-3xl border border-border bg-background shadow-lg">
                        {avatarSrc ? <AvatarImage src={avatarSrc} alt={user.name} /> : null}
                        <AvatarFallback className="rounded-3xl text-2xl">
                          {getInitials(form.state.values.name || user.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="absolute inset-5 flex items-center justify-center rounded-3xl bg-black/50 text-xs font-semibold text-white opacity-0 backdrop-blur-sm transition group-hover:opacity-100">
                        <Camera className="mr-2 size-4" /> Alterar foto
                      </div>
                      <div className="space-y-1 text-xs text-muted-foreground">
                        <p className="inline-flex items-center gap-1.5 font-medium text-foreground">
                          <Upload size={13} /> Clique ou arraste a imagem
                        </p>
                        <p>PNG, JPG ou WebP até 5 MB.</p>
                        {avatarFile ? <p>{avatarFile.name} ({formatFileSize(avatarFile.size)} MB)</p> : null}
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        disabled={!isEditing || busy}
                        className="sr-only"
                        onChange={(event) => handleAvatarFile(event.target.files?.[0])}
                      />
                    </label>
                  </FormControl>
                  <FormMessage>{validationErrors.avatar}</FormMessage>
                  {avatarFile ? (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="w-full rounded-full border-border bg-secondary/50"
                      onClick={clearAvatarSelection}
                      disabled={busy}
                    >
                      <X size={13} /> Remover seleção
                    </Button>
                  ) : null}
                </FormItem>

                <div className="space-y-5">
                  <div className="grid gap-4 md:grid-cols-2">
                    <form.Field name="name">
                      {(field) => (
                        <FormItem>
                          <FormLabel htmlFor="profile-name">Nome completo</FormLabel>
                          <FormControl>
                            <Input
                              id="profile-name"
                              value={field.state.value}
                              onChange={(event) => field.handleChange(event.target.value)}
                              disabled={!isEditing || busy}
                              className="h-11 rounded-xl border-border bg-secondary/50 px-3 text-sm"
                            />
                          </FormControl>
                          <FormMessage>{validationErrors.name}</FormMessage>
                        </FormItem>
                      )}
                    </form.Field>

                    <form.Field name="email">
                      {(field) => (
                        <FormItem>
                          <FormLabel htmlFor="profile-email">E-mail</FormLabel>
                          <FormControl>
                            <Input
                              id="profile-email"
                              value={field.state.value}
                              onChange={(event) => field.handleChange(event.target.value)}
                              disabled
                              className="h-11 rounded-xl border-border bg-secondary/50 px-3 text-sm"
                            />
                          </FormControl>
                          <FormMessage>{validationErrors.email}</FormMessage>
                        </FormItem>
                      )}
                    </form.Field>

                    <form.Field name="phone">
                      {(field) => (
                        <FormItem>
                          <FormLabel htmlFor="profile-phone">Telefone</FormLabel>
                          <FormControl>
                            <Input
                              id="profile-phone"
                              value={field.state.value ?? ""}
                              onChange={(event) => field.handleChange(event.target.value)}
                              disabled={!isEditing || busy}
                              placeholder="(11) 99999-9999"
                              className="h-11 rounded-xl border-border bg-secondary/50 px-3 text-sm"
                            />
                          </FormControl>
                          <FormMessage>{validationErrors.phone}</FormMessage>
                        </FormItem>
                      )}
                    </form.Field>

                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <FormControl>
                        <div className="flex h-11 items-center rounded-xl border border-border bg-secondary/50 px-3 text-sm text-muted-foreground">
                          {host ? "Anfitrião ativo" : "Usuário comum"}
                        </div>
                      </FormControl>
                    </FormItem>
                  </div>

                  <form.Field name="bio">
                    {(field) => (
                      <FormItem>
                        <FormLabel htmlFor="profile-bio">Sobre você</FormLabel>
                        <FormControl>
                          <Textarea
                            id="profile-bio"
                            value={field.state.value ?? ""}
                            onChange={(event) => field.handleChange(event.target.value)}
                            disabled={!isEditing || busy}
                            rows={5}
                            placeholder="Conte para outros viajantes o que faz seu perfil especial."
                          />
                        </FormControl>
                        <div className="flex items-center justify-between gap-3">
                          <FormMessage>{validationErrors.bio}</FormMessage>
                          <span className="ml-auto text-[11px] text-muted-foreground">
                            {(field.state.value ?? "").length}/300
                          </span>
                        </div>
                      </FormItem>
                    )}
                  </form.Field>
                </div>
              </div>

              {feedback ? <p className="text-sm text-muted-foreground">{feedback}</p> : null}

              {isEditing ? (
                <div className="flex flex-wrap gap-3 border-t border-border pt-5">
                  <Button type="submit" className="h-11 rounded-xl px-6 shadow-lg" disabled={busy}>
                    {busy ? (
                      <>
                        <Loader2 className="size-4 animate-spin" /> Salvando...
                      </>
                    ) : (
                      "Salvar alterações"
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="h-11 rounded-xl border-border bg-secondary/50 px-6"
                    disabled={busy}
                    onClick={() => {
                      form.reset()
                      clearAvatarSelection()
                      setIsEditing(false)
                      setFeedback(null)
                      setValidationErrors({})
                    }}
                  >
                    Cancelar
                  </Button>
                </div>
              ) : null}
            </Form>
          </div>

          <div className="glass-card flex flex-col gap-5 p-6">
            <div>
              <h2 className="text-lg font-semibold">Seus Hospedagens</h2>
              <p className="text-xs text-muted-foreground">Locais que você publica como anfitrião.</p>
            </div>

            <Separator className="bg-secondary" />

            {!host ? (
              <div className="rounded-2xl border border-dashed border-border bg-secondary/50 p-4 text-sm text-muted-foreground">
                Você ainda não é anfitrião. Torne-se anfitrião para publicar Hospedagens.
              </div>
            ) : !myAddresses || myAddresses.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-border bg-secondary/50 p-4 text-sm text-muted-foreground">
                Nenhum endereço publicado ainda. Clique em <strong>Novo endereço</strong> para começar.
              </div>
            ) : (
              <ul className="flex flex-col gap-3">
                {myAddresses.slice(0, 5).map((address) => (
                  <li key={address.id}>
                    <Link
                      to={`/enderecos/${address.id}`}
                      className="flex items-center justify-between gap-3 rounded-2xl border border-border bg-secondary/50 p-3 transition hover:bg-secondary"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">{address.title}</p>
                        <p className="truncate text-xs text-muted-foreground">
                          {address.city}, {address.state} — {address.country}
                        </p>
                      </div>
                      <MapPin size={16} className="shrink-0 text-muted-foreground" />
                    </Link>
                  </li>
                ))}
              </ul>
            )}

            {host ? (
              <Button asChild variant="outline" className="rounded-full border-border bg-secondary/50">
                <Link to="/enderecos">Ver todos</Link>
              </Button>
            ) : null}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
