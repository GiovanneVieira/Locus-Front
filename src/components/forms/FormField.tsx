import type { ReactNode } from "react"

interface FormFieldProps {
  label: string
  required?: boolean
  error?: string | null
  hint?: string
  htmlFor?: string
  children: ReactNode
}

/**
 * Wrapper acessível para inputs.
 * Nielsen #9 (recuperação de erros): mostra mensagem em vermelho abaixo do campo.
 * Nielsen #5 (prevenção de erro): mostra dica antes do erro.
 */
export function FormField({ label, required, error, hint, htmlFor, children }: FormFieldProps) {
  return (
    <label htmlFor={htmlFor} className="flex flex-col gap-1.5">
      <span className="text-xs font-semibold text-foreground">
        {label}
        {required ? <span className="ml-0.5 text-destructive">*</span> : null}
      </span>
      {children}
      {error ? (
        <span role="alert" className="text-[11px] font-medium text-destructive">
          {error}
        </span>
      ) : hint ? (
        <span className="text-[11px] text-muted-foreground">{hint}</span>
      ) : null}
    </label>
  )
}

export default FormField
