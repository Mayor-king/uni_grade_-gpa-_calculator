import type { ClassificationBand, GradeLetter } from '../types/academic'

export const GRADE_POINTS: Record<GradeLetter, number> = {
  A: 5,
  B: 4,
  C: 3,
  D: 2,
  E: 1,
  F: 0,
}

export const CLASSIFICATION_BANDS: ClassificationBand[] = [
  { label: 'First Class', min: 4.5, max: 5 },
  { label: 'Second Class Upper', min: 3.5, max: 4.49 },
  { label: 'Second Class Lower', min: 2.4, max: 3.49 },
  { label: 'Third Class', min: 1.5, max: 2.39 },
  { label: 'Pass', min: 1, max: 1.49 },
  { label: 'Fail', min: 0, max: 0.99 },
]
