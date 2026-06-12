import { useState } from "react"
import { Link } from "react-router"
import { ExternalLink, Loader2, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"

interface AdminHostingModerationActionsProps {
  addressId: string
  addressTitle: string
  busy: boolean
  onRemove: (reason: string) => void | Promise<void>
}

export function AdminHostingModerationActions({
  addressId,
  addressTitle,
  busy,
  onRemove,
}: AdminHostingModerationActionsProps) {
  const [open, setOpen] = useState(false)
  const [reason, setReason] = useState("")
  const canConfirm = reason.trim().length >= 8

  async function handleConfirm() {
    if (!canConfirm) return
    await onRemove(reason.trim())
    setReason("")
    setOpen(false)
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button
        asChild
        size="sm"
        variant="outline"
        className="gap-1.5 rounded-full border-border px-3 text-xs"
      >
        <Link to={`/enderecos/${addressId}`}>
          <ExternalLink size={12} /> Ver detalhes
        </Link>
      </Button>

      <Button
        size="sm"
        variant="outline"
        disabled={busy}
        onClick={() => setOpen(true)}
        className="gap-1.5 rounded-full border-destructive/40 px-3 text-xs text-destructive hover:bg-destructive/10"
      >
        {busy ? <Loader2 size={12} className="animate-spin" /> : <Trash2 size={12} />}
        Remover anúncio
      </Button>

      <Dialog open={open} onOpenChange={(value) => !busy && setOpen(value)}>
        <DialogContent className="max-w-lg rounded-3xl border-border bg-card sm:rounded-3xl">
          <DialogHeader>
            <DialogTitle>Remover anúncio</DialogTitle>
            <DialogDescription>
              Informe a justificativa da moderação antes de excluir definitivamente "{addressTitle}".
            </DialogDescription>
          </DialogHeader>

          <label className="space-y-2 text-xs font-medium text-muted-foreground">
            <span>Justificativa do moderador</span>
            <Textarea
              value={reason}
              onChange={(event) => setReason(event.target.value)}
              placeholder="Ex.: anúncio viola as normas de segurança da plataforma."
              rows={4}
              disabled={busy}
            />
            <span className="block text-[11px] text-muted-foreground/80">
              Mínimo de 8 caracteres para prevenir exclusões acidentais.
            </span>
          </label>

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              className="rounded-xl"
              disabled={busy}
              onClick={() => setOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              type="button"
              variant="destructive"
              className="rounded-xl"
              disabled={!canConfirm || busy}
              onClick={() => void handleConfirm()}
            >
              {busy ? (
                <>
                  <Loader2 size={14} className="animate-spin" /> Removendo...
                </>
              ) : (
                "Remover definitivamente"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
