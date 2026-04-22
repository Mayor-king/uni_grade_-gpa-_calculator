import { useMemo, useState } from 'react'
import { calculateRequiredGpa } from '../utils/calculations'
import { formatNumber } from '../utils/formatters'

interface TargetCalculatorProps {
  currentQualityPoints: number
  currentCredits: number
  currentCgpa: number
}

export function TargetCalculator({
  currentQualityPoints,
  currentCredits,
  currentCgpa,
}: TargetCalculatorProps) {
  const [targetCgpa, setTargetCgpa] = useState('4.50')
  const [remainingCredits, setRemainingCredits] = useState('24')

  const result = useMemo(() => {
    const parsedTarget = Number.parseFloat(targetCgpa)
    const parsedCredits = Number.parseInt(remainingCredits, 10)

    if (Number.isNaN(parsedTarget) || Number.isNaN(parsedCredits)) {
      return {
        status: 'invalid' as const,
        value: null,
        message: 'Enter a target CGPA and remaining credit units to calculate.',
      }
    }

    return calculateRequiredGpa(
      currentQualityPoints,
      currentCredits,
      parsedTarget,
      parsedCredits,
    )
  }, [currentCredits, currentQualityPoints, remainingCredits, targetCgpa])

  return (
    <section className="panel">
      <div className="panel-header">
        <div>
          <h2>Target Calculator</h2>
          <p>Work out the GPA needed this semester to reach a CGPA target.</p>
        </div>
      </div>

      <div className="target-grid">
        <label>
          <span>Current CGPA</span>
          <input value={formatNumber(currentCgpa)} disabled />
        </label>
        <label>
          <span>Target CGPA</span>
          <input
            type="number"
            min="0"
            max="5"
            step="0.01"
            value={targetCgpa}
            onChange={(event) => setTargetCgpa(event.target.value)}
          />
        </label>
        <label>
          <span>Remaining credit units</span>
          <input
            type="number"
            min="1"
            step="1"
            value={remainingCredits}
            onChange={(event) => setRemainingCredits(event.target.value)}
          />
        </label>
      </div>

      <div className={`target-result target-result--${result.status}`}>
        <p>{result.message}</p>
        {result.value !== null ? (
          <strong>{formatNumber(result.value)}</strong>
        ) : null}
      </div>
    </section>
  )
}
