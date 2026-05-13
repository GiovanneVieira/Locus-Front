import type { ReactNode } from "react"

interface FormSectionProps {
  title: string
  description?: string
  children: ReactNode
}

/**
 * Bloco de formulário com título e descrição.
 * Nielsen #4 (consistência): todas as seções do form seguem a mesma estrutura.
 */
export function FormSection({ title, description, children }: FormSectionProps) {
  return (
    <fieldset className="flex flex-col gap-4">
      <legend className="flex flex-col gap-0.5">
        <span className="text-sm font-semibold text-foreground">{title}</span>
        {description ? (
          <span className="text-xs text-muted-foreground">{description}</span>
        ) : null}
      </legend>
      {children}
    </fieldset>
  )
}

export default FormSection
