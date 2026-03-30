import { BellRing, CreditCard, MapPinned, Route } from "lucide-react"
import { TrendChart } from "./TrendChart"

const panelItems = [
  {
    icon: MapPinned,
    label: "Destino sugerido",
    value: "Paris",
    desc: "Melhor equilíbrio entre clima e oportunidade atual.",
  },
  {
    icon: BellRing,
    label: "Alerta detectado",
    value: "Queda de 12%",
    desc: "Entrou em faixa atrativa nas últimas 48 horas.",
  },
  {
    icon: CreditCard,
    label: "Melhor cartão",
    value: "2,7 pts / dólar",
    desc: "Estratégia atual favorece acúmulo e compra em dinheiro.",
  },
  {
    icon: Route,
    label: "Roteiro inicial",
    value: "5 dias ideais",
    desc: "Dias desenhados com melhor ritmo e menos deslocamento.",
  },
]

export const ExperiencePanel = () => (
  <div className="rotating-glow relative">
    <div className="glass-card p-6 md:p-7">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <p className="text-sm text-muted-foreground">Painel de experiência</p>
          <h2 className="text-2xl font-semibold md:text-3xl">
            Sua próxima viagem em visão cinematográfica
          </h2>
        </div>
        <div className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-medium text-emerald-300">
          Ativo
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {panelItems.map((item) => (
          <div key={item.label} className="soft-card">
            <div className="mb-4 flex items-center gap-3">
              <item.icon size={18} className="text-primary" />
              <span className="text-sm font-medium">{item.label}</span>
            </div>
            <strong className="text-2xl font-semibold">{item.value}</strong>
            <p className="mt-2 text-sm leading-7 text-muted-foreground">
              {item.desc}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-6">
        <TrendChart
          title="Tendência de preço da semana"
          trendText="queda gradual"
          height="h-36"
          data={[
            { label: "D1", value: 85 },
            { label: "D2", value: 78 },
            { label: "D3", value: 74 },
            { label: "D4", value: 66 },
            { label: "D5", value: 58 },
            { label: "D6", value: 52 },
            {
              label: "D7",
              value: 46,
            },
          ]}
        />
      </div>
    </div>
  </div>
)
