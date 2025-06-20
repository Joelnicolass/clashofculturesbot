import { ReactNode, useState, useEffect } from "react";
import { Settlement } from "../use_settlement";
import {
  BuildingType,
  HappinessType,
  TechnologicalRootType,
} from "@/utils/enums";
import { Sailboat, Swords } from "lucide-react";
import { Tech } from "../use_advance_tech";
import { Separator } from "@radix-ui/react-separator";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { ICONS_BUILDINGS, IMAGE_RESOURCES } from "@/utils/mappers";
import { Button } from "@/components/ui/button";

export const useAttackTurn = (
  settlements: Settlement[],
  landPower: number,
  navalPower: number,
  setTurnSection: React.Dispatch<React.SetStateAction<ReactNode | null>>,
  numberToText: (number: number) => string,
  techCompleteGraph: Record<TechnologicalRootType, Tech[]>,
  conquestSettlement: (buildings: BuildingType[]) => Settlement | null
) => {
  const [conquestBuildings, setConquestBuildings] = useState<BuildingType[]>(
    []
  );

  const evaluateAttack = () => {
    const happySettlements = settlements.filter(
      (settlement) => settlement.happiness === HappinessType.HAPPY
    );

    return happySettlements;
  };

  const hasPort = settlements.some((settlement) =>
    settlement.buildings.includes(BuildingType.PORT)
  );

  // debe mover en caso de tener al menos 3 unidades
  // TODO -> refactorizar esto.
  const shouldMoveUnits = (settlement: Settlement) => {
    return (
      settlement.units.length >= 3 &&
      techCompleteGraph[TechnologicalRootType.MILITARY].some(
        (tech) => tech.name === "Tácticas"
      )
    );
  };

  const buildAttackSection = () => (
    <div className="text-white flex flex-col gap-2">
      <span className="font-bold flex items-center gap-2">
        ¡Atacad a los Enemigos!
      </span>
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 text-white/60 text-sm">
          <Swords /> Colonos cercanos -
          <span className="font-sm text-yellow-400">
            Alcance: {landPower} ({numberToText(landPower)})
          </span>
        </div>
        <div className="flex items-center gap-2 text-white/60 text-sm">
          <Swords /> Ejercitos cercanos -
          <span className="font-sm text-yellow-400">
            Alcance: {landPower} ({numberToText(landPower)})
          </span>
        </div>

        {hasPort && (
          <div className="flex items-center gap-2 text-white/60 text-sm">
            <Sailboat /> Barcos cercanos -
            <span className="font-sm text-blue-400">
              Alcance: {navalPower} ({numberToText(navalPower)})
            </span>
          </div>
        )}
      </div>

      <Separator className="bg-white/20 my-2 h-px" />

      {evaluateAttack().map((settlement) => (
        <div
          key={settlement.name}
          className="flex items-center gap-2 text-white/60 text-sm"
        >
          <Avatar className="w-5 h-5 border-1 border-white rounded-full">
            <AvatarImage
              className="w-5 h-5 scale-150"
              alt={settlement.name}
              src={IMAGE_RESOURCES[settlement.indicator]}
            />
          </Avatar>

          <span className="text-yellow-400">{settlement.name}</span>
          <span>
            {shouldMoveUnits(settlement)
              ? "Puede mover unidades"
              : "No puede mover unidades"}
          </span>
        </div>
      ))}

      <p className="text-sm text-white/60">
        Puedes atacar a los ejercitos enemigos{" "}
        <span className="font-sm text-red-400">(colonos o ejercitos) </span>
        que estén a{" "}
        <span className="font-sm text-yellow-400">
          {landPower} ({numberToText(landPower)}){" "}
        </span>
        de distancia de tus propios ejercitos.
      </p>

      {hasPort && (
        <p className="text-sm text-white/60">
          Puedes atacar a los{" "}
          <span className="font-semibold text-blue-400">barcos enemigos </span>
          que estén a{" "}
          <span className="font-semibold text-yellow-400">
            {navalPower} ({numberToText(navalPower)}){" "}
          </span>
          de distancia de tus propios barcos.
        </p>
      )}

      <p className="text-sm text-white/60">
        Si no puedes atacar directamente, pero tienes una ciudad que puede mover
        al ejercito, <span className="text-yellow-400">debes moverlo</span> en
        dirección a la ciudad enemiga más débil.
      </p>

      <div className="flex flex-col mt-4" key={`${conquestBuildings}`}>
        <Button
          onClick={() => {
            const conquest = conquestSettlement(conquestBuildings);

            if (conquest) {
              setTurnSection(
                <div className="text-white">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-bold">¡Conquista Exitosa!</span>
                  </div>
                  <span className="font-semibold text-green-400">
                    {conquest.name}
                  </span>{" "}
                  conquistada con los edificios:{" "}
                  <span className="font-semibold text-cyan-300">
                    {conquestBuildings.join(", ")}
                  </span>
                </div>
              );
            } else {
              setTurnSection(
                <div className="text-white">
                  No se pudo conquistar ninguna ciudad con los edificios
                  seleccionados.
                </div>
              );
            }
            setConquestBuildings([]);
          }}
        >
          Conquisté una ciudad
        </Button>

        <div className="flex gap-2 mt-4 flex-wrap flex-col">
          <span>Edificios que tiene la ciudad conquistada</span>
          <div className="flex gap-2 flex-wrap">
            {Object.values(BuildingType)
              .filter((s) => s != BuildingType.SETTLEMENT)
              .map((building) => (
                <div
                  key={building}
                  className={`flex items-center gap-1 cursor-pointer ${
                    conquestBuildings.includes(building)
                      ? "bg-white text-gray-800"
                      : "bg-gray-700 text-gray-300"
                  } p-1 rounded hover:bg-white/60 transition-colors ${
                    conquestBuildings.includes(building)
                      ? "border border-white"
                      : "border border-gray-600"
                  }`}
                  onClick={() => {
                    setConquestBuildings((prev) =>
                      prev.includes(building)
                        ? prev.filter((b) => b !== building)
                        : [...prev, building]
                    );
                  }}
                >
                  {ICONS_BUILDINGS[building as BuildingType]}
                  <span className="text-sm">{building}</span>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );

  const attackTurn = () => {
    setConquestBuildings([]);
    setTurnSection(buildAttackSection());
  };

  useEffect(() => {
    if (conquestBuildings.length === 0) return;

    setTurnSection(buildAttackSection());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conquestBuildings]);

  return {
    evaluateAttack,
    attackTurn,
  };
};
