import type { ClassificationBand } from '../types/academic'
import { formatGap, formatNumber } from '../utils/formatters'

interface ClassificationBannerProps {
  cgpa: number
  currentBand: ClassificationBand
  nextBand: ClassificationBand | null
  gapToNextBand: number | null
}

export function ClassificationBanner({
  cgpa,
  currentBand,
  nextBand,
  gapToNextBand,
}: ClassificationBannerProps) {
  return (
    <section className="classification-banner panel">
      <div>
        <span className="section-label">Live classification</span>
        <h2>{currentBand.label}</h2>
        <p>
          Your current CGPA is <strong>{formatNumber(cgpa)}</strong>, which places
          you in the <strong>{currentBand.label}</strong> band.
        </p>
      </div>

      <div className="classification-banner__meta">
        {nextBand && gapToNextBand !== null ? (
          <p>
            You need <strong>{formatGap(gapToNextBand)}</strong> more grade points
            to reach <strong>{nextBand.label}</strong>.
          </p>
        ) : (
          <p>You are already in the highest classification band.</p>
        )}
      </div>
    </section>
  )
}
