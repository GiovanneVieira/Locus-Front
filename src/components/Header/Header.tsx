import { useEffect, useMemo, useRef, useState } from "react"
import { Link, NavLink, useLocation, useNavigate } from "react-router"
import {
  ArrowRight,
  BadgeCheck,
  LogOut,
  MapPin,
  Menu,
  Moon,
  ShieldCheck,
  Sparkles,
  Sun,
  UserCircle2,
  X,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { useTheme } from "@/components/theme-provider"
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { navegacao } from "@/constants/constants"
import Logo from "@/components/LocusLogo"
import AuthPage from "@/components/auth/AuthPage"
import { NavItems } from "@/components/NavItems"
import { useCurrentUser, useLogout } from "@/hooks/useAuth"
import { getInitials, isHost } from "@/lib/user"

export default function Header() {
  const { theme, setTheme } = useTheme()
  const [menuAberto, setMenuAberto] = useState(false)
  const [authAberto, setAuthAberto] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  const { data: user } = useCurrentUser()
  const logoutMutation = useLogout()
  const userMenuRef = useRef<HTMLDivElement | null>(null)

  const paginaAtual = useMemo(() => {
    const pagina = navegacao.find((item) => item.rota === location.pathname)
    return pagina?.nome ?? "Locus"
  }, [location.pathname])

  const alternarTema = () => setTheme(theme === "dark" ? "light" : "dark")

  useEffect(() => {
    if (!userMenuOpen) return
    function handleClick(event: MouseEvent) {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setUserMenuOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [userMenuOpen])

  async function handleLogout() {
    setUserMenuOpen(false)
    try {
      await logoutMutation.mutateAsync()
    } catch {
      // cookie pode já estar inválido
    }
    navigate("/", { replace: true })
  }

  const host = isHost(user)
  const isAdmin = (user?.role ?? "").toString().toUpperCase() === "ADMIN"

  return (
    <header className="header-glow-line sticky top-0 z-50 w-full border-b border-white/10 bg-background/55 backdrop-blur-2xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4">
        <Link to="/" className="group flex min-w-0 items-center gap-3">
          <div className="relative">
            <div className="absolute inset-0 rounded-2xl bg-primary/20 blur-xl opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            <div className="relative flex size-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5 transition-transform duration-300 group-hover:scale-105">
              <Logo className="size-8" />
            </div>
          </div>
          <div className="min-w-0 leading-tight">
            <strong className="block truncate text-base font-semibold text-foreground md:text-lg">Locus</strong>
            <span className="block truncate text-xs text-muted-foreground md:text-sm">{paginaAtual.toLowerCase()}</span>
          </div>
        </Link>

        <nav className="hidden items-center gap-2 lg:flex">
          {navegacao.map((item) => (
            <NavLink
              key={item.rota}
              to={item.rota}
              className={({ isActive }) =>
                [
                  "relative rounded-full px-4 py-2.5 text-sm font-medium transition-all duration-300",
                  isActive
                    ? "border border-white/10 bg-white/10 text-foreground"
                    : "text-muted-foreground hover:bg-white/5 hover:text-foreground",
                ].join(" ")
              }
            >
              {item.nome}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <button
            type="button"
            onClick={alternarTema}
            className="inline-flex size-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-muted-foreground transition-all hover:bg-white/10"
            aria-label="Alternar tema"
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {user ? (
            <div className="relative" ref={userMenuRef}>
              <button
                type="button"
                onClick={() => setUserMenuOpen((value) => !value)}
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 py-1.5 pr-4 pl-1.5 text-sm font-medium transition-all hover:bg-white/10"
                aria-haspopup="menu"
                aria-expanded={userMenuOpen}
              >
                {user.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
                    alt={user.name}
                    className="size-8 rounded-full border border-white/10 object-cover"
                  />
                ) : (
                  <span className="flex size-8 items-center justify-center rounded-full border border-white/10 bg-white/10 text-[11px] font-semibold">
                    {getInitials(user.name)}
                  </span>
                )}
                <span className="max-w-[140px] truncate">{user.name.split(" ")[0]}</span>
                {host ? <BadgeCheck size={14} className="text-primary" /> : null}
              </button>

              {userMenuOpen ? (
                <div
                  role="menu"
                  className="absolute right-0 mt-2 w-60 overflow-hidden rounded-2xl border border-white/10 bg-background/95 p-1.5 shadow-2xl backdrop-blur-xl"
                >
                  <Link
                    to="/perfil"
                    onClick={() => setUserMenuOpen(false)}
                    className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm text-foreground transition-colors hover:bg-white/10"
                  >
                    <UserCircle2 size={16} /> Meu perfil
                  </Link>
                  {isAdmin ? (
                    <Link
                      to="/admin"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm text-foreground transition-colors hover:bg-white/10"
                    >
                      <ShieldCheck size={16} /> Administração
                    </Link>
                  ) : null}
                  {host ? (
                    <Link
                      to="/enderecos/novo"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm text-foreground transition-colors hover:bg-white/10"
                    >
                      <MapPin size={16} /> Novo endereço
                    </Link>
                  ) : (
                    <Link
                      to="/tornar-anfitriao"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm text-foreground transition-colors hover:bg-white/10"
                    >
                      <Sparkles size={16} /> Virar anfitrião
                    </Link>
                  )}
                  <div className="my-1 h-px bg-white/10" />
                  <button
                    type="button"
                    onClick={handleLogout}
                    disabled={logoutMutation.isPending}
                    className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-sm text-destructive transition-colors hover:bg-destructive/10 disabled:opacity-60"
                  >
                    <LogOut size={16} />
                    {logoutMutation.isPending ? "Saindo…" : "Sair da conta"}
                  </button>
                </div>
              ) : null}
            </div>
          ) : (
            <Dialog open={authAberto} onOpenChange={setAuthAberto}>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  className="rounded-full border-white/15 bg-white/5 px-5 text-foreground hover:bg-white/10"
                >
                  Entrar
                </Button>
              </DialogTrigger>
              <DialogContent className="h-[95%] overflow-hidden border-white/10 bg-transparent p-0 shadow-none sm:rounded-2xl">
                <DialogTitle className="sr-only">Autenticação</DialogTitle>
                <AuthPage />
              </DialogContent>
            </Dialog>
          )}

          {isAdmin ? (
            <Button asChild className="rounded-full px-5 shadow-lg">
              <Link to="/admin" className="inline-flex items-center gap-2">
                Painel admin <ArrowRight size={16} />
              </Link>
            </Button>
          ) : (
            <Button asChild className="rounded-full px-5 shadow-lg">
              <Link to="/enderecos" className="inline-flex items-center gap-2">
                Explorar endereços <ArrowRight size={16} />
              </Link>
            </Button>
          )}
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <button
            onClick={() => setMenuAberto(!menuAberto)}
            className="inline-flex size-11 cursor-pointer items-center justify-center rounded-full border border-white/10 bg-white/5"
            aria-label="Abrir menu"
          >
            {menuAberto ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      <div
        className={`overflow-hidden border-t border-white/10 bg-background/80 backdrop-blur-2xl transition-all duration-300 lg:hidden ${
          menuAberto ? "max-h-[640px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="mx-auto max-w-7xl px-6 py-5">
          <div className="mb-5 rounded-3xl border border-white/10 bg-white/5 p-4">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-xs font-bold tracking-widest text-muted-foreground uppercase">Navegação</span>
              <div className="rounded-full bg-primary/10 px-3 py-1 text-[10px] font-bold text-primary">LOCUS v1.0</div>
            </div>

            <div className="grid gap-2">
              <NavItems onClick={() => setMenuAberto(false)} />
            </div>

            {user ? (
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <Button asChild variant="outline" className="rounded-full border-white/15">
                  <Link to="/perfil" onClick={() => setMenuAberto(false)}>
                    <UserCircle2 size={16} /> Meu perfil
                  </Link>
                </Button>
                {isAdmin ? (
                  <Button asChild className="rounded-full">
                    <Link to="/admin" onClick={() => setMenuAberto(false)} className="flex items-center gap-2">
                      <ShieldCheck size={16} /> Painel admin
                    </Link>
                  </Button>
                ) : host ? (
                  <Button asChild variant="outline" className="rounded-full border-white/15">
                    <Link to="/enderecos/novo" onClick={() => setMenuAberto(false)}>
                      <MapPin size={16} /> Novo endereço
                    </Link>
                  </Button>
                ) : (
                  <Button asChild variant="outline" className="rounded-full border-white/15">
                    <Link to="/tornar-anfitriao" onClick={() => setMenuAberto(false)}>
                      <Sparkles size={16} /> Virar anfitrião
                    </Link>
                  </Button>
                )}
                <Button
                  variant="outline"
                  className="rounded-full border-white/15 sm:col-span-2"
                  onClick={() => {
                    setMenuAberto(false)
                    void handleLogout()
                  }}
                >
                  <LogOut size={16} /> Sair
                </Button>
              </div>
            ) : (
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <Button asChild variant="outline" className="rounded-full border-white/15">
                  <Link to="/auth" onClick={() => setMenuAberto(false)}>
                    Entrar na conta
                  </Link>
                </Button>
                <Button asChild className="rounded-full">
                  <Link to="/enderecos" onClick={() => setMenuAberto(false)} className="flex items-center gap-2">
                    Explorar endereços <ArrowRight size={16} />
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}