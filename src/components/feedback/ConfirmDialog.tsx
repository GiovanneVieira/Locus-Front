import { AlertTriangle, Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';

interface ConfirmDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title: string;
    description: string;
    confirmLabel?: string;
    cancelLabel?: string;
    /** Tom destrutivo? Default: false */
    destructive?: boolean;
    loading?: boolean;
    onConfirm: () => void | Promise<void>;
}

/**
 * Modal acessível de confirmação para ações destrutivas ou irreversíveis.
 *
 * Aplica Heurística 5 (Prevenção de erros):
 * cria uma barreira antes de o usuário cometer um engano irreversível.
 *
 * Aplica Heurística 3 (Controle e liberdade):
 * sempre oferece um "Cancelar" claro como saída de emergência.
 *
 * Substitui o `window.confirm()` nativo, que é feio, não tem foco
 * acessível e impossibilita customização.
 */
export function ConfirmDialog({
    open,
    onOpenChange,
    title,
    description,
    confirmLabel = 'Confirmar',
    cancelLabel = 'Cancelar',
    destructive = false,
    loading = false,
    onConfirm,
}: ConfirmDialogProps) {
    return (
        <Dialog
            open={open}
            onOpenChange={(value) => !loading && onOpenChange(value)}>
            <DialogContent className="max-w-md rounded-3xl border-border bg-card sm:rounded-3xl">
                <DialogHeader>
                    {destructive ? (
                        <div className="mb-2 flex size-12 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
                            <AlertTriangle size={20} />
                        </div>
                    ) : null}
                    <DialogTitle className="text-lg">
                        {title}
                    </DialogTitle>
                    <DialogDescription className="text-sm leading-6 text-muted-foreground">
                        {description}
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="flex flex-row justify-end gap-2 pt-2">
                    <Button
                        type="button"
                        variant="outline"
                        className="rounded-xl"
                        onClick={() => onOpenChange(false)}
                        disabled={loading}>
                        {cancelLabel}
                    </Button>
                    <Button
                        type="button"
                        variant={
                            destructive ? 'destructive' : 'default'
                        }
                        className="rounded-xl"
                        onClick={() => void onConfirm()}
                        disabled={loading}
                        autoFocus>
                        {loading ? (
                            <>
                                <Loader2
                                    size={14}
                                    className="animate-spin"
                                />
                                Processando…
                            </>
                        ) : (
                            confirmLabel
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export default ConfirmDialog;
