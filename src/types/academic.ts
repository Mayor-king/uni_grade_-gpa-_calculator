export type GradeLetter = 'A' | 'B' | 'C' | 'D' | 'E' | 'F'

export interface Course {
  id: string
  code: string
  title: string
  creditUnits: number | null
  grade: GradeLetter
}

export interface Semester {
  id: string
  name: string
  courses: Course[]
  isCollapsed: boolean
}

export interface ClassificationBand {
  label: string
  min: number
  max: number
}

export interface CourseBreakdown {
  courseId: string
  code: string
  title: string
  creditUnits: number
  grade: GradeLetter
  gradePoint: number
  weightedScore: number
  includedInGpa: boolean
}

export interface SemesterMetrics {
  semesterId: string
  semesterName: string
  courses: CourseBreakdown[]
  totalCredits: number
  totalQualityPoints: number
  gpa: number
  formula: string
  excludedCourses: number
}

export interface TrendPoint {
  label: string
  gpa: number
}

export interface GradeDistributionPoint {
  grade: GradeLetter
  count: number
}

export interface DashboardMetrics {
  semesters: SemesterMetrics[]
  cumulativeCredits: number
  cumulativeQualityPoints: number
  cgpa: number
  totalCourses: number
  currentBand: ClassificationBand
  nextBand: ClassificationBand | null
  gapToNextBand: number | null
  gpaTrend: TrendPoint[]
  gradeDistribution: GradeDistributionPoint[]
}

export interface CsvCourseRow {
  semester: string
  courseCode: string
  courseTitle: string
  creditUnits: number
  grade: GradeLetter
  gradePoint: number
  weightedScore: number
  includedInGpa: boolean
}
