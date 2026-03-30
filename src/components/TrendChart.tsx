interface TrendChartProps {
  data: { label: string; value: number }[]
  title: string
  trendText: string
}

export const TrendChart = ({ data, title, trendText }: TrendChartProps) => (
  <div className="border-highlight rounded-[28px] p-5">
    <div className="mb-4 flex items-center justify-between text-sm">
      <span className="text-muted-foreground">{title}</span>
      <span className="text-emerald-300">{trendText}</span>
    </div>
    <div className="flex h-40 items-end gap-3">
      {data.map((item, i) => (
        <div key={i} className="flex flex-1 flex-col items-center gap-2">
          <div
            className="w-full rounded-t-2xl bg-gradient-to-t from-primary/35 via-primary/70 to-cyan-300"
            style={{ height: `${item.value}%` }}
          />
          <span className="text-xs text-muted-foreground">{item.label}</span>
        </div>
      ))}
    </div>
  </div>
)
