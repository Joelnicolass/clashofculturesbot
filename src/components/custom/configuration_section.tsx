import { Cog } from "lucide-react";
import { GlassCard } from "./glass_card";
import { Separator } from "@radix-ui/react-separator";
import { Button } from "../ui/button";

export const ConfigurationSection = ({
  configuration,
  setConfiguration,
}: {
  configuration: {
    name: string;
    actionRates: Record<string, number>;
  };
  setConfiguration: (config: {
    name: string;
    actionRates: Record<string, number>;
  }) => void;
}) => {
  const sumRates = Object.values(configuration.actionRates).reduce(
    (acc, rate) => acc + rate,
    0
  );

  const isValid =
    Math.abs(sumRates - 1) > 0.001 ||
    Object.values(configuration.actionRates).some((rate) => rate < 0.01);

  return (
    <div>
      <GlassCard>
        <h3 className="text-lg font-semibold text-orange-400 flex items-center gap-2 pb-2">
          <Cog className="w-4 h-4 text-orange-400" />
          Configuración del BOT
        </h3>
        <Separator className="bg-white/20 mb-4 border-none h-px" />

        <div className="flex flex-col gap-2">
          <div className="grid grid-cols-2 gap-2 items-center">
            <label className="text-white/80">Nombre:</label>
            <input
              type="text"
              value={configuration.name}
              onChange={(e) =>
                setConfiguration({
                  ...configuration,
                  name: e.target.value,
                })
              }
              className="bg-transparent border-b-1 border-white/20 px-2 py-1 text-white"
            />
          </div>

          <Separator className="bg-white/20 my-2 border-none h-px" />
          <label className="text-white/80">Tasas de Acción:</label>
          <div>
            <span className="text-sm text-white/60">
              Los cambios se aplicarán en el próximo turno.
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {Object.entries(configuration.actionRates).map(([action, rate]) => (
              <div key={action} className="grid grid-cols-2 items-center gap-2">
                <label className="text-white/80 capitalize">
                  {action.toLowerCase()}:
                </label>
                <input
                  type="number"
                  value={rate}
                  step="0.01"
                  onChange={(e) =>
                    setConfiguration({
                      ...configuration,
                      actionRates: {
                        ...configuration.actionRates,
                        [action]: parseFloat(e.target.value),
                      },
                    })
                  }
                  className="bg-transparent border-b-1 border-white/20 px-2 py-1 text-white w-16"
                />
              </div>
            ))}
          </div>
          <div>
            <div className="flex items-center justify-between mt-2">
              <div>
                <span className="text-sm ml-2 text-white/60">
                  Suma: {sumRates.toFixed(2)}
                </span>
              </div>
              <Button
                onClick={() => {
                  const actions = Object.keys(configuration.actionRates);
                  const totalCents = 100;
                  const minCents = 1;
                  const remainingCents = totalCents - minCents * actions.length;
                  const randomValues = actions.map(() => Math.random());
                  const totalRandom = randomValues.reduce(
                    (sum, v) => sum + v,
                    0
                  );
                  const ratesCents: number[] = [];
                  let usedCents = 0;
                  actions.forEach((_, idx) => {
                    if (idx < actions.length - 1) {
                      const cents =
                        minCents +
                        Math.floor(
                          (randomValues[idx] / totalRandom) * remainingCents
                        );
                      ratesCents.push(cents);
                      usedCents += cents;
                    } else {
                      ratesCents.push(totalCents - usedCents);
                    }
                  });

                  const normalizedRates = Object.fromEntries(
                    actions.map((action, idx) => [
                      action,
                      ratesCents[idx] / 100,
                    ])
                  );

                  setConfiguration({
                    ...configuration,
                    actionRates: normalizedRates,
                  });
                }}
              >
                Randomizar Tasas
              </Button>
            </div>
          </div>

          {isValid ? (
            <div className="text-red-400 text-sm mt-2">
              La suma de las tasas de acción debe ser igual a 1.0 y cada tasa
              debe ser mayor o igual a 0.01. De lo contrario, el BOT no podrá
              realizar acciones correctamente.
            </div>
          ) : null}
        </div>
      </GlassCard>
    </div>
  );
};
