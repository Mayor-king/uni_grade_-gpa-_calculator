import type { GradeLetter, Semester, SemesterMetrics } from '../types/academic'
import { formatNumber } from '../utils/formatters'

interface SemesterCardProps {
  semester: Semester
  metrics?: SemesterMetrics
  onAddCourse: () => void
  onRemoveSemester: () => void
  onToggleCollapse: () => void
  onRenameSemester: (name: string) => void
  onCourseTextChange: (
    semesterId: string,
    courseId: string,
    field: 'code' | 'title',
    value: string,
  ) => void
  onCourseUnitsChange: (semesterId: string, courseId: string, value: string) => void
  onCourseGradeChange: (
    semesterId: string,
    courseId: string,
    value: GradeLetter,
  ) => void
  onRemoveCourse: (semesterId: string, courseId: string) => void
}

const gradeOptions: GradeLetter[] = ['A', 'B', 'C', 'D', 'E', 'F']

export function SemesterCard({
  semester,
  metrics,
  onAddCourse,
  onRemoveSemester,
  onToggleCollapse,
  onRenameSemester,
  onCourseTextChange,
  onCourseUnitsChange,
  onCourseGradeChange,
  onRemoveCourse,
}: SemesterCardProps) {
  return (
    <section className="panel semester-card">
      <header className="semester-card__header">
        <div className="semester-card__title">
          <button className="collapse-button" onClick={onToggleCollapse}>
            {semester.isCollapsed ? '+' : '-'}
          </button>
          <input
            className="semester-name-input"
            value={semester.name}
            onChange={(event) => onRenameSemester(event.target.value)}
            aria-label="Semester name"
          />
        </div>

        <div className="semester-card__actions">
          <div className="semester-badge">
            GPA <strong>{formatNumber(metrics?.gpa ?? 0)}</strong>
          </div>
          <button className="button button-secondary" onClick={onAddCourse}>
            Add course
          </button>
          <button className="button button-ghost" onClick={onRemoveSemester}>
            Remove semester
          </button>
        </div>
      </header>

      {!semester.isCollapsed ? (
        <>
          <div className="table-scroll">
            <table className="course-table">
              <thead>
                <tr>
                  <th>Course code</th>
                  <th>Course title</th>
                  <th>Units</th>
                  <th>Grade</th>
                  <th>Grade point</th>
                  <th>Weighted score</th>
                  <th>GPA impact</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {semester.courses.map((course) => {
                  const breakdown = metrics?.courses.find(
                    (item) => item.courseId === course.id,
                  )

                  return (
                    <tr key={course.id}>
                      <td data-label="Course code">
                        <input
                          value={course.code}
                          onChange={(event) =>
                            onCourseTextChange(
                              semester.id,
                              course.id,
                              'code',
                              event.target.value,
                            )
                          }
                          placeholder="CSC 201"
                        />
                      </td>
                      <td data-label="Course title">
                        <input
                          value={course.title}
                          onChange={(event) =>
                            onCourseTextChange(
                              semester.id,
                              course.id,
                              'title',
                              event.target.value,
                            )
                          }
                          placeholder="Data Structures"
                        />
                      </td>
                      <td data-label="Units">
                        <input
                          type="number"
                          min="0"
                          step="1"
                          value={course.creditUnits ?? ''}
                          onChange={(event) =>
                            onCourseUnitsChange(semester.id, course.id, event.target.value)
                          }
                          placeholder="3"
                        />
                      </td>
                      <td data-label="Grade">
                        <select
                          value={course.grade}
                          onChange={(event) =>
                            onCourseGradeChange(
                              semester.id,
                              course.id,
                              event.target.value as GradeLetter,
                            )
                          }
                        >
                          {gradeOptions.map((grade) => (
                            <option key={grade} value={grade}>
                              {grade}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td data-label="Grade point">
                        {breakdown ? formatNumber(breakdown.gradePoint, 1) : '--'}
                      </td>
                      <td data-label="Weighted score">
                        {breakdown ? formatNumber(breakdown.weightedScore) : '--'}
                      </td>
                      <td data-label="GPA impact">
                        {breakdown ? (breakdown.includedInGpa ? 'Included' : 'Excluded') : '--'}
                      </td>
                      <td data-label="Action" data-cell-action="true">
                        <button
                          className="table-action"
                          onClick={() => onRemoveCourse(semester.id, course.id)}
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          <div className="semester-summary">
            <div className="semester-summary__stats">
              <div>
                <span>Total credits</span>
                <strong>{metrics?.totalCredits ?? 0}</strong>
              </div>
              <div>
                <span>Total quality points</span>
                <strong>{formatNumber(metrics?.totalQualityPoints ?? 0)}</strong>
              </div>
              <div>
                <span>Semester GPA</span>
                <strong>{formatNumber(metrics?.gpa ?? 0)}</strong>
              </div>
            </div>

            <div className="formula-box">
              <span className="section-label">Formula breakdown</span>
              <p>
                GPA = Total Weighted Quality Points / Total Credit Units
              </p>
              <code>{metrics?.formula ?? 'No tracked courses yet.'}</code>
              {metrics && metrics.excludedCourses > 0 ? (
                <p>
                  {metrics.excludedCourses} zero-unit course
                  {metrics.excludedCourses > 1 ? 's are' : ' is'} tracked here but
                  excluded from GPA and CGPA.
                </p>
              ) : null}
            </div>
          </div>
        </>
      ) : null}
    </section>
  )
}
