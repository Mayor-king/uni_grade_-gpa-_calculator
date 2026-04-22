import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { GradeDistributionPoint } from '../../types/academic'

interface GradeDistributionChartProps {
  data: GradeDistributionPoint[]
}

export function GradeDistributionChart({
  data,
}: GradeDistributionChartProps) {
  return (
    <article className="chart-card">
      <div className="chart-card__header">
        <h3>Grade Distribution</h3>
        <p>Count how many As, Bs, Cs, and other grades you have recorded.</p>
      </div>

      <div className="chart-card__body">
        {data.some((entry) => entry.count > 0) ? (
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={data}>
              <CartesianGrid stroke="var(--color-border-muted)" strokeDasharray="4 4" />
              <XAxis dataKey="grade" tickLine={false} axisLine={false} />
              <YAxis allowDecimals={false} tickLine={false} axisLine={false} />
              <Tooltip />
              <Bar
                dataKey="count"
                fill="var(--color-chart-secondary)"
                radius={[10, 10, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p className="chart-placeholder">Grade counts will appear here.</p>
        )}
      </div>
    </article>
  )
}
