import { Link } from "react-router"
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
import { Progress } from "@/components/ui/progress"
import { Hero } from "@/components/Hero"
import { SectionBadge } from "@/components/SectionBadge"
import { StatCard } from "@/components/StatCard"
import { FeatureCheck } from "@/components/FeatureCheck"
import { Footer } from "@/components/Footer"

// Tipagem
// Tipagem
import type { Comparison, LoyaltyProgram } from "../lib/types"

const programas: LoyaltyProgram[] = [
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

const comparativos: Comparison[] = [
  { label: "Compra em dinheiro", value: "R$ 3.180" },
  { label: "Emissão com milhas", value: "87.000 pts + taxas" },
  { label: "Melhor decisão", value: "Pagar agora e acumular pontos" },
]

export default function MilesPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      <main className="overflow-hidden">
        {/* HERO - ESTRATÉGIA FINANCEIRA */}
        <Hero
          badge={
            <SectionBadge icon={CreditCard} premium>
              Estratégia de milhas e cartões
            </SectionBadge>
          }
          title={
            <>
              Economizar pode ser
              <span className="gradient-text block">
                bonito, simples e inteligente.
              </span>
            </>
          }
          description="Esta tela centraliza onde concentrar seus gastos, quando faz sentido emitir e como comparar milhas com dinheiro de forma visual e clara."
          actions={
            <>
              <Button asChild className="rounded-full px-6 shadow-lg">
                <Link to="/radar" className="inline-flex items-center gap-2">
                  Ver radar
                  <ArrowRight size={16} />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="rounded-full border-border bg-secondary/50 px-6 text-foreground hover:bg-secondary"
              >
                <Link to="/planejamento">Planejar viagem</Link>
              </Button>
            </>
          }
        />

        {/* PAINEL DE SALDOS E ESTRATÉGIA (GRID 0.95fr / 1.05fr) */}
        <section className="mx-auto max-w-7xl px-6 pb-20">
          <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
            {/* COLUNA ESQUERDA: WALLET & PROGRESSO */}
            <article className="glass-card p-8">
              <div className="mb-6 flex items-center gap-3">
                <Wallet className="text-primary" size={18} />
                <span className="text-sm font-medium tracking-wider uppercase">
                  Saldo consolidado
                </span>
              </div>

              <div className="mb-8">
                <strong className="block text-5xl font-semibold tracking-tight">
                  148.700
                </strong>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">
                  Estimativa total considerando programas, cartões e projeção de
                  acúmulo recente.
                </p>
              </div>

              <div className="space-y-6">
                {programas.map((item) => (
                  <div key={item.nome} className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">{item.nome}</span>
                      <span className="font-medium">{item.saldo}</span>
                    </div>
                    {/* Utilizando Shadcn Progress com gradiente do index.css */}
                    <Progress
                      value={item.progresso}
                      className="h-2.5 bg-secondary"
                    />
                  </div>
                ))}
              </div>
            </article>

            {/* COLUNA DIREITA: DECISÃO E REGRAS */}
            <div className="grid gap-6">
              <StatCard
                icone={TrendingDown}
                titulo="Estratégia sugerida"
                valor="Decisão de Compra"
                descricao="Melhor decisão hoje: pagar em dinheiro e acumular pontos. O uso de milhas agora não supera o valor da compra direta."
                className="locus-hover-lift"
              />

              <article className="glass-card p-8">
                <div className="mb-6 flex items-center gap-3">
                  <Landmark className="text-primary" size={18} />
                  <span className="text-sm font-medium tracking-wider uppercase">
                    Regras práticas
                  </span>
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
            </div>
          </div>
        </section>

        {/* COMPARATIVO DIRETO */}
        <section className="mx-auto max-w-7xl px-6 py-20">
          <div className="mb-10 flex items-center gap-3">
            <Sparkles size={18} className="text-primary" />
            <span className="text-sm font-medium tracking-widest text-muted-foreground uppercase">
              Comparação direta para decisão
            </span>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {comparativos.map((item) => (
              <StatCard
                key={item.label}
                titulo={item.label}
                valor={item.value}
                descricao="" // Apenas valor e título neste card de comparação
                icone={CreditCard}
                className="locus-hover-lift"
              />
            ))}
          </div>
        </section>

        {/* SEÇÃO FINAL: INTELIGÊNCIA FINANCEIRA */}
        <section className="mx-auto max-w-7xl px-6 pb-24">
          <div className="glass-card p-8">
            <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
              <div>
                <SectionBadge icon={CreditCard} className="mb-4">
                  Inteligência aplicada
                </SectionBadge>
                <h3 className="text-3xl font-semibold tracking-tight md:text-4xl">
                  O Locus não fala apenas de destinos, ele fala de decisões
                  seguras.
                </h3>
                <p className="mt-6 text-base leading-8 text-muted-foreground">
                  Traduzimos estratégias complexas de cartões e pontos para uma
                  interface visual intuitiva, permitindo que você foque no que
                  importa: a experiência da viagem.
                </p>
              </div>

              <div className="grid gap-4">
                {[
                  "Saldo consolidado com visual premium",
                  "Comparativo claro entre dinheiro e pontos",
                  "Base perfeita para evolução financeira",
                ].map((item) => (
                  <FeatureCheck key={item} text={item} />
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
