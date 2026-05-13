interface LocusLogoProps {
  className?: string
  size?: number | string
  /** Cor do fundo da marca. Default: cor primária do tema. */
  background?: string
  /** Cor do "L" e do ponto. Default: branco. */
  foreground?: string
  /** Mostra apenas o L com fundo transparente (útil em headers escuros). */
  flat?: boolean
}

/**
 * Marca do Locus — letra L estilizada com um ponto de destino no canto
 * superior direito. O "L" é a letra da marca, o ponto representa o "locus"
 * (lugar, em latim) — o ponto de chegada da jornada.
 *
 * Composição:
 *  - Quadrado arredondado (raio 28/120 ≈ 23%) com cor da marca
 *  - L bold com remates retos
 *  - Ponto branco (anel) no canto superior direito
 */
const LocusLogo = ({
  className,
  size = 48,
  background,
  foreground = "white",
  flat = false,
}: LocusLogoProps) => {
  const bg = background ?? "oklch(0.55 0.21 258)"
  const numericSize = typeof size === "number" ? size : Number.parseFloat(size)
  const radius = Number.isFinite(numericSize) ? Math.round(numericSize * 0.235) : 28

  return (
    <svg
      className={className ?? ""}
      width={size}
      height={size}
      viewBox="0 0 120 120"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Locus"
    >
      {!flat ? (
        <rect x="0" y="0" width="120" height="120" rx={radius} fill={bg} />
      ) : null}

      {/* O "L" — letra da marca */}
      <path
        d="M30 22 L52 22 L52 76 L94 76 L94 98 L30 98 Z"
        fill={flat ? bg : foreground}
      />

      {/* Ponto de destino — o "locus" */}
      <circle cx="92" cy="32" r="11" fill={flat ? bg : foreground} />
      <circle cx="92" cy="32" r="4.5" fill={flat ? "transparent" : bg} />
    </svg>
  )
}

export default LocusLogo
