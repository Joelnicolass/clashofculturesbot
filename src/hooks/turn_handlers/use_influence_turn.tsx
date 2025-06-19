import React, { ReactNode, startTransition, useRef } from "react";
import { Settlement } from "../use_settlement";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { IMAGE_RESOURCES } from "@/utils/mappers";

export const useInfluenceTurn = (
  setTurnSection: React.Dispatch<React.SetStateAction<ReactNode | null>>,
  settlements: Settlement[],
  cultureCount: number,
  decrementCultureInPoints: (points: number) => void,
  turnCount: number,
  calculateSettlementLevel: (settlement: Settlement) => number
) => {
  const cultureUsed = useRef<HTMLInputElement | null>(null);

  const influenceTurn = () => {
    setTurnSection(
      <div
        className="text-white flex flex-col gap-2"
        key={`influence-${turnCount}-${cultureCount}`}
      >
        <span className="font-bold flex items-center gap-2">¡Influenciar!</span>

        <p className="text-sm text-white/60">
          Intenta influenciar culturalmente a la ciudad más cercana. Dispones de{" "}
          <span className="font-semibold text-indigo-400">{cultureCount}</span>{" "}
          puntos de cultura para aumentar tu rango de influencia.
        </p>

        <div className="text-sm text-white/60 mb-4">
          <span className="flex flex-col gap-1">
            {settlements.map((settlement, idx) => (
              <div
                key={`settlement-${idx}-${settlement.indicator}`}
                className="flex items-center gap-2 mb-2"
              >
                <Avatar className="w-6 h-6 border-1 border-white rounded-full">
                  <AvatarImage
                    className="w-6 h-6 scale-150"
                    alt={settlement.name}
                    src={IMAGE_RESOURCES[settlement.indicator]}
                  />
                </Avatar>
                <span>{settlement.name}</span>
                <span className="text-yellow-400">
                  Alcance {calculateSettlementLevel(settlement)} + (
                  {cultureCount})
                </span>
              </div>
            ))}
          </span>

          <span className="text-sm text-white/60">
            <span className="font-semibold text-yellow-400">IMPORTANTE: </span>
            Recuerda actualziar el track de cultura en función de los puntos que
            se hayan utilizado.
          </span>

          <div className="mt-4 flex flex-row gap-2 justify-between">
            <input
              ref={cultureUsed}
              name="cultureUsed"
              type="number"
              className="mt-2 w-full bg-transparent border-b-1 border-white/20 px-2 py-1 text-white"
              placeholder="Puntos de cultura utilizados"
              onChange={(e) => {
                const value = parseInt(e.target.value, 10);
                if (!isNaN(value)) {
                  cultureUsed.current = e.target;
                }
              }}
            />
            <Button
              className="mt-2"
              onClick={() => {
                if (!cultureUsed.current || !cultureUsed.current.value) return;

                if (parseInt(cultureUsed.current.value) > cultureCount) {
                  alert(
                    "No puedes utilizar más puntos de cultura de los que tienes."
                  );
                  return;
                }

                decrementCultureInPoints(
                  cultureUsed.current
                    ? parseInt(cultureUsed.current.value, 10)
                    : 0
                );

                startTransition(() => {
                  setTurnSection(
                    <div className="text-white">
                      <span className="font-semibold text-green-400">
                        Influencia aplicada correctamente.
                      </span>
                      <p className="text-sm text-white/60 mt-1">
                        Has utilizado{" "}
                        <span className="font-semibold text-yellow-400">
                          {cultureUsed.current?.value || 0}
                        </span>{" "}
                        puntos de cultura para influenciar a la ciudad más
                        cercana.
                      </p>
                    </div>
                  );
                });

                if (cultureUsed.current) {
                  cultureUsed.current.value = "";
                  cultureUsed.current = null;
                }
              }}
            >
              Aplicar Influencia
            </Button>
          </div>
        </div>
      </div>
    );
  };

  return {
    influenceTurn,
    cultureUsed,
  };
};
