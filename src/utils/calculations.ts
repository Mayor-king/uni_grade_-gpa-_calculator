import { CLASSIFICATION_BANDS, GRADE_POINTS } from '../data/academic'
import type {
  ClassificationBand,
  CsvCourseRow,
  DashboardMetrics,
  Semester,
  SemesterMetrics,
} from '../types/academic'

export function calculateDashboardMetrics(semesters: Semester[]): DashboardMetrics {
  const semesterMetrics = semesters.map(calculateSemesterMetrics)
  const cumulativeCredits = semesterMetrics.reduce(
    (sum, semester) => sum + semester.totalCredits,
    0,
  )
  const cumulativeQualityPoints = semesterMetrics.reduce(
    (sum, semester) => sum + semester.totalQualityPoints,
    0,
  )
  const cgpa =
    cumulativeCredits > 0 ? cumulativeQualityPoints / cumulativeCredits : 0
  const currentBand = getClassificationBand(cgpa)
  const nextBand = getNextClassificationBand(currentBand)
  const gapToNextBand = nextBand ? Math.max(nextBand.min - cgpa, 0) : null

  return {
    semesters: semesterMetrics,
    cumulativeCredits,
    cumulativeQualityPoints,
    cgpa,
    totalCourses: semesterMetrics.reduce(
      (sum, semester) => sum + semester.courses.length,
      0,
    ),
    currentBand,
    nextBand,
    gapToNextBand,
    gpaTrend: semesterMetrics.map((semester, index) => ({
      label: semester.semesterName || `Semester ${index + 1}`,
      gpa: Number(semester.gpa.toFixed(2)),
    })),
    gradeDistribution: (Object.keys(GRADE_POINTS) as Array<keyof typeof GRADE_POINTS>).map(
      (grade) => ({
        grade,
        count: semesterMetrics.reduce(
          (sum, semester) =>
            sum + semester.courses.filter((course) => course.grade === grade).length,
          0,
        ),
      }),
    ),
  }
}

export function calculateSemesterMetrics(semester: Semester): SemesterMetrics {
  const trackedCourses = semester.courses
    .filter(isTrackedCourse)
    .map((course) => {
      const creditUnits = course.creditUnits ?? 0
      const gradePoint = GRADE_POINTS[course.grade]
      const weightedScore = creditUnits * gradePoint
      const includedInGpa = creditUnits > 0

      return {
        courseId: course.id,
        code: course.code,
        title: course.title,
        creditUnits,
        grade: course.grade,
        gradePoint,
        weightedScore,
        includedInGpa,
      }
    })

  const coursesAffectingGpa = trackedCourses.filter((course) => course.includedInGpa)
  const totalCredits = coursesAffectingGpa.reduce(
    (sum, course) => sum + course.creditUnits,
    0,
  )
  const totalQualityPoints = coursesAffectingGpa.reduce(
    (sum, course) => sum + course.weightedScore,
    0,
  )
  const gpa = totalCredits > 0 ? totalQualityPoints / totalCredits : 0
  const excludedCourses = trackedCourses.filter((course) => !course.includedInGpa).length

  let formula = 'Add course rows to generate the semester GPA formula.'

  if (coursesAffectingGpa.length > 0) {
    formula = `${coursesAffectingGpa.map((course) => course.weightedScore).join(' + ')} = ${totalQualityPoints} / ${totalCredits} = ${gpa.toFixed(2)}`
  } else if (excludedCourses > 0) {
    formula =
      'All tracked courses in this semester are zero-unit courses, so they are excluded from GPA and CGPA.'
  }

  return {
    semesterId: semester.id,
    semesterName: semester.name,
    courses: trackedCourses,
    totalCredits,
    totalQualityPoints,
    gpa,
    formula,
    excludedCourses,
  }
}

export function getExportableCourses(semesters: Semester[]): CsvCourseRow[] {
  return semesters.flatMap((semester) =>
    semester.courses.filter(isTrackedCourse).map((course) => ({
      semester: semester.name,
      courseCode: course.code,
      courseTitle: course.title,
      creditUnits: course.creditUnits ?? 0,
      grade: course.grade,
      gradePoint: GRADE_POINTS[course.grade],
      weightedScore: GRADE_POINTS[course.grade] * (course.creditUnits ?? 0),
      includedInGpa: (course.creditUnits ?? 0) > 0,
    })),
  )
}

export function calculateRequiredGpa(
  currentQualityPoints: number,
  currentCredits: number,
  targetCgpa: number,
  remainingCredits: number,
) {
  if (remainingCredits <= 0) {
    return {
      status: 'invalid' as const,
      value: null,
      message: 'Enter a positive number of remaining credit units.',
    }
  }

  if (targetCgpa < 0 || targetCgpa > 5) {
    return {
      status: 'invalid' as const,
      value: null,
      message: 'Target CGPA must stay within the Nigerian 5.0 grading system.',
    }
  }

  const neededValue =
    (targetCgpa * (currentCredits + remainingCredits) - currentQualityPoints) /
    remainingCredits

  if (neededValue <= 0) {
    return {
      status: 'achieved' as const,
      value: 0,
      message: 'You have already met this CGPA target with your current record.',
    }
  }

  if (neededValue > 5) {
    return {
      status: 'impossible' as const,
      value: neededValue,
      message:
        'This target is above the maximum 5.00 GPA for the remaining credit load.',
    }
  }

  return {
    status: 'feasible' as const,
    value: neededValue,
    message: 'This is the minimum GPA needed over the remaining credits.',
  }
}

function isTrackedCourse(course: Semester['courses'][number]) {
  const hasIdentity = course.code.trim().length > 0 || course.title.trim().length > 0
  return hasIdentity && course.creditUnits !== null && course.creditUnits >= 0
}

function getClassificationBand(cgpa: number): ClassificationBand {
  return (
    CLASSIFICATION_BANDS.find((band) => cgpa >= band.min) ??
    CLASSIFICATION_BANDS[CLASSIFICATION_BANDS.length - 1]
  )
}

function getNextClassificationBand(currentBand: ClassificationBand) {
  const currentIndex = CLASSIFICATION_BANDS.findIndex(
    (band) => band.label === currentBand.label,
  )

  return currentIndex > 0 ? CLASSIFICATION_BANDS[currentIndex - 1] : null
}
