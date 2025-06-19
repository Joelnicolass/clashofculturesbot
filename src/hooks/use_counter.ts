import { TechnologicalRootType } from "@/utils/enums";
import { Tech } from "./use_advance_tech";
import { useState } from "react";

export const useCounter = (
  techCompleteGraph: Record<TechnologicalRootType, Tech[]>,
  culturePower: number
) => {
  const totalTechs = Object.values(techCompleteGraph).reduce(
    (acc, techs) => acc + techs.length,
    0
  );

  const [cultureCount, setCultureCount] = useState(0);
  const [turnCount, setTurnCount] = useState(0);
  const incrementCultureCount = (useCulturePower: boolean = true) =>
    setCultureCount((prev) => prev + (useCulturePower ? culturePower : 1));
  const incrementTurnCount = () => setTurnCount((prev) => prev + 1);
  const decrementCultureCount = () =>
    setCultureCount((prev) => Math.max(prev - 1, 0));
  const decrementCultureInPoints = (points: number) =>
    setCultureCount((prev) => Math.max(prev - points, 0));

  return {
    cultureCount,
    turnCount,
    totalTechs,
    incrementCultureCount,
    incrementTurnCount,
    decrementCultureCount,
    setTurnCount,
    setCultureCount,
    decrementCultureInPoints,
  };
};
