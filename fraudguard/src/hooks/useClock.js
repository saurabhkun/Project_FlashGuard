import { useState, useEffect } from 'react'

/**
 * Returns a live HH:MM string that updates every 30 seconds.
 * Used in the status bar.
 */
export function useClock() {
  const fmt = () => {
    const n = new Date()
    return `${n.getHours()}:${String(n.getMinutes()).padStart(2, '0')}`
  }

  const [time, setTime] = useState(fmt)

  useEffect(() => {
    const id = setInterval(() => setTime(fmt()), 30_000)
    return () => clearInterval(id)
  }, [])

  return time
}
