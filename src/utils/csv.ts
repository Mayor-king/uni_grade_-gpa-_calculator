import type { CsvCourseRow } from '../types/academic'

const CSV_HEADERS = [
  'Semester',
  'Course Code',
  'Course Title',
  'Credit Units',
  'Grade',
  'Grade Point',
  'Weighted Score',
  'Counts Toward GPA',
]

export function downloadCoursesCsv(rows: CsvCourseRow[]) {
  if (rows.length === 0) {
    return
  }

  const lines = [
    CSV_HEADERS.join(','),
    ...rows.map((row) =>
      [
        row.semester,
        row.courseCode,
        row.courseTitle,
        row.creditUnits,
        row.grade,
        row.gradePoint,
        row.weightedScore,
        row.includedInGpa ? 'Yes' : 'No',
      ]
        .map(escapeCsvValue)
        .join(','),
    ),
  ]

  const blob = new Blob([lines.join('\n')], {
    type: 'text/csv;charset=utf-8;',
  })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')

  link.href = url
  link.download = 'uni-grade-gpa-tracker.csv'
  link.click()

  URL.revokeObjectURL(url)
}

function escapeCsvValue(value: string | number) {
  const text = String(value).replaceAll('"', '""')
  return `"${text}"`
}
