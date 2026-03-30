import { Link } from "react-router"
import { ArrowRight, MapPinned } from "lucide-react"
import type { Destiny } from "../lib/types"

interface DestinationCardProps extends Destiny {
  gradiente: string
  highlight: string
}

export const DestinationCard = ({
  cidade,
  subtitulo,
  periodo,
  preco,
  gradiente,
}: DestinationCardProps) => (
  <article className="glass-card group overflow-hidden p-5">
    <div className={`h-72 rounded-[28px] p-5 ${gradiente}`}>
      <div className="flex h-full flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="rounded-full border border-white/20 bg-black/15 px-4 py-2 text-xs font-medium text-white/90 backdrop-blur">
            {periodo}
          </span>
          <span className="rounded-full border border-white/20 bg-black/15 px-4 py-2 text-xs font-medium text-white/90 backdrop-blur">
            {preco}
          </span>
        </div>
        <div>
          <h3 className="text-3xl font-semibold text-white">{cidade}</h3>
          <p className="mt-2 text-sm text-white/80">{subtitulo}</p>
        </div>
      </div>
    </div>
    <div className="mt-5 flex items-center justify-between">
      <span className="inline-flex items-center gap-2 text-sm text-muted-foreground">
        <MapPinned size={16} />
        Tour visual e leitura de viagem
      </span>
      <Link
        to="/destinos"
        className="inline-flex items-center gap-2 text-sm font-medium text-foreground transition-transform group-hover:translate-x-1"
      >
        Explorar <ArrowRight size={16} />
      </Link>
    </div>
  </article>
)
