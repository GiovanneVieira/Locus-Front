import type { ReactNode } from "react"

interface HeroSectionProps {
  badge?: ReactNode
  title: ReactNode
  description: string
  actions?: ReactNode
}

export const HeroSection = ({
  badge,
  title,
  description,
  actions,
}: HeroSectionProps) => (
  <section className="relative">
    <div className="pointer-events-none absolute inset-0">
      <div className="hero-orb top-[60px] left-[-120px]" />
      <div className="hero-orb-secondary top-[20px] right-[-180px]" />
      <div className="grid-pattern absolute inset-0 opacity-35" />
    </div>

    <div className="relative mx-auto max-w-7xl px-6 pt-16 pb-16 md:pt-20 md:pb-20">
      <div className="mb-10 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          {badge}
          <h1 className="max-w-4xl text-4xl font-semibold tracking-tight md:text-5xl xl:text-6xl">
            {title}
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-8 text-muted-foreground md:text-lg">
            {description}
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:w-[360px]">{actions}</div>
      </div>
    </div>
  </section>
)
