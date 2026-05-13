interface StepCardProps {
  etapa: number
  titulo: string
  descricao: string
}

export const StepCard = ({ etapa, titulo, descricao }: StepCardProps) => (
  <article className="rounded-[26px] border border-border bg-secondary/50 p-5">
    <div className="mb-3 inline-flex rounded-full border border-border bg-black/15 px-3 py-1 text-xs text-primary">
      Etapa {etapa}
    </div>
    <h2 className="text-xl font-semibold">{titulo}</h2>
    <p className="mt-3 text-sm leading-7 text-muted-foreground">{descricao}</p>
  </article>
)
