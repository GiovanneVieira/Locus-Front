import { CheckCircle2 } from "lucide-react"

export const FeatureCheck = ({ text }: { text: string }) => (
  <div className="rounded-[24px] border border-border bg-secondary/50 px-5 py-4 transition-colors hover:bg-secondary">
    <div className="flex items-center gap-3">
      <CheckCircle2 size={18} className="text-primary" />
      <span className="text-sm font-medium">{text}</span>
    </div>
  </div>
)
