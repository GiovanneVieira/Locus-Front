/* eslint-disable react-refresh/only-export-components */
import * as React from "react"
import { AlertCircle, CheckCircle2, Info, X } from "lucide-react"

/**
 * Sistema de toasts global.
 * Aplica Heurística 1 (Visibilidade do status do sistema):
 * o usuário recebe feedback imediato após cada ação importante.
 * Aplica Heurística 9 (Ajuda a reconhecer e recuperar de erros):
 * mensagens claras com tipo, ícone e tempo de leitura suficiente.
 */

export type ToastKind = "success" | "error" | "info"

interface ToastItem {
  id: string
  kind: ToastKind
  title: string
  description?: string
}

interface ToastContextValue {
  show: (toast: Omit<ToastItem, "id">) => void
  success: (title: string, description?: string) => void
  error: (title: string, description?: string) => void
  info: (title: string, description?: string) => void
}

const ToastContext = React.createContext<ToastContextValue | null>(null)

const TOAST_DURATION = 4500

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<ToastItem[]>([])
  const timeoutsRef = React.useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map())

  const dismiss = React.useCallback((id: string) => {
    setToasts((current) => current.filter((toast) => toast.id !== id))
    const timeout = timeoutsRef.current.get(id)
    if (timeout) {
      clearTimeout(timeout)
      timeoutsRef.current.delete(id)
    }
  }, [])

  const show = React.useCallback(
    (toast: Omit<ToastItem, "id">) => {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
      setToasts((current) => [...current, { ...toast, id }])
      const timeout = setTimeout(() => dismiss(id), TOAST_DURATION)
      timeoutsRef.current.set(id, timeout)
    },
    [dismiss]
  )

  const value = React.useMemo<ToastContextValue>(
    () => ({
      show,
      success: (title, description) => show({ kind: "success", title, description }),
      error: (title, description) => show({ kind: "error", title, description }),
      info: (title, description) => show({ kind: "info", title, description }),
    }),
    [show]
  )

  React.useEffect(() => {
    const timeouts = timeoutsRef.current
    return () => {
      timeouts.forEach((timeout) => clearTimeout(timeout))
      timeouts.clear()
    }
  }, [])

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        role="region"
        aria-label="Notificações"
        aria-live="polite"
        className="pointer-events-none fixed top-4 right-4 z-[100] flex w-full max-w-sm flex-col gap-2"
      >
        {toasts.map((toast) => (
          <ToastCard key={toast.id} toast={toast} onDismiss={() => dismiss(toast.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  )
}

interface ToastCardProps {
  toast: ToastItem
  onDismiss: () => void
}

const TONE_STYLES: Record<ToastKind, { bg: string; ring: string; text: string; Icon: typeof CheckCircle2 }> = {
  success: {
    bg: "bg-card",
    ring: "border-emerald-300 dark:border-emerald-500/40",
    text: "text-emerald-700 dark:text-emerald-300",
    Icon: CheckCircle2,
  },
  error: {
    bg: "bg-card",
    ring: "border-destructive/40",
    text: "text-destructive",
    Icon: AlertCircle,
  },
  info: {
    bg: "bg-card",
    ring: "border-primary/40",
    text: "text-primary",
    Icon: Info,
  },
}

function ToastCard({ toast, onDismiss }: ToastCardProps) {
  const styles = TONE_STYLES[toast.kind]
  const Icon = styles.Icon

  return (
    <div
      role={toast.kind === "error" ? "alert" : "status"}
      className={`pointer-events-auto flex items-start gap-3 rounded-2xl border ${styles.ring} ${styles.bg} p-4 shadow-md animate-in slide-in-from-right-4 fade-in`}
    >
      <span className={`mt-0.5 ${styles.text}`}>
        <Icon size={18} aria-hidden />
      </span>
      <div className="flex-1 text-sm">
        <p className="font-semibold leading-tight text-foreground">{toast.title}</p>
        {toast.description ? (
          <p className="mt-0.5 text-xs leading-5 text-muted-foreground">{toast.description}</p>
        ) : null}
      </div>
      <button
        type="button"
        onClick={onDismiss}
        className="inline-flex size-6 shrink-0 items-center justify-center rounded-md text-muted-foreground transition hover:bg-secondary hover:text-foreground"
        aria-label="Fechar notificação"
      >
        <X size={14} />
      </button>
    </div>
  )
}

export function useToast() {
  const context = React.useContext(ToastContext)
  if (!context) {
    throw new Error("useToast deve ser usado dentro de <ToastProvider>")
  }
  return context
}
