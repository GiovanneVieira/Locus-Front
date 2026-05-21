import { useEffect, useState } from "react"
import { Link, Navigate, useNavigate } from "react-router"
import { useForm } from "@tanstack/react-form"
import {
  BadgeCheck, CalendarDays, LogOut, Mail, MapPin, Phone,
  ShieldCheck, Sparkles, UserRound,
} from "lucide-react"

import Header from "@/components/Header/Header"
import { Footer } from "@/components/Footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { useCurrentUser, useLogout } from "@/hooks/useAuth"
import { useMyAddresses } from "@/hooks/useAddresses"
import { useUpdateCurrentUser } from "@/hooks/useUser"
import { ApiError } from "@/lib/api"
import { formatDate, getInitials, isHost } from "@/lib/user"

export default function ProfilePage() {
  const navigate = useNavigate()
  const { data: user, isLoading } = useCurrentUser()
  const updateMutation = useUpdateCurrentUser()
  const logoutMutation = useLogout()
  const { data: myAddresses } = useMyAddresses()
  
  const [feedback, setFeedback] = useState<string | null>(null)
  const [isEditing, setIsEditing] = useState(false)

  const form = useForm({
    defaultValues: {
      name: user?.name ?? "",
      phone: user?.phone ?? "",
      bio: user?.bio ?? "",
      pfpUrl: user?.pfpUrl ?? "",
    },
    onSubmit: async ({ value }) => {
      setFeedback(null)
      try {
        await updateMutation.mutateAsync({
          name: value.name,
          phone: value.phone || null,
          bio: value.bio || null,
          pfpUrl: value.pfpUrl || null,
        })
        setIsEditing(false)
        setFeedback("Perfil atualizado com sucesso.")
      } catch (error) {
        const message =
          error instanceof ApiError ? error.message : "Não foi possível atualizar agora."
        setFeedback(message)
      }
    },
  })

  useEffect(() => {
    if (user) {
      form.reset({
        name: user.name ?? "",
        phone: user.phone ?? "",
        bio: user.bio ?? "",
        pfpUrl: user.pfpUrl ?? "",
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id])

  async function handleLogout() {
    try {
      await logoutMutation.mutateAsync()
    } catch {
      // silencioso — o backend pode já ter invalidado o cookie
    }
    navigate("/", { replace: true })
  }

  if (isLoading) {
     return (
       <div className="min-h-screen bg-background text-foreground">
         <Header />
         <main className="mx-auto flex max-w-5xl items-center justify-center px-6 py-24">
           <p className="text-sm text-muted-foreground">Carregando seu perfil…</p>
         </main>
         <Footer />
       </div>
     )
  }

  if (!user) {
    return <Navigate to="/auth" replace />
  }

  const host = isHost(user)

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      <main className="mx-auto max-w-5xl px-6 py-12">
        <section className="glass-card relative overflow-hidden p-8">
          <div className="pointer-events-none absolute inset-0">
            <div className="hero-orb top-[-40px] right-[-80px] opacity-40" />
            <div className="grid-pattern absolute inset-0 opacity-20" />
          </div>

          <div className="relative flex flex-col items-start gap-6 sm:flex-row sm:items-center">
            <div className="relative">
              {user.pfpUrl ? (
                <img
                  src={user.pfpUrl}
                  alt={user.name}
                  className="size-20 rounded-2xl border border-border object-cover"
                />
              ) : (
                <div className="flex size-20 items-center justify-center rounded-2xl border border-border bg-secondary text-xl font-semibold">
                  {getInitials(user.name)}
                </div>
              )}
              <div className="absolute -right-2 -bottom-2 rounded-full border border-border bg-background p-1.5">
                {host ? (
                  <BadgeCheck className="size-4 text-primary" />
                ) : (
                  <UserRound className="size-4 text-muted-foreground" />
                )}
              </div>
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-3">
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
                {logoutMutation.isPending ? "Saindo…" : "Sair da conta"}
              </Button>
            </div>
          </div>
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
          <div className="glass-card p-6">
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold">Dados pessoais</h2>
                <p className="text-xs text-muted-foreground">
                  Atualize como você aparece para os outros usuários da plataforma.
                </p>
              </div>
              {!isEditing ? (
                <Button
                  variant="outline"
                  className="rounded-full border-border bg-secondary/50 px-4"
                  onClick={() => setIsEditing(true)}
                >
                  Editar
                </Button>
              ) : null}
            </div>

            <form
              className="flex flex-col gap-4"
              onSubmit={(event) => {
                event.preventDefault()
                form.handleSubmit()
              }}
            >
              <form.Field name="name">
                {(field) => (
                  <label className="flex flex-col gap-1.5">
                    <span className="text-xs font-medium text-muted-foreground">Nome completo</span>
                    <Input
                      value={field.state.value}
                      onChange={(event) => field.handleChange(event.target.value)}
                      disabled={!isEditing}
                      className="h-11 rounded-xl border-border bg-secondary/50 px-3 text-sm"
                    />
                  </label>
                )}
              </form.Field>

              <form.Field name="phone">
                {(field) => (
                  <label className="flex flex-col gap-1.5">
                    <span className="text-xs font-medium text-muted-foreground">Telefone</span>
                    <Input
                      value={field.state.value ?? ""}
                      onChange={(event) => field.handleChange(event.target.value)}
                      disabled={!isEditing}
                      placeholder="(11) 99999-9999"
                      className="h-11 rounded-xl border-border bg-secondary/50 px-3 text-sm"
                    />
                  </label>
                )}
              </form.Field>

              <form.Field name="pfpUrl">
                {(field) => (
                  <label className="flex flex-col gap-1.5">
                    <span className="text-xs font-medium text-muted-foreground">URL do avatar</span>
                    <Input
                      value={field.state.value ?? ""}
                      onChange={(event) => field.handleChange(event.target.value)}
                      disabled={!isEditing}
                      placeholder="https://cdn.locus.com/avatars/me.jpg"
                      className="h-11 rounded-xl border-border bg-secondary/50 px-3 text-sm"
                    />
                  </label>
                )}
              </form.Field>

              <form.Field name="bio">
                {(field) => (
                  <label className="flex flex-col gap-1.5">
                    <span className="text-xs font-medium text-muted-foreground">Sobre você</span>
                    <Textarea
                      value={field.state.value ?? ""}
                      onChange={(event) => field.handleChange(event.target.value)}
                      disabled={!isEditing}
                      rows={4}
                      placeholder="Conte para outros viajantes o que faz seu perfil especial."
                    />
                  </label>
                )}
              </form.Field>

              {feedback ? (
                <p className="text-sm text-muted-foreground">{feedback}</p>
              ) : null}

              {isEditing ? (
                <div className="flex flex-wrap gap-3">
                  <Button
                    type="submit"
                    className="h-11 rounded-xl px-6 shadow-lg"
                    disabled={updateMutation.isPending}
                  >
                    {updateMutation.isPending ? "Salvando…" : "Salvar alterações"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="h-11 rounded-xl border-border bg-secondary/50 px-6"
                    onClick={() => {
                      form.reset()
                      setIsEditing(false)
                      setFeedback(null)
                    }}
                  >
                    Cancelar
                  </Button>
                </div>
              ) : null}
            </form>
          </div>

          <div className="glass-card flex flex-col gap-5 p-6">
            <div>
              <h2 className="text-lg font-semibold">Seus Hospedagens</h2>
              <p className="text-xs text-muted-foreground">
                Locais que você publica como anfitrião.
              </p>
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