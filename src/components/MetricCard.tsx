interface MetricCardProps {
  label: string
  value: string
  detail: string
}

export function MetricCard({ label, value, detail }: MetricCardProps) {
  return (
    <article className="metric-card panel">
      <span className="section-label">{label}</span>
      <strong>{value}</strong>
      <p>{detail}</p>
    </article>
  )
}
