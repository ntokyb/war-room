import { useState, useEffect, useRef } from "react";

/** Stopwatch for time spent in your own editor (separate from session header timer). */
export function useLocalIdeTimer() {
  const [seconds, setSeconds] = useState(0);
  const [active, setActive] = useState(false);
  const ref = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (active) {
      ref.current = setInterval(() => setSeconds((s) => s + 1), 1000);
    } else if (ref.current != null) {
      clearInterval(ref.current);
    }
    return () => {
      if (ref.current != null) clearInterval(ref.current);
    };
  }, [active]);

  const format = () =>
    `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;

  const start = () => setActive(true);
  const pause = () => setActive(false);
  const reset = () => {
    setActive(false);
    setSeconds(0);
  };

  return { seconds, active, start, pause, reset, format };
}
