import { CLASSIFICATION_BANDS, GRADE_POINTS } from '../data/academic'

export function GradeReference() {
  return (
    <section className="panel sticky-panel">
      <div className="panel-header">
        <div>
          <h2>Reference Guide</h2>
          <p>Keep the grading scale and degree classes in view while editing.</p>
        </div>
      </div>

      <div className="reference-block">
        <h3>Nigerian 5.0 Grading Scale</h3>
        <ul className="reference-list">
          {Object.entries(GRADE_POINTS).map(([grade, point]) => (
            <li key={grade}>
              <span>{grade}</span>
              <strong>{point.toFixed(1)}</strong>
            </li>
          ))}
        </ul>
      </div>

      <div className="reference-block">
        <h3>Classification Bands</h3>
        <ul className="reference-list">
          {CLASSIFICATION_BANDS.map((band) => (
            <li key={band.label}>
              <span>{band.label}</span>
              <strong>
                {band.min.toFixed(2)} - {band.max.toFixed(2)}
              </strong>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
