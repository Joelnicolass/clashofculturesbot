import { TechnologicalRootType } from "@/utils/enums";
import { Tech } from "../use_advance_tech";
import {
  rollForGovernment,
  rollForTechnology,
  selectRandomGovernanceModel,
} from "@/utils/tree_tech";

export const useAdvanceTechTurn = (
  unlockedTechs: Partial<Record<TechnologicalRootType, number[]>>,
  unlockTech: (tech: Tech | null) => void,
  setTurnSection: React.Dispatch<React.SetStateAction<React.ReactNode>>,
  governmentModel: TechnologicalRootType | null,
  setGovernmentModel: React.Dispatch<
    React.SetStateAction<TechnologicalRootType | null>
  >
) => {
  const advanceTechnologyTurn = (
    applyEffectCategory?: (
      effectCategory: Tech["effectCategory"] | null
    ) => void
  ) => {
    const tech = rollForTechnology(unlockedTechs);
    if (tech) {
      unlockTech(tech);

      const isNewGovernment = tech.advanceGovernment && !governmentModel;
      const isAdvanceGovernment = tech.advanceGovernment && governmentModel;
      let gov;

      if (isNewGovernment) {
        const newGovernmentRoot = selectRandomGovernanceModel();
        gov = rollForGovernment(unlockedTechs, newGovernmentRoot);
        if (gov) {
          unlockTech(gov);
          setGovernmentModel(newGovernmentRoot);
        }
      }

      if (isAdvanceGovernment) {
        gov = rollForGovernment(unlockedTechs, governmentModel);
        if (gov) {
          unlockTech(gov);
          if (gov.advanceWonder) {
            alert("¡Avance en una Maravilla!");
          }
        }
      }

      setTurnSection(
        <div className="text-white flex flex-col gap-2">
          <span className="font-bold flex items-center gap-2">
            ¡Nueva Tecnología Desbloqueada!
          </span>
          <div>
            <span className="font-semibold text-cyan-300">{tech.category}</span>{" "}
            - <span className="font-semibold text-indigo-300">{tech.name}</span>
            {tech.effectCategory && (
              <p className="text-sm text-white/60 mt-1">
                Se intenta añadir{" "}
                <span className="font-semibold text-orange-400">
                  {tech.effectCategory}
                </span>{" "}
                a las edificaciones pendientes
              </p>
            )}
          </div>

          {gov && isNewGovernment && (
            <div className="mt-2">
              <span className="font-semibold text-yellow-300">
                Nuevo Modelo de Gobierno:
              </span>{" "}
              <span className="font-semibold text-indigo-300">
                {gov.category}
              </span>
              <p className="text-sm text-white/60 mt-1">
                Se avanzó en{" "}
                <span className="font-semibold text-indigo-300">
                  {gov.name}
                </span>
              </p>
            </div>
          )}

          {gov && isAdvanceGovernment && (
            <div className="mt-2">
              <div>
                <span className="font-semibold text-cyan-300">
                  {gov.category}
                </span>{" "}
                -{" "}
                <span className="font-semibold text-indigo-300">
                  {gov.name}
                </span>
                <p className="text-sm text-white/60 mt-1">
                  La forma de gobierno ha avanzado
                </p>
              </div>
            </div>
          )}
        </div>
      );

      if (tech.effectCategory) {
        applyEffectCategory?.(tech.effectCategory);
      }
    } else {
      setTurnSection(
        <div className="text-white">
          <span className="text-white/60 text-sm">
            No se logró completar ningún avance.
          </span>
        </div>
      );
    }
  };

  return {
    advanceTechnologyTurn,
  };
};
