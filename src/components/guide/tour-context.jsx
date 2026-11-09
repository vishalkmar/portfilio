import { createContext, useCallback, useContext, useMemo, useState } from "react";

/**
 * Shared state between the tour guide and the sections it walks through.
 *
 * - revealed:     the intro curtain has parted, so page entrance animations may run
 * - activeEdu:    index of the education card the guide is pointing at (-1 = none)
 * - reachedEdu:   highest education card visited; cards stream in once reached
 * - activeSkill:  index of the skill station the guide is presenting (-1 = none)
 * - reachedSkill: highest skill station visited; its tiles power on once reached
 */
const TourContext = createContext({
  revealed: true,
  setRevealed: () => {},
  activeEdu: -1,
  reachedEdu: -1,
  setActiveEdu: () => {},
  activeSkill: -1,
  reachedSkill: -1,
  setActiveSkill: () => {},
});

function useTracked() {
  const [active, setActive] = useState(-1);
  const [reached, setReached] = useState(-1);
  const set = useCallback((index) => {
    setActive(index);
    if (index >= 0) setReached((prev) => Math.max(prev, index));
  }, []);
  return [active, reached, set];
}

export function TourProvider({ children, initiallyRevealed = false }) {
  const [revealed, setRevealed] = useState(initiallyRevealed);
  const [activeEdu, reachedEdu, setActiveEdu] = useTracked();
  const [activeSkill, reachedSkill, setActiveSkill] = useTracked();

  const value = useMemo(
    () => ({
      revealed,
      setRevealed,
      activeEdu,
      reachedEdu,
      setActiveEdu,
      activeSkill,
      reachedSkill,
      setActiveSkill,
    }),
    [revealed, activeEdu, reachedEdu, setActiveEdu, activeSkill, reachedSkill, setActiveSkill]
  );

  return <TourContext.Provider value={value}>{children}</TourContext.Provider>;
}

export const useTour = () => useContext(TourContext);
