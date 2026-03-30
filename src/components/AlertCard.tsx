import { Star } from "lucide-react"

export const AlertCard = ({ text }: { text: string }) => (
  <div className="rounded-[24px] border border-white/10 bg-white/5 p-4 transition-colors hover:bg-white/10">
    <div className="flex items-start gap-3">
      <Star size={18} className="mt-0.5 text-primary" />
      <p className="text-sm leading-7 text-muted-foreground">{text}</p>
    </div>
  </div>
)
