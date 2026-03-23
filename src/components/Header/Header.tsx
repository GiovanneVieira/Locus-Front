import { useMemo, useState } from "react"
import { Link, NavLink, useLocation } from "react-router-dom"
import {
  ArrowRight,
  Menu,
  Moon,
  Sparkles,
  Sun,
  X,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { useTheme } from "@/components/theme-provider"
import Logo from "../LocusLogo"

const navegacao = [
  { nome: "Início", rota: "/" },
  { nome: "Destinos", rota: "/destinos" },
  { nome: "Radar", rota: "/radar" },
  { nome: "Milhas", rota: "/milhas" },
  { nome: "Planejamento", rota: "/planejamento" },
]

function Header() {
  const { theme, setTheme } = useTheme()
  const [menuAberto, setMenuAberto] = useState(false)
  const location = useLocation()

  const paginaAtual = useMemo(() => {
    const pagina = navegacao.find((item) => item.rota === location.pathname)
    return pagina?.nome ?? "Locus"
  }, [location.pathname])

  const alternarTema = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  const fecharMenu = () => {
    setMenuAberto(false)
  }

  return (
    <>
      <header className="header-glow-line sticky top-0 z-50 w-full"> 
        <div className="border-b border-white/10 bg-background/55 backdrop-blur-2xl">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4">
            <Link
              to="/"
              className="group flex min-w-0 items-center gap-3"
              onClick={fecharMenu}
            >
              <div className="relative">
                <div className="absolute inset-0 rounded-2xl bg-primary/20 blur-xl transition-opacity duration-300 group-hover:opacity-100" />
                <div className="relative flex size-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5 shadow-[0_10px_35px_rgba(0,0,0,0.18)] transition-transform duration-300 group-hover:scale-105">
                  <Logo className="size-8" />
                </div>
              </div>

              <div className="min-w-0 leading-tight">
                <strong className="block truncate text-base font-semibold text-foreground md:text-lg">
                  Locus
                </strong>
                <span className="block truncate text-xs text-muted-foreground md:text-sm">
                  travel intelligence platform
                </span>
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
                        ? "border border-white/10 bg-white/10 text-foreground shadow-[0_10px_25px_rgba(0,0,0,0.12)]"
                        : "text-muted-foreground hover:bg-white/5 hover:text-foreground",
                    ].join(" ")
                  }
                >
                  {item.nome}
                </NavLink>
              ))}
            </nav>

            <div className="hidden items-center gap-2 lg:flex">
              <div className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs text-muted-foreground shadow-[0_8px_24px_rgba(0,0,0,0.12)]">
                <span className="inline-flex items-center gap-2">
                  <Sparkles size={14} className="text-primary" />
                  {paginaAtual}
                </span>
              </div>

              <button
                type="button"
                onClick={alternarTema}
                className="inline-flex size-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-muted-foreground transition-all duration-300 hover:border-white/20 hover:bg-white/10 hover:text-foreground"
                aria-label="Alternar tema"
              >
                {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
              </button>

              <Button
                asChild
                variant="outline"
                className="rounded-full border-white/15 bg-white/5 px-5 text-foreground hover:bg-white/10"
              >
                <Link to="/milhas">Entrar</Link>
              </Button>

              <Button
                asChild
                className="rounded-full px-5 shadow-[0_0_40px_rgba(99,102,241,0.30)]"
              >
                <Link to="/destinos" className="inline-flex items-center gap-2">
                  Explorar
                  <ArrowRight size={16} />
                </Link>
              </Button>
            </div>

            <div className="flex items-center gap-2 lg:hidden">
              <button
                type="button"
                onClick={alternarTema}
                className="inline-flex size-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-muted-foreground transition-all duration-300 hover:border-white/20 hover:bg-white/10 hover:text-foreground"
                aria-label="Alternar tema"
              >
                {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
              </button>

              <button
                type="button"
                onClick={() => setMenuAberto((valor) => !valor)}
                className="inline-flex size-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-foreground transition-all duration-300 hover:border-white/20 hover:bg-white/10"
                aria-label="Abrir menu"
              >
                {menuAberto ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>

          <div
            className={`overflow-hidden border-t border-white/10 bg-background/80 backdrop-blur-2xl transition-all duration-300 lg:hidden ${
              menuAberto ? "max-h-[420px] opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            <div className="mx-auto max-w-7xl px-6 py-5">
              <div className="mb-5 rounded-3xl border border-white/10 bg-white/5 p-4 shadow-[0_18px_50px_rgba(0,0,0,0.16)]">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
                      Navegação
                    </p>
                    <h2 className="mt-1 text-lg font-semibold text-foreground">
                      {paginaAtual}
                    </h2>
                  </div>

                  <div className="rounded-full border border-white/10 bg-black/10 px-3 py-1 text-xs text-primary">
                    Locus
                  </div>
                </div>

                <div className="mt-4 grid gap-2">
                  {navegacao.map((item) => (
                    <NavLink
                      key={item.rota}
                      to={item.rota}
                      onClick={fecharMenu}
                      className={({ isActive }) =>
                        [
                          "rounded-2xl px-4 py-3 text-sm font-medium transition-all duration-300",
                          isActive
                            ? "border border-white/10 bg-white/10 text-foreground"
                            : "text-muted-foreground hover:bg-white/5 hover:text-foreground",
                        ].join(" ")
                      }
                    >
                      {item.nome}
                    </NavLink>
                  ))}
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  <Button
                    asChild
                    variant="outline"
                    className="rounded-full border-white/15 bg-white/5 text-foreground hover:bg-white/10"
                  >
                    <Link to="/milhas" onClick={fecharMenu}>
                      Entrar
                    </Link>
                  </Button>

                  <Button
                    asChild
                    className="rounded-full shadow-[0_0_35px_rgba(99,102,241,0.28)]"
                  >
                    <Link
                      to="/destinos"
                      onClick={fecharMenu}
                      className="inline-flex items-center gap-2"
                    >
                      Explorar
                      <ArrowRight size={16} />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  )
}

export default Header