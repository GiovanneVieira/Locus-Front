import { Progress } from "@/components/ui/progress"

interface ProgramStatusProps {
  nome: string
  saldo: string
  valorProgresso: number
}

export const ProgramStatus = ({
  nome,
  saldo,
  valorProgresso,
}: ProgramStatusProps) => (
  <div className="rounded-[24px] border border-border bg-secondary/50 p-4">
    <div className="mb-3 flex items-center justify-between">
      <span className="text-sm text-muted-foreground">{nome}</span>
      <span className="text-sm font-medium">{saldo}</span>
    </div>
    <Progress value={valorProgresso} className="h-3 bg-secondary" />
  </div>
)
