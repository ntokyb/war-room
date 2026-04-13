// Custom hook — reusable timer logic extracted from the component

import { useState, useEffect, useRef } from "react";

export function useTimer() {
  const [seconds, setSeconds] = useState(0);
  const [active, setActive] = useState(false);
  const ref = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (active) {
      ref.current = setInterval(() => setSeconds((s) => s + 1), 1000);
    } else {
      if (ref.current != null) clearInterval(ref.current);
    }
    return () => {
      if (ref.current != null) clearInterval(ref.current);
    };
  }, [active]);

  const start = () => {
    setSeconds(0);
    setActive(true);
  };
  const stop = () => setActive(false);
  const format = () =>
    `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;

  return { seconds, active, start, stop, format };
}

export type UseTimerReturn = ReturnType<typeof useTimer>;
