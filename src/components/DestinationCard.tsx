import { Link } from "react-router"
import { MapPinned, Plane } from "lucide-react"

interface DestinationCardProps {
  nome: string
  subtitulo: string
  periodo: string
  preco: string
  destaque?: string
  gradiente: string
}

export const DestinationCard = ({
  nome,
  subtitulo,
  periodo,
  preco,
  destaque,
  gradiente,
}: DestinationCardProps) => (
  <article className="glass-card locus-hover-lift group overflow-hidden p-5">
    <div className={`h-80 rounded-[28px] p-5 ${gradiente}`}>
      <div className="flex h-full flex-col justify-between">
        <div className="flex items-center justify-between gap-3">
          <span className="rounded-full border border-white/20 bg-black/15 px-4 py-2 text-xs font-medium text-white/90 backdrop-blur">
            {periodo}
          </span>
          <span className="rounded-full border border-white/20 bg-black/15 px-4 py-2 text-xs font-medium text-white/90 backdrop-blur">
            {preco}
          </span>
        </div>
        <div>
          <h2 className="text-3xl font-semibold text-white">{nome}</h2>
          <p className="mt-2 text-sm text-white/80">{subtitulo}</p>
        </div>
      </div>
    </div>
    {destaque && (
      <div className="mt-5">
        <p className="text-sm leading-7 text-muted-foreground">{destaque}</p>
      </div>
    )}
    <div className="mt-6 flex items-center justify-between">
      <span className="inline-flex items-center gap-2 text-sm text-muted-foreground">
        <MapPinned size={16} />
        Tour visual
      </span>
      <Link
        to="/planejamento"
        className="inline-flex items-center gap-2 text-sm font-medium text-foreground transition-transform group-hover:translate-x-1"
      >
        Explorar <Plane size={16} />
      </Link>
    </div>
  </article>
)
