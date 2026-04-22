import { useEffect, useState } from 'react'

export function useLocalStorage<T>(
  key: string,
  initialValue: T | (() => T),
) {
  const [value, setValue] = useState<T>(() => {
    const resolvedInitialValue =
      typeof initialValue === 'function'
        ? (initialValue as () => T)()
        : initialValue

    try {
      const savedValue = window.localStorage.getItem(key)
      return savedValue ? (JSON.parse(savedValue) as T) : resolvedInitialValue
    } catch {
      return resolvedInitialValue
    }
  })

  useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(value))
  }, [key, value])

  return [value, setValue] as const
}
