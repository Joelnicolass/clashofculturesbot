import { useState } from "react";
import { BuildingType, TechnologicalRootType } from "@/utils/enums";

const TREE_TECHNOLOGIES = {
  Agricultura: [],
  Belicismo: [],
  Ciencia: [],
  Construcción: [],
  Cultura: [],
  Economía: [],
  Educación: [],
  Espiritualidad: [],
  Nautica: [],
  Democracia: [],
  Teocracia: [],
  Autocracia: [],
};

export type Tech = {
  name: string;
  description: string;
  category: TechnologicalRootType;
  place: number;
  effect?: string;
  effectCategory?: BuildingType | null;
};

export const useAdvanceTech = () => {
  const [unlockedTechs, setUnlockedTechs] = useState(TREE_TECHNOLOGIES);

  const [techCompleteGraph, setTechCompleteGraph] =
    useState<Record<TechnologicalRootType, Tech[]>>(TREE_TECHNOLOGIES);

  const [governmentModel, setGovernmentModel] =
    useState<TechnologicalRootType | null>(null);

  const [navalPower, setNavalPower] = useState(1);
  const [landPower, setLandPower] = useState(1);
  const [culturePower, setCulturePower] = useState(1);

  const unlockTech = (tech: Tech | null) => {
    if (!tech) return;

    setUnlockedTechs((prev) => ({
      ...prev,
      [tech.category]: [
        ...prev[tech.category as keyof typeof prev],
        tech.place,
      ],
    }));

    setTechCompleteGraph((prev) => {
      const updatedCategory = prev[tech.category] || [];
      const existingTechIndex = updatedCategory.findIndex(
        (t) => t.name === tech.name
      );

      if (existingTechIndex !== -1) {
        updatedCategory[existingTechIndex] = {
          ...updatedCategory[existingTechIndex],
          place: tech.place,
          effect: tech.effect,
          effectCategory: tech.effectCategory,
        };
      } else {
        updatedCategory.push({
          name: tech.name,
          description: tech.description,
          category: tech.category,
          place: tech.place,
          effect: tech.effect,
          effectCategory: tech.effectCategory,
        });
      }

      return {
        ...prev,
        [tech.category]: updatedCategory,
      };
    });

    switch (tech.category) {
      case TechnologicalRootType.NAVIGATION:
        setNavalPower((prev) => prev + 1);
        break;
      case TechnologicalRootType.MILITARY:
        setLandPower((prev) => prev + 1);
        break;
      case TechnologicalRootType.CULTURE:
        setCulturePower((prev) => prev + 1);
        break;
      default:
        break;
    }

    /* switch (tech.effect) {
    } */
  };

  return {
    techCompleteGraph,
    unlockTech,
    unlockedTechs,
    navalPower,
    landPower,
    culturePower,
    governmentModel,
    setGovernmentModel,
  };
};
