import { ReactNode } from "react";
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
import { IMAGE_RESOURCES } from "@/utils/mappers";
import { Button } from "@/components/ui/button";

export const useAttackTurn = (
  settlements: Settlement[],
  landPower: number,
  navalPower: number,
  setTurnSection: React.Dispatch<React.SetStateAction<ReactNode | null>>,
  numberToText: (number: number) => string,
  techCompleteGraph: Record<TechnologicalRootType, Tech[]>
) => {
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

  const attackTurn = () => {
    setTurnSection(
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

          {hasPort && (
            <div className="flex items-center gap-2 text-white/60 text-sm">
              <Sailboat /> Barcos cercanos -
              <span className="font-sm text-blue-400">
                Alcance: {navalPower} ({numberToText(navalPower)})
              </span>
            </div>
          )}
        </div>
        <p className="text-sm text-white/60">
          Puedes atacar a los ejercitos enemigos{" "}
          <span className="font-sm text-red-400">(colonos o ejercitos) </span>
          que estén a{" "}
          <span className="font-sm text-yellow-400">
            {landPower} ({numberToText(landPower)}){" "}
          </span>
          de distancia de tus propios ejercitos.
        </p>
        <p className="text-sm text-white/60">
          Si no puedes atacar directamente, pero tienes una ciudad que puede
          mover al ejercito,{" "}
          <span className="text-yellow-400">debes moverlo</span> en dirección a
          la ciudad enemiga más débil.
        </p>

        {hasPort && (
          <p className="text-sm text-white/60">
            Puedes atacar a los{" "}
            <span className="font-semibold text-blue-400">
              barcos enemigos{" "}
            </span>
            que estén a{" "}
            <span className="font-semibold text-yellow-400">
              {navalPower} ({numberToText(navalPower)}){" "}
            </span>
            de distancia de tus propios barcos.
          </p>
        )}

        <div className="flex mt-4">
          <Button disabled={true}>Conquisté una ciudad (en desarrollo)</Button>
        </div>
      </div>
    );
  };

  return {
    evaluateAttack,
    attackTurn,
  };
};
