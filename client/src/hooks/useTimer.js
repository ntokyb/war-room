// Custom hook — reusable timer logic extracted from the component
// Equivalent to a .NET utility service

import { useState, useEffect, useRef } from 'react'

export function useTimer() {
  const [seconds, setSeconds] = useState(0)
  const [active, setActive] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    if (active) {
      ref.current = setInterval(() => setSeconds((s) => s + 1), 1000)
    } else {
      clearInterval(ref.current)
    }
    return () => clearInterval(ref.current)
  }, [active])

  const start = () => {
    setSeconds(0)
    setActive(true)
  }
  const stop = () => setActive(false)
  const format = () =>
    `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`

  return { seconds, active, start, stop, format }
}
