interface EmptyStateProps {
  onAddCourse: () => void
}

export function EmptyState({ onAddCourse }: EmptyStateProps) {
  return (
    <section className="panel empty-state">
      <span className="section-label">Get started</span>
      <h2>No graded courses yet</h2>
      <p>
        Add a course row and start entering course code, title, units, and grade.
        GPA, CGPA, charts, and classification will update instantly.
      </p>
      <button className="button button-primary" onClick={onAddCourse}>
        Add your first course
      </button>
    </section>
  )
}
