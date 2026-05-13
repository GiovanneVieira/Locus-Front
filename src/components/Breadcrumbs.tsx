import { ChevronRight, Home } from "lucide-react"
import { Link } from "react-router"

export interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[]
  className?: string
}

/**
 * Trilha de navegação que mostra onde o usuário está.
 *
 * Aplica Heurística 1 (Visibilidade do status):
 * o usuário sempre sabe em qual nível da hierarquia está.
 *
 * Aplica Heurística 3 (Controle e liberdade):
 * permite voltar a qualquer nível anterior com um clique.
 *
 * Aplica Heurística 6 (Reconhecimento):
 * mostra o caminho visualmente, sem o usuário precisar lembrar.
 */
export function Breadcrumbs({ items, className }: BreadcrumbsProps) {
  return (
    <nav aria-label="Trilha de navegação" className={className}>
      <ol className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
        <li>
          <Link
            to="/"
            className="inline-flex items-center gap-1 rounded-md px-1.5 py-1 transition hover:bg-secondary hover:text-foreground"
            aria-label="Início"
          >
            <Home size={12} />
            <span className="sr-only">Início</span>
          </Link>
        </li>
        {items.map((item, index) => {
          const isLast = index === items.length - 1
          return (
            <li key={`${item.label}-${index}`} className="inline-flex items-center gap-1.5">
              <ChevronRight size={12} className="text-muted-foreground/60" aria-hidden />
              {isLast || !item.href ? (
                <span
                  aria-current={isLast ? "page" : undefined}
                  className="rounded-md px-1.5 py-1 font-medium text-foreground"
                >
                  {item.label}
                </span>
              ) : (
                <Link
                  to={item.href}
                  className="rounded-md px-1.5 py-1 transition hover:bg-secondary hover:text-foreground"
                >
                  {item.label}
                </Link>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

export default Breadcrumbs
