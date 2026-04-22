import { lazy, Suspense, useEffect, useMemo, useState } from 'react'
import './App.css'
import { ClassificationBanner } from './components/ClassificationBanner'
import { EmptyState } from './components/EmptyState'
import { GradeReference } from './components/GradeReference'
import { MetricCard } from './components/MetricCard'
import { SemesterCard } from './components/SemesterCard'
import { TargetCalculator } from './components/TargetCalculator'
import { useLocalStorage } from './hooks/useLocalStorage'
import { createCourse, createSemester } from './utils/ids'
import {
  calculateDashboardMetrics,
  getExportableCourses,
} from './utils/calculations'
import { downloadCoursesCsv } from './utils/csv'
import type { Course, GradeLetter, Semester } from './types/academic'
import { formatNumber } from './utils/formatters'

const STORAGE_KEY = 'uni-grade-gpa-tracker'
const GpaTrendChart = lazy(() =>
  import('./components/charts/GpaTrendChart').then((module) => ({
    default: module.GpaTrendChart,
  })),
)
const GradeDistributionChart = lazy(() =>
  import('./components/charts/GradeDistributionChart').then((module) => ({
    default: module.GradeDistributionChart,
  })),
)

const defaultSemesters = (): Semester[] => [
  createSemester('100 Level - First Semester'),
]

function App() {
  const [semesters, setSemesters] = useLocalStorage<Semester[]>(
    STORAGE_KEY,
    defaultSemesters,
  )
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null)

  const metrics = useMemo(
    () => calculateDashboardMetrics(semesters),
    [semesters],
  )

  useEffect(() => {
    document.title = 'Uni Grade & GPA Tracker'
  }, [])

  useEffect(() => {
    setLastSavedAt(new Date())
  }, [semesters])

  const addSemester = () => {
    setSemesters((current) => [
      ...current,
      createSemester(`Semester ${current.length + 1}`),
    ])
  }

  const removeSemester = (semesterId: string) => {
    setSemesters((current) => current.filter((semester) => semester.id !== semesterId))
  }

  const toggleSemester = (semesterId: string) => {
    setSemesters((current) =>
      current.map((semester) =>
        semester.id === semesterId
          ? { ...semester, isCollapsed: !semester.isCollapsed }
          : semester,
      ),
    )
  }

  const updateSemesterName = (semesterId: string, name: string) => {
    setSemesters((current) =>
      current.map((semester) =>
        semester.id === semesterId ? { ...semester, name } : semester,
      ),
    )
  }

  const addCourse = (semesterId: string) => {
    setSemesters((current) =>
      current.map((semester) =>
        semester.id === semesterId
          ? {
              ...semester,
              courses: [...semester.courses, createCourse()],
              isCollapsed: false,
            }
          : semester,
      ),
    )
  }

  const removeCourse = (semesterId: string, courseId: string) => {
    setSemesters((current) =>
      current.map((semester) =>
        semester.id === semesterId
          ? {
              ...semester,
              courses: semester.courses.filter((course) => course.id !== courseId),
            }
          : semester,
      ),
    )
  }

  const updateCourse = <K extends keyof Course>(
    semesterId: string,
    courseId: string,
    field: K,
    value: Course[K],
  ) => {
    setSemesters((current) =>
      current.map((semester) =>
        semester.id === semesterId
          ? {
              ...semester,
              courses: semester.courses.map((course) =>
                course.id === courseId ? { ...course, [field]: value } : course,
              ),
            }
          : semester,
      ),
    )
  }

  const handleCourseTextChange = (
    semesterId: string,
    courseId: string,
    field: 'code' | 'title',
    value: string,
  ) => {
    updateCourse(semesterId, courseId, field, value)
  }

  const handleCourseUnitsChange = (
    semesterId: string,
    courseId: string,
    value: string,
  ) => {
    if (value.trim() === '') {
      updateCourse(semesterId, courseId, 'creditUnits', null)
      return
    }

    const parsedValue = Number.parseInt(value, 10)
    updateCourse(
      semesterId,
      courseId,
      'creditUnits',
      Number.isFinite(parsedValue) && parsedValue >= 0 ? parsedValue : null,
    )
  }

  const handleCourseGradeChange = (
    semesterId: string,
    courseId: string,
    value: GradeLetter,
  ) => {
    updateCourse(semesterId, courseId, 'grade', value)
  }

  const handleExport = () => {
    const rows = getExportableCourses(semesters)
    downloadCoursesCsv(rows)
  }

  const handleEmptyStateAction = () => {
    if (semesters.length === 0) {
      setSemesters([createSemester('100 Level - First Semester')])
      return
    }

    addCourse(semesters[0].id)
  }

  const saveLabel = lastSavedAt
    ? `Saved locally at ${lastSavedAt.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      })}`
    : 'Ready to save locally'

  return (
    <div className="app-shell">
      <header className="hero-section">
        <div className="hero-copy">
          <span className="eyebrow">Academic performance tracker</span>
          <h1>Uni Grade &amp; GPA Tracker</h1>
          <p className="hero-text">
            Calculate GPA and CGPA across multiple semesters, visualize your
            trend, and understand exactly how every course affects your standing.
          </p>
          <div className="hero-actions">
            <button className="button button-primary" onClick={addSemester}>
              Add semester
            </button>
            <button
              className="button button-secondary"
              onClick={handleExport}
              disabled={metrics.totalCourses === 0}
            >
              Export CSV
            </button>
          </div>
        </div>

        <div className="hero-panel">
          <div className="hero-stat">
            <span className="hero-stat-label">CGPA</span>
            <strong>{formatNumber(metrics.cgpa)}</strong>
          </div>
          <div className="hero-stat">
            <span className="hero-stat-label">Total credits</span>
            <strong>{metrics.cumulativeCredits}</strong>
          </div>
          <div className="hero-stat">
            <span className="hero-stat-label">Quality points</span>
            <strong>{formatNumber(metrics.cumulativeQualityPoints)}</strong>
          </div>
          <p className="save-label">{saveLabel}</p>
        </div>
      </header>

      <ClassificationBanner
        cgpa={metrics.cgpa}
        currentBand={metrics.currentBand}
        nextBand={metrics.nextBand}
        gapToNextBand={metrics.gapToNextBand}
      />

      <section className="metrics-grid" aria-label="Performance summary">
        <MetricCard
          label="Current CGPA"
          value={formatNumber(metrics.cgpa)}
          detail="Calculated from total quality points divided by total credit units."
        />
        <MetricCard
          label="Completed Semesters"
          value={String(metrics.semesters.length)}
          detail="Each semester keeps its own GPA breakdown and collapsible course table."
        />
        <MetricCard
          label="Courses Tracked"
          value={String(metrics.totalCourses)}
          detail="Zero-unit compulsory courses are tracked too, but excluded from GPA and CGPA."
        />
        <MetricCard
          label="Current Class"
          value={metrics.currentBand.label}
          detail={`Band range: ${metrics.currentBand.min.toFixed(2)} - ${metrics.currentBand.max.toFixed(2)}`}
        />
      </section>

      <main className="dashboard">
        <section className="main-column">
          {metrics.totalCourses === 0 ? (
            <EmptyState onAddCourse={handleEmptyStateAction} />
          ) : null}

          <section className="panel chart-panel">
            <div className="panel-header">
              <div>
                <h2>Performance Analytics</h2>
                <p>Track GPA movement and grade mix across every semester.</p>
              </div>
            </div>

            <div className="chart-grid">
              <Suspense fallback={<ChartLoadingCard title="GPA Trend" />}>
                <GpaTrendChart data={metrics.gpaTrend} />
              </Suspense>
              <Suspense fallback={<ChartLoadingCard title="Grade Distribution" />}>
                <GradeDistributionChart data={metrics.gradeDistribution} />
              </Suspense>
            </div>
          </section>

          <section className="semester-stack">
            {semesters.map((semester) => {
              const semesterMetrics = metrics.semesters.find(
                (item) => item.semesterId === semester.id,
              )

              return (
                <SemesterCard
                  key={semester.id}
                  semester={semester}
                  metrics={semesterMetrics}
                  onAddCourse={() => addCourse(semester.id)}
                  onRemoveSemester={() => removeSemester(semester.id)}
                  onToggleCollapse={() => toggleSemester(semester.id)}
                  onRenameSemester={(name) => updateSemesterName(semester.id, name)}
                  onCourseTextChange={handleCourseTextChange}
                  onCourseUnitsChange={handleCourseUnitsChange}
                  onCourseGradeChange={handleCourseGradeChange}
                  onRemoveCourse={removeCourse}
                />
              )
            })}
          </section>
        </section>

        <aside className="side-column">
          <TargetCalculator
            currentCredits={metrics.cumulativeCredits}
            currentQualityPoints={metrics.cumulativeQualityPoints}
            currentCgpa={metrics.cgpa}
          />

          <GradeReference />

          <section className="panel cv-panel">
            <h2>CV Description</h2>
            <p>
              Developed Uni Grade &amp; GPA Tracker, an academic tool to help
              university students calculate and monitor GPA progress over
              multiple semesters. Created an intuitive React frontend for
              seamless user input and data visualization.
            </p>
          </section>
        </aside>
      </main>

      <footer className="site-footer">
        <div className="site-footer__panel">
          <div className="site-footer__intro">
            <span className="section-label">Uni Grade &amp; GPA Tracker</span>
            <p>
              Built for Nigerian university students to calculate GPA, monitor
              CGPA progress, and understand degree classification across semesters.
            </p>
          </div>

          <div className="site-footer__highlights">
            <span>Nigerian 5.0 grading system</span>
            <span>Local-only browser storage</span>
            <span>CSV export for course records</span>
          </div>

          <div className="site-footer__meta">
            <p>Your course data stays on this device through localStorage.</p>
            <p>
              Always confirm final GPA, CGPA, and classification with your school
              or department records.
            </p>
          </div>
        </div>

        <div className="site-footer__bottom">
          <p>&copy; 2026 Uni Grade &amp; GPA Tracker. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

function ChartLoadingCard({ title }: { title: string }) {
  return (
    <article className="chart-card chart-card--loading">
      <div className="chart-card__header">
        <h3>{title}</h3>
        <p>Loading chart data...</p>
      </div>
      <div className="chart-card__body chart-placeholder">Preparing visualization...</div>
    </article>
  )
}

export default App
