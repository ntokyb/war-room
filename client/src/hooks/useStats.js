import { useState } from 'react'

export function useStats() {
  const [stats, setStats] = useState({ solved: 0, hinted: 0, skipped: 0, streak: 0 })

  const markSolved = () =>
    setStats((s) => ({ ...s, solved: s.solved + 1, streak: s.streak + 1 }))
  const markHinted = () => setStats((s) => ({ ...s, hinted: s.hinted + 1 }))
  const markSkipped = () => setStats((s) => ({ ...s, skipped: s.skipped + 1, streak: 0 }))

  return { stats, markSolved, markHinted, markSkipped }
}
