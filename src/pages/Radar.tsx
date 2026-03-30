import { Link } from "react-router"
import {
  ArrowRight,
  BellRing,
  CalendarDays,
  Radar,
  Search,
  TrendingDown,
  Waves,
} from "lucide-react"

import Header from "@/components/Header/Header"
import { Button } from "@/components/ui/button"
import { Hero } from "@/components/Hero"
import { SectionBadge } from "@/components/SectionBadge"
import { TrendChart } from "@/components/TrendChart"
import { AlertCard } from "@/components/AlertCard"
import { StatCard } from "@/components/StatCard"
import { FeatureCheck } from "@/components/FeatureCheck"
import { Footer } from "@/components/Footer"

// Interfaces de dados
// Interfaces de dados
import type { Insight } from "../lib/types"

const barras = [
  { label: "Seg", value: 86 },
  { label: "Ter", value: 79 },
  { label: "Qua", value: 72 },
  { label: "Qui", value: 65 },
  { label: "Sex", value: 58 },
  { label: "Sáb", value: 51 },
  { label: "Dom", value: 45 },
]

const alertas = [
  "GRU → CDG entrou em faixa atrativa de compra",
  "Tóquio apresentou queda consistente por 3 dias",
  "Santiago ficou estável, com chance de nova baixa",
  "Bariloche subiu, mas segue abaixo da média mensal",
]

const insights: Insight[] = [
  {
    titulo: "Melhor janela",
    valor: "58 a 72 dias antes",
    descricao: "Faixa que mais concentrou oportunidades relevantes.",
  },
  {
    titulo: "Status atual",
    valor: "Comprar em breve",
    descricao: "O preço caiu e já entrou em zona muito competitiva.",
  },
  {
    titulo: "Próxima leitura",
    valor: "Amanhã às 09:00",
    descricao: "Nova atualização automática da tendência monitorada.",
  },
]

export default function RadarPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      <main className="overflow-hidden">
        {/* HERO SECTION - REUTILIZANDO PADRÃO DE FUNDO E TEXTO */}
        <Hero
          badge={
            <SectionBadge icon={Radar} premium>
              Radar inteligente de oportunidades
            </SectionBadge>
          }
          title={
            <>
              Saiba quando esperar,
              <span className="gradient-text block">
                quando comprar e quando agir.
              </span>
            </>
          }
          description="Esta página é sua central premium de decisão: tendência, alertas e leitura de rota em um painel visual simples e poderoso."
          actions={
            <>
              <Button asChild className="rounded-full px-6">
                <Link to="/milhas" className="inline-flex items-center gap-2">
                  Ver milhas
                  <ArrowRight size={16} />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="rounded-full border-white/15 bg-white/5 px-6 text-foreground hover:bg-white/10"
              >
                <Link to="/destinos">Explorar destinos</Link>
              </Button>
            </>
          }
        />

        {/* PAINEL DE MONITORAMENTO (GRID 1.12fr / 0.88fr) */}
        <section className="mx-auto max-w-7xl px-6 pb-20">
          <div className="grid gap-6 lg:grid-cols-[1.12fr_0.88fr]">
            <article className="glass-card p-8">
              <div className="mb-6 flex items-center gap-3">
                <Search className="text-primary" size={18} />
                <span className="text-sm font-medium tracking-wider uppercase">
                  Tendência semanal
                </span>
              </div>

              <TrendChart
                title="Trecho monitorado: São Paulo → Paris"
                trendText="queda de 12%"
                data={barras}
                height="h-60"
              />
            </article>

            <article className="glass-card p-8">
              <div className="mb-6 flex items-center gap-3">
                <BellRing className="text-primary" size={18} />
                <span className="text-sm font-medium tracking-wider uppercase">
                  Alertas relevantes
                </span>
              </div>

              <div className="space-y-4">
                {alertas.map((alerta) => (
                  <AlertCard key={alerta} text={alerta} />
                ))}
              </div>
            </article>
          </div>
        </section>

        {/* INSIGHTS ACIONÁVEIS */}
        <section className="mx-auto max-w-7xl px-6 py-20">
          <div className="mb-10 flex items-center gap-3">
            <Waves size={18} className="text-primary" />
            <span className="text-sm font-medium tracking-widest text-muted-foreground uppercase">
              Insights acionáveis do radar
            </span>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {insights.map((item) => (
              <StatCard
                key={item.titulo}
                titulo={item.titulo}
                valor={item.valor}
                descricao={item.descricao}
                icone={CalendarDays}
                className="locus-hover-lift"
              />
            ))}
          </div>
        </section>

        {/* SEÇÃO FINAL DE VALOR */}
        <section className="mx-auto max-w-7xl px-6 pb-24">
          <div className="glass-card p-8">
            <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
              <div>
                <SectionBadge icon={TrendingDown} className="mb-4">
                  Decisão orientada por momento
                </SectionBadge>
                <h3 className="text-3xl font-semibold tracking-tight md:text-4xl">
                  O radar transforma incerteza em leitura clara de oportunidade.
                </h3>
                <p className="mt-6 max-w-2xl text-base leading-8 text-muted-foreground">
                  A força desta tela é dizer o que fazer sem precisar
                  interpretar gráficos complexos. É visual, útil e desenhado
                  para converter decisão em ação imediata.
                </p>
              </div>

              <div className="grid gap-4">
                {[
                  "Queda e tendência visualmente claras",
                  "Cards de alerta fáceis de consumir",
                  "Pronto para integrar dados reais via API",
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
