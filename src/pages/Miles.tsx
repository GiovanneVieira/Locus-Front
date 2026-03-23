import { Link } from "react-router-dom"
import {
  ArrowRight,
  CheckCircle2,
  CreditCard,
  Landmark,
  Sparkles,
  TrendingDown,
  Wallet,
} from "lucide-react"

import Header from "@/components/Header/Header"
import { Button } from "@/components/ui/button"

const programas = [
  { nome: "Azul", saldo: "62.100 pts", progresso: 72 },
  { nome: "LATAM", saldo: "38.400 pts", progresso: 44 },
  { nome: "Livelo", saldo: "48.200 pts", progresso: 55 },
]

const estrategias = [
  "Centralizar gastos internacionais no cartão premium",
  "Aguardar janela de transferência bonificada",
  "Comparar emissão com dinheiro antes de resgatar pontos",
  "Cruzar saldo atual com radar de oportunidade por rota",
]

const comparativos = [
  { label: "Compra em dinheiro", value: "R$ 3.180" },
  { label: "Emissão com milhas", value: "87.000 pts + taxas" },
  { label: "Melhor decisão", value: "Pagar agora e acumular pontos" },
]

function MilesPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      <main className="overflow-hidden">
        <section className="relative">
          <div className="pointer-events-none absolute inset-0">
            <div className="hero-orb left-[-120px] top-[80px]" />
            <div className="hero-orb-secondary right-[-180px] top-[20px]" />
            <div className="grid-pattern absolute inset-0 opacity-35" />
          </div>

          <div className="relative mx-auto max-w-7xl px-6 pb-16 pt-16 md:pb-20 md:pt-20">
            <div className="mb-10 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <div className="section-badge premium-ring mb-4">
                  <CreditCard size={16} />
                  Estratégia de milhas e cartões
                </div>

                <h1 className="max-w-4xl text-4xl font-semibold tracking-tight md:text-5xl xl:text-6xl">
                  Economizar pode ser
                  <span className="gradient-text block">bonito, simples e inteligente.</span>
                </h1>

                <p className="mt-5 max-w-2xl text-base leading-8 text-muted-foreground md:text-lg">
                  Esta tela mostra ao usuário onde concentrar gastos, quando
                  faz sentido emitir e como comparar milhas com dinheiro de forma clara.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 lg:w-[360px]">
                <Button asChild className="rounded-full px-6">
                  <Link to="/radar" className="inline-flex items-center gap-2">
                    Ver radar
                    <ArrowRight size={16} />
                  </Link>
                </Button>

                <Button
                  asChild
                  variant="outline"
                  className="rounded-full border-white/15 bg-white/5 px-6 text-foreground hover:bg-white/10"
                >
                  <Link to="/planejamento">Planejar viagem</Link>
                </Button>
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
              <section className="glass-card p-8">
                <div className="mb-4 flex items-center gap-3">
                  <Wallet className="text-primary" size={18} />
                  <span className="text-sm font-medium">Saldo consolidado</span>
                </div>

                <strong className="block text-5xl font-semibold">148.700</strong>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">
                  Estimativa total consolidada considerando programas, cartões e
                  projeção de acúmulo recente.
                </p>

                <div className="mt-6 space-y-4">
                  {programas.map((item) => (
                    <div
                      key={item.nome}
                      className="rounded-[24px] border border-white/10 bg-white/5 p-4"
                    >
                      <div className="mb-3 flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">{item.nome}</span>
                        <span className="text-sm font-medium">{item.saldo}</span>
                      </div>

                      <div className="h-3 rounded-full bg-white/10">
                        <div
                          className="h-3 rounded-full bg-gradient-to-r from-primary to-cyan-300"
                          style={{ width: `${item.progresso}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <section className="grid gap-6">
                <article className="glass-card locus-hover-lift p-6">
                  <div className="mb-4 flex items-center gap-3">
                    <TrendingDown className="text-primary" size={18} />
                    <span className="text-sm font-medium">Estratégia sugerida</span>
                  </div>

                  <h2 className="text-2xl font-semibold">
                    Melhor decisão hoje: pagar em dinheiro e acumular pontos
                  </h2>

                  <p className="mt-4 text-sm leading-7 text-muted-foreground">
                    Para este cenário, usar milhas agora ainda não supera o valor
                    da compra em dinheiro. O produto ajuda o usuário a entender isso sem esforço.
                  </p>
                </article>

                <article className="glass-card locus-hover-lift p-6">
                  <div className="mb-4 flex items-center gap-3">
                    <Landmark className="text-primary" size={18} />
                    <span className="text-sm font-medium">Regras práticas</span>
                  </div>

                  <div className="space-y-4">
                    {estrategias.map((item) => (
                      <div key={item} className="flex items-start gap-3">
                        <CheckCircle2 className="mt-0.5 text-primary" size={18} />
                        <span className="text-sm leading-7 text-muted-foreground">
                          {item}
                        </span>
                      </div>
                    ))}
                  </div>
                </article>
              </section>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 pb-24">
          <div className="mb-8 flex items-center gap-3">
            <Sparkles size={18} className="text-primary" />
            <span className="text-sm font-medium text-muted-foreground">
              Comparação direta para decisão
            </span>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {comparativos.map((item) => (
              <article key={item.label} className="glass-card locus-hover-lift p-6">
                <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
                  {item.label}
                </p>
                <strong className="mt-2 block text-2xl font-semibold">{item.value}</strong>
              </article>
            ))}
          </div>

          <div className="glass-card mt-10 p-8">
            <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
              <div>
                <div className="section-badge mb-4">
                  <CreditCard size={16} />
                  Inteligência financeira aplicada à viagem
                </div>
                <h3 className="text-3xl font-semibold tracking-tight md:text-4xl">
                  Esta página deixa claro que o Locus não fala só de destino: ele fala de decisão.
                </h3>
                <p className="mt-4 max-w-2xl text-base leading-8 text-muted-foreground">
                  O valor aqui está em traduzir estratégia de cartão, pontos e emissão
                  para algo visual, bonito e rápido de entender.
                </p>
              </div>

              <div className="grid gap-4">
                {[
                  "Saldo consolidado com visual premium",
                  "Comparativo claro entre dinheiro e pontos",
                  "Base perfeita para evolução futura",
                ].map((item) => (
                  <div
                    key={item}
                    className="rounded-[24px] border border-white/10 bg-white/5 px-5 py-4"
                  >
                    <span className="text-sm font-medium">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

export default MilesPage