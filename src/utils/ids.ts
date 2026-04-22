import type { Course, Semester } from '../types/academic'

export function createSemester(name: string): Semester {
  return {
    id: generateId(),
    name,
    courses: [createCourse()],
    isCollapsed: false,
  }
}

export function createCourse(): Course {
  return {
    id: generateId(),
    code: '',
    title: '',
    creditUnits: null,
    grade: 'A',
  }
}

function generateId() {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID()
  }

  return `id-${Math.random().toString(36).slice(2, 11)}`
}
