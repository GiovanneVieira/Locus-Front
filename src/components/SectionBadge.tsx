import type { LucideIcon } from "lucide-react"
import type { ReactNode } from "react"

interface SectionBadgeProps {
  icon: LucideIcon
  children: ReactNode
  premium?: boolean
  className?: string
}

export const SectionBadge = ({
  icon: Icon,
  children,
  premium = false,
}: SectionBadgeProps) => (
  <div className={`section-badge ${premium ? "premium-ring" : ""} mb-4`}>
    <Icon size={16} />
    {children}
  </div>
)
