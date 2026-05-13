import { useState } from "react"
import { Link, useParams } from "react-router"

import LocusLogo from "@/components/LocusLogo"
import Login from "@/components/auth/Login"
import Register from "@/components/auth/Register"

const AuthPage = () => {
  const [currentCard, setCurrentCard] = useState<"login" | "register">("login")
  const { context } = useParams()

  const backPath = context ? `/${context}` : "/"

  return (
    <div className="relative flex items-center justify-center overflow-hidden bg-background text-foreground outline-2">
      <div className="pointer-events-none absolute inset-0">
        <div className="hero-orb top-[10%] left-[-10%] opacity-60" />
        <div className="hero-orb-secondary right-[-5%] bottom-[10%] opacity-50" />
        <div className="grid-pattern absolute inset-0 opacity-20" />
      </div>

      <div className="glass-card relative flex h-full w-full flex-col gap-8 rounded-none border-none p-8 shadow-none transition-none hover:transform-none md:p-10">
        <div className="flex flex-col items-center gap-6">
          <Link to={backPath} className="hover:scale-105 transition-transform">
            <LocusLogo className="size-10" />
          </Link>

          <div className="flex w-full flex-col items-center gap-2">
            <h1 className="text-2xl font-semibold tracking-tight">
              {currentCard === "login" ? "Bem-vindo de volta" : "Crie sua conta"}
            </h1>
            <p className="text-sm text-muted-foreground">
              {currentCard === "login"
                ? "Acesse sua inteligência de viagem"
                : "Comece sua jornada no Locus"}
            </p>
          </div>

          <div className="flex w-full rounded-2xl border border-border bg-secondary/50 p-1">
            <button
              onClick={() => setCurrentCard("login")}
              className={`flex-1 cursor-pointer rounded-xl py-2 text-sm font-medium transition-all ${
                currentCard === "login"
                  ? "bg-primary text-primary-foreground shadow-lg"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Entre
            </button>
            <button
              onClick={() => setCurrentCard("register")}
              className={`flex-1 cursor-pointer rounded-xl py-2 text-sm font-medium transition-all ${
                currentCard === "register"
                  ? "bg-primary text-primary-foreground shadow-lg"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Cadastre-se
            </button>
          </div>
        </div>

        <div className="relative min-h-[300px]">
          {currentCard === "login" ? <Login /> : <Register />}
        </div>
      </div>
    </div>
  )
}

export default AuthPage