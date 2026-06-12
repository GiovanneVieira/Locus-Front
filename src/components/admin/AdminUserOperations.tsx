import { useState } from "react"
import { Ban, Loader2, PauseCircle, Shield, Trash2, Undo2 } from "lucide-react"

import ConfirmDialog from "@/components/feedback/ConfirmDialog"
import { Button } from "@/components/ui/button"
import type { AdminUser } from "@/lib/types"

interface AdminUserOperationsProps {
  user: AdminUser
  isSelf: boolean
  busy: boolean
  onRoleChange: (nextRole: string) => void
  onBanToggle: () => void | Promise<void>
  onDelete: () => void | Promise<void>
}

type PendingDialog = "ban" | "delete" | null

export function AdminUserOperations({
  user,
  isSelf,
  busy,
  onRoleChange,
  onBanToggle,
  onDelete,
}: AdminUserOperationsProps) {
  const [pendingDialog, setPendingDialog] = useState<PendingDialog>(null)
  const disabled = isSelf || busy
  const isBanned = Boolean(user.blocked)

  return (
    <div className="flex flex-wrap items-center gap-2">
      <label className="inline-flex items-center gap-1.5 rounded-full border border-border bg-secondary/50 px-3 py-1.5 text-xs font-medium text-muted-foreground">
        <Shield size={12} />
        <select
          aria-label={`Alterar permissão de ${user.name}`}
          value={String(user.role).toUpperCase()}
          disabled={disabled}
          onChange={(event) => onRoleChange(event.target.value)}
          className="bg-transparent text-foreground outline-none disabled:opacity-60"
        >
          <option value="COMMON">Comum</option>
          <option value="HOST">Anfitrião</option>
          <option value="ADMIN">Admin</option>
        </select>
      </label>

      <Button
        size="sm"
        variant="outline"
        disabled={disabled}
        onClick={() => setPendingDialog("ban")}
        className="gap-1.5 rounded-full border-border px-3 text-xs"
      >
        {busy ? (
          <Loader2 size={12} className="animate-spin" />
        ) : isBanned ? (
          <Undo2 size={12} />
        ) : (
          <Ban size={12} />
        )}
        {isBanned ? "Reativar" : "Banir"}
      </Button>

      <Button
        size="sm"
        variant="outline"
        disabled
        title="Estrutura reservada para endpoint de inativação temporária."
        className="gap-1.5 rounded-full border-border px-3 text-xs opacity-60"
      >
        <PauseCircle size={12} /> Inativar
      </Button>

      <Button
        size="sm"
        variant="outline"
        disabled={disabled}
        onClick={() => setPendingDialog("delete")}
        className="gap-1.5 rounded-full border-destructive/40 px-3 text-xs text-destructive hover:bg-destructive/10"
      >
        <Trash2 size={12} /> Excluir
      </Button>

      <ConfirmDialog
        open={pendingDialog === "ban"}
        onOpenChange={(open) => setPendingDialog(open ? "ban" : null)}
        title={isBanned ? "Reativar usuário" : "Banir usuário"}
        description={
          isBanned
            ? `Reativar o acesso de ${user.name} à plataforma?`
            : `Banir ${user.name} bloqueia totalmente o acesso da conta até nova revisão administrativa.`
        }
        confirmLabel={isBanned ? "Reativar" : "Banir usuário"}
        destructive={!isBanned}
        loading={busy}
        onConfirm={async () => {
          await onBanToggle()
          setPendingDialog(null)
        }}
      />

      <ConfirmDialog
        open={pendingDialog === "delete"}
        onOpenChange={(open) => setPendingDialog(open ? "delete" : null)}
        title="Excluir conta"
        description={`Excluir a conta de ${user.name}? Esta ação é definitiva e não pode ser desfeita.`}
        confirmLabel="Excluir conta"
        destructive
        loading={busy}
        onConfirm={async () => {
          await onDelete()
          setPendingDialog(null)
        }}
      />
    </div>
  )
}
