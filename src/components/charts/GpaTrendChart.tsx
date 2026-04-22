import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { TrendPoint } from '../../types/academic'
import { formatNumber } from '../../utils/formatters'

interface GpaTrendChartProps {
  data: TrendPoint[]
}

export function GpaTrendChart({ data }: GpaTrendChartProps) {
  return (
    <article className="chart-card">
      <div className="chart-card__header">
        <h3>GPA Trend</h3>
        <p>See how your semester GPA changes over time.</p>
      </div>

      <div className="chart-card__body">
        {data.length > 0 ? (
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={data}>
              <CartesianGrid stroke="var(--color-border-muted)" strokeDasharray="4 4" />
              <XAxis dataKey="label" tickLine={false} axisLine={false} />
              <YAxis
                domain={[0, 5]}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => formatNumber(value, 1)}
              />
              <Tooltip
                formatter={(value) =>
                  typeof value === 'number' ? formatNumber(value) : value
                }
              />
              <Line
                type="monotone"
                dataKey="gpa"
                stroke="var(--color-chart-primary)"
                strokeWidth={3}
                dot={{ r: 4, fill: 'var(--color-chart-primary)' }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <p className="chart-placeholder">Semester GPA data will appear here.</p>
        )}
      </div>
    </article>
  )
}
