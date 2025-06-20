"use client";

import { useAdvanceTech } from "@/hooks/use_advance_tech";
import { Button } from "@/components/ui/button";
import { TechnologySection } from "@/components/custom/technology_section";
import { HeaderSection } from "@/components/custom/header_section";
import { GlassCard } from "@/components/custom/glass_card";
import {
  Anchor,
  BookOpen,
  Box,
  Building,
  Crown,
  Dot,
  Hammer,
  Laugh,
  PersonStanding,
  Play,
  Sailboat,
  Swords,
  Tally4Icon,
  TrendingUp,
} from "lucide-react";
import { ReactNode, startTransition, useEffect, useState } from "react";
import { Settlement, useSettlement } from "@/hooks/use_settlement";
import {
  BuildingType,
  HappinessType,
  IBOActions,
  ResourceType,
  TechnologicalRootType,
  UnitType,
} from "@/utils/enums";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { useAdvanceTechTurn } from "@/hooks/turn_handlers/use_advance_tech_turn";
import { numberToText, selectWeightedRandom } from "@/utils/functions";
import { useAttackTurn } from "@/hooks/turn_handlers/use_attack_turn";
import { useCounter } from "@/hooks/use_counter";
import { useBuildTurn } from "@/hooks/turn_handlers/use_build_turn";
import { useBuildTrack } from "@/hooks/use_build_track";
import { ConfigurationSection } from "@/components/custom/configuration_section";
import { useInfluenceTurn } from "@/hooks/turn_handlers/use_influence_turn";
import {
  DEFAUlT_ACTION_RATES,
  DEFAULT_RECRUIT_RATES,
  HAPPINESS_STAUS_COLORS,
  ICONS_BUILDINGS,
  IMAGE_RESOURCES,
} from "@/utils/mappers";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Elephant from "../../public/elephant_icon.svg";
import Cavalry from "../../public/cavalry_icon.svg";
import Image from "next/image";
import { Separator } from "@radix-ui/react-separator";

const UNITS_ICONS = {
  [UnitType.INFANTRY]: <Swords className="w-5 h-5 text-white" />,
  [UnitType.CAVALRY]: (
    <Image className="w-5 h-5 invert" src={Cavalry} alt="Infantry Icon" />
  ),
  [UnitType.ELEPHANT]: (
    <Image className="w-5 h-5 invert" src={Elephant} alt="Infantry Icon" />
  ),
  [UnitType.LEADER]: <Crown className="w-5 h-5 text-white" />,
  [UnitType.SHIP]: <Sailboat className="w-5 h-5 text-white" />,
};

export default function Home() {
  const [configuration, setConfiguration] = useState<{
    name: string;
    actionRates: Record<IBOActions, number>;
  }>({
    name: "BOT Clash of Cultures",
    actionRates: DEFAUlT_ACTION_RATES,
  });

  const [turnSection, setTurnSection] = useState<React.ReactNode>(null);

  const {
    techCompleteGraph,
    unlockTech,
    unlockedTechs,
    culturePower,
    landPower,
    navalPower,
    governmentModel,
    setGovernmentModel,
  } = useAdvanceTech();

  const {
    initializeSettlement,
    settlements,
    calculateSettlementLevel,
    addBuildingToSettlement,
    moveColonToSettlement,
    setSettlements,
    incrementHappinessAllCities,
    conquestSettlement,
  } = useSettlement();

  const {
    totalTechs,
    turnCount,
    cultureCount,
    incrementTurnCount,
    decrementCultureCount,
    incrementCultureCount,
    decrementCultureInPoints,
    setCultureCount,
  } = useCounter(techCompleteGraph, culturePower);

  const { advanceTechnologyTurn } = useAdvanceTechTurn(
    unlockedTechs,
    unlockTech,
    setTurnSection,
    governmentModel,
    setGovernmentModel
  );

  const { buildingTrack, addBuilding, moveAllBuildingsToLeft } =
    useBuildTrack();

  const { buildTurn } = useBuildTurn(
    settlements,
    buildingTrack,
    initializeSettlement,
    addBuildingToSettlement,
    moveAllBuildingsToLeft,
    moveColonToSettlement,
    setTurnSection
  );

  const { attackTurn } = useAttackTurn(
    settlements,
    landPower,
    navalPower,
    setTurnSection,
    numberToText,
    techCompleteGraph,
    conquestSettlement
  );

  const { influenceTurn } = useInfluenceTurn(
    setTurnSection,
    settlements,
    cultureCount,
    decrementCultureInPoints,
    turnCount,
    calculateSettlementLevel
  );

  const [counterEvent, setCounterEvent] = useState<number>(3);
  const decrementCounterEvent = () => {
    if (counterEvent <= 0) {
      setCounterEvent(3);
      return;
    }
    setCounterEvent((prev) => prev - 1);
  };
  const [statePhase, setStatePhase] = useState<ReactNode>(null);

  useEffect(() => {
    if (counterEvent <= 0) {
      setCounterEvent(3);
      alert("Juega carta de evento");
      return;
    }
  }, [counterEvent]);

  const processTurn = () => {
    const mapper: Record<IBOActions, () => void> = {
      [IBOActions.ADVANCE]: () => {
        advanceTechnologyTurn((effectCategory) => {
          addBuilding(effectCategory as BuildingType);
          decrementCounterEvent();
        });
        incrementCultureCount();
      },
      [IBOActions.ATACK]: () => {
        attackTurn();
      },
      [IBOActions.BUILD]: () => {
        buildTurn();
      },
      [IBOActions.INFLUENCE]: () => {
        influenceTurn();
      },
      [IBOActions.RECRUIT]: () => {
        // verificar si puedo construir unidades avanzadas
        const canRecruitAdvancedUnits = settlements.some((settlement) =>
          settlement.buildings.includes(BuildingType.MARKET)
        );

        // verificar si ya hay un líder (solo puede haber uno vivo a la vez)
        let hasLeader = settlements.some((settlement) =>
          settlement.units.some((unit) => unit === UnitType.LEADER)
        );

        // buscar todas las ciudades felices
        const happySettlements = settlements.filter(
          (settlement) => settlement.happiness === HappinessType.HAPPY
        );

        // comprobar que el nivel de la ciudad sea menor o igual a la cantidad de unidades que tenga
        const validSettlements = happySettlements.filter(
          (settlement) =>
            calculateSettlementLevel(settlement) > settlement.units.length
        );

        // construir unidades en todas las ciudades validas, si la ciduad tiene un puerto, construir tambien un barco

        const unitsToRecruit: Record<Settlement["indicator"], UnitType[]> = {
          [ResourceType.FOOD]: [],
          [ResourceType.WOOD]: [],
          [ResourceType.STONE]: [],
          [ResourceType.SCIENCE]: [],
          [ResourceType.GOLD]: [],
        };

        const shipsToRecruit: Record<Settlement["indicator"], number> = {
          [ResourceType.FOOD]: 0,
          [ResourceType.WOOD]: 0,
          [ResourceType.STONE]: 0,
          [ResourceType.SCIENCE]: 0,
          [ResourceType.GOLD]: 0,
        };

        validSettlements.forEach((settlement) => {
          // seleccionar una unidad por ciudad según rates, respetando un líder único
          let unitType: UnitType;
          if (canRecruitAdvancedUnits) {
            unitType = selectWeightedRandom(DEFAULT_RECRUIT_RATES);
            if (unitType === UnitType.LEADER) {
              if (hasLeader) {
                unitType = UnitType.INFANTRY;
              } else {
                // marcamos que ya reclutamos líder
                hasLeader = true;
              }
            }
          } else {
            unitType = UnitType.INFANTRY;
          }
          unitsToRecruit[settlement.indicator].push(unitType);
        });

        // comprobar todas las ciudades que tengan puerto y agregar un barco
        happySettlements.forEach((settlement) => {
          if (settlement.buildings.includes(BuildingType.PORT)) {
            // si la ciudad tiene puerto, agregar un barco
            shipsToRecruit[settlement.indicator] += 1;
          }
        });

        // agregar las unidades a las ciudades
        const updatedSettlements = settlements.map((settlement) => {
          const newUnits = unitsToRecruit[settlement.indicator];
          if (newUnits.length > 0) {
            return {
              ...settlement,
              units: [...settlement.units, ...newUnits],
              ships: settlement.ships
                ? settlement.ships + shipsToRecruit[settlement.indicator]
                : shipsToRecruit[settlement.indicator],
            };
          }
          return settlement;
        });

        setSettlements(updatedSettlements);
        setTurnSection(
          <div className="text-white flex flex-col gap-2">
            <span className="font-bold flex items-center gap-2">
              ¡Reclutar Unidades!
            </span>
            {Object.values(unitsToRecruit).some((units) => units.length > 0) ? (
              <>
                <div className="text-sm text-white/60">
                  Se han reclutado unidades en las siguientes ciudades:
                </div>
                <div className="text-sm text-white/60">
                  <div className="flex flex-col gap-1">
                    {Object.entries(unitsToRecruit).map(
                      ([indicator, units]) => {
                        if (units.length === 0) return null;
                        return (
                          <div
                            key={indicator}
                            className="text-white/60 flex items-center gap-2"
                          >
                            {units.map((unit, idx) => (
                              <span
                                key={`${indicator}-${idx}`}
                                className="text-yellow-400 flex items-center gap-1 opacity-80"
                              >
                                {UNITS_ICONS[unit]}{" "}
                                {unit === UnitType.LEADER ? "Líder" : unit}
                              </span>
                            ))}
                            <span>en la ciudad</span>
                            <Avatar className="inline-block w-5 h-5 border-1 border-white rounded-full">
                              <AvatarImage
                                className="w-5 h-5 scale-150"
                                alt={indicator}
                                src={IMAGE_RESOURCES[indicator as ResourceType]}
                              />
                            </Avatar>
                            <span className="text-yellow-400">
                              {
                                settlements.find(
                                  (settlement) =>
                                    settlement.indicator === indicator
                                )?.name
                              }
                            </span>
                          </div>
                        );
                      }
                    )}
                  </div>
                </div>
              </>
            ) : (
              <div className="text-sm text-white/60">
                No se han reclutado unidades en ninguna ciudad.
              </div>
            )}
            {shipsToRecruit &&
              Object.values(shipsToRecruit).some((count) => count > 0) && (
                <div className="text-sm text-white/60 mt-2">
                  Han surcado los mares:
                  <div className="flex gap-1 mt-2 flex-col">
                    {Object.entries(shipsToRecruit).map(
                      ([indicator, count]) => {
                        if (count === 0) return null;
                        return (
                          <div
                            key={indicator}
                            className="text-white/60 flex items-center gap-2"
                          >
                            <Sailboat className="text-white/60" />
                            <span>en el puerto de </span>
                            <Avatar className="inline-block w-5 h-5 mr-1 border-1 border-white rounded-full">
                              <AvatarImage
                                className="w-5 h-5 scale-150"
                                alt={indicator}
                                src={IMAGE_RESOURCES[indicator as ResourceType]}
                              />
                            </Avatar>
                            {
                              settlements.find(
                                (settlement) =>
                                  settlement.indicator === indicator
                              )?.name
                            }
                          </div>
                        );
                      }
                    )}
                  </div>
                </div>
              )}
          </div>
        );
      },
    };

    const chosen = selectWeightedRandom(configuration.actionRates);
    mapper[chosen]();
    console.log(`Turno ${turnCount + 1} - Acción: ${chosen}`);

    incrementTurnCount();
  };

  return (
    <div className="flex flex-col min-h-screen gap-4 p-2">
      <HeaderSection title={configuration.name} turnCount={turnCount} />
      <GlassCard className="w-full h-[50px] rounded-md min-w-[100px]">
        <div className="flex gap-2 items-center justify-center">
          {Array.from({ length: counterEvent }).map((_, idx) => (
            <Box key={`event-${idx}`} className="w-4 h-4 text-white" />
          ))}
        </div>
      </GlassCard>
      <div
        className="grid gap-2 items-center"
        style={{
          gridTemplateAreas: `
            "turn turn state"
            `,
          gridTemplateColumns: "1fr 0.5fr 1fr",
        }}
      >
        <Button
          className="w-full text-lg cursor-pointer h-[50px]"
          onClick={() => {
            startTransition(() => {
              setStatePhase(null);
              processTurn();
            });
          }}
          style={{ gridArea: "turn" }}
        >
          <Play className="w-5 h-5 mr-2" />
          Sig. Acción
        </Button>

        <Button
          className="w-full h-[50px] text-lg cursor-pointer border-1 border-white hover:border-white/40 bg-transparent text-white hover:bg-blue-500 transition-colors"
          onClick={() => {
            startTransition(() => {
              // ejecutar turnos de fase de estado

              // paso 1 -> incrementar felicidad de todas las ciudades
              incrementHappinessAllCities();

              // paso 2 -> ejecutar una acción de turno
              processTurn();

              // paso 3 -> avanzar tecnología gratuitamente
              const { tech } = advanceTechnologyTurn((effectCategory) => {
                addBuilding(effectCategory as BuildingType);
              });

              // paso 4 -> ganar cultura por cada dos avances en root de cultura

              const cultureGained = (techRoot: TechnologicalRootType) => {
                const techs = techCompleteGraph[techRoot];
                return Math.floor(techs.length / 2);
              };

              const totalCultureGained = cultureGained(
                TechnologicalRootType.CULTURE
              );

              setCultureCount((prev) => prev + totalCultureGained);

              setStatePhase(
                <div className="text-white flex flex-col gap-2">
                  <span className="font-bold flex items-center gap-2">
                    ¡Fase de Estado Ejecutada!
                  </span>
                  <div className="text-sm text-white/60">
                    Se ha incrementado la felicidad de todas las ciudades y se
                    han ganado{" "}
                    <span className="font-semibold text-yellow-400">
                      {totalCultureGained} puntos de cultura
                    </span>
                    .
                  </div>

                  {tech && (
                    <div className="text-sm text-white/60">
                      Se ha avanzado en la tecnología{" "}
                      <span className="font-semibold text-indigo-300">
                        {tech.name}
                      </span>{" "}
                      sin coste.
                    </div>
                  )}
                </div>
              );
            });
          }}
          style={{ gridArea: "state" }}
        >
          <TrendingUp className="w-5 h-5 mr-2" />
          Fase de Estado
        </Button>
      </div>

      <GlassCard>
        {turnSection || (
          <div className="text-white/60 text-sm">Nada por aquí...</div>
        )}
        {statePhase && (
          <>
            <Separator className="bg-white/20 my-4 border-none h-px" />
            <div className="mt-2 text-white/60">{statePhase}</div>
          </>
        )}
      </GlassCard>

      <GlassCard>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">
            Ciudades Fundadas
          </h2>
          <span className="text-sm text-white/60">
            {settlements.length}{" "}
            {settlements.length === 1 ? "Ciudad" : "Ciudades"}
          </span>
        </div>
        <div className="mt-2 grid grid-cols-3 gap-3">
          {settlements.map((settlement, index) => (
            <GlassCard
              key={index}
              style={{
                backgroundColor: `
                  ${
                    settlement.active
                      ? "rgba(255, 255, 255, 0.1)"
                      : "transparent"
                  }
                `,
              }}
            >
              <div className="flex flex-col items-center">
                <div className="text-xs text-white/60 mb-2">
                  <span className="font-semibold">
                    lvl {calculateSettlementLevel(settlement)}
                  </span>
                </div>

                <Avatar className="border-2 border-white rounded-full mb-1">
                  <AvatarImage
                    className="w-8 h-8 scale-150 "
                    alt={settlement.name}
                    src={IMAGE_RESOURCES[settlement.indicator]}
                  />
                </Avatar>
                <div className="mt-2 flex items-center justify-center">
                  <Laugh
                    className={`w-4 h-4 ${
                      HAPPINESS_STAUS_COLORS[
                        settlement.happiness as HappinessType
                      ]
                    } mx-auto mb-1`}
                  />
                </div>
                <div className="text-sm font-bold text-white text-center mb-1">
                  {settlement.name}
                </div>
                {settlement.buildings.length > 0 && (
                  <div className="flex items-center justify-center gap-2 mt-2 mb-2">
                    {settlement.buildings.map((building, idx) => (
                      <span
                        key={idx}
                        className="text-xs text-white/80 flex items-center gap-2"
                      >
                        {ICONS_BUILDINGS[building]}
                      </span>
                    ))}
                  </div>
                )}
                <div className="text-xs text-white/60">
                  {settlement.active && (
                    <span className="inline-flex items-center">
                      Colono Aquí
                    </span>
                  )}
                </div>
              </div>
              <div className="text-xs text-white/60 mt-1 flex items-center justify-center">
                <span>{settlement.units.length} Unidad(es)</span>
              </div>
            </GlassCard>
          ))}
        </div>
      </GlassCard>

      <div className="grid grid-cols-2 gap-3">
        <GlassCard className="text-center">
          <div className="flex items-center justify-between">
            <Button onClick={decrementCultureCount}>-</Button>
            <div className="flex-1 flex flex-col items-center justify-center">
              <PersonStanding className="w-6 h-6 text-indigo-400 mx-auto mb-2" />
              <div className="text-xl font-bold text-white">{cultureCount}</div>
              <div className="text-xs text-white/60">Cultura</div>
            </div>
            <Button onClick={() => incrementCultureCount(false)}>+</Button>
          </div>
        </GlassCard>
        <GlassCard className="text-center">
          <div className="flex items-center justify-between">
            <div className="flex-1 flex flex-col items-center justify-center">
              <Tally4Icon className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
              <div className="text-xl font-bold text-white">
                {Object.values(buildingTrack).map((building, idx) => {
                  if (!building)
                    return (
                      <Dot
                        key={`building-empty-${idx}`}
                        className="inline-block w-4 h-4 text-white mr-1"
                      />
                    );

                  return (
                    <span
                      key={`building-${idx}`}
                      className="inline-block mr-1 text-yellow-400"
                    >
                      <div>{ICONS_BUILDINGS[building]}</div>
                    </span>
                  );
                })}
              </div>

              <div className="text-xs text-white/60">Edificios pendientes</div>
            </div>
          </div>
        </GlassCard>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <GlassCard className="text-center">
          <Swords className="w-6 h-6 text-red-400 mx-auto mb-2" />
          <div className="text-xl font-bold text-white">+{landPower}</div>
          <div className="text-xs text-white/60">Alcance militar</div>
        </GlassCard>
        <GlassCard className="text-center">
          <Anchor className="w-6 h-6 text-blue-400 mx-auto mb-2" />
          <div className="text-xl font-bold text-white">+{navalPower}</div>
          <div className="text-xs text-white/60">Alcance Naval</div>
        </GlassCard>
        <GlassCard className="text-center">
          <PersonStanding className="w-6 h-6 text-indigo-400 mx-auto mb-2" />
          <div className="text-xl font-bold text-white">+{culturePower}</div>
          <div className="text-xs text-white/60">Poder Cultural</div>
        </GlassCard>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <GlassCard className="text-center">
          <Building className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
          <div className="text-xl font-bold text-white">
            {settlements.length}
          </div>
          <div className="text-xs text-white/60">Ciudades</div>
        </GlassCard>
        <GlassCard className="text-center">
          <Hammer className="w-6 h-6 text-orange-400 mx-auto mb-2" />
          <div className="text-xl font-bold text-white">
            {settlements.reduce(
              (acc, settlement) => acc + settlement.buildings.length,
              0
            ) + settlements.filter((s) => !s.isDestroyed).length}
          </div>
          <div className="text-xs text-white/60">Edificios</div>
        </GlassCard>
        <GlassCard className="text-center">
          <BookOpen className="w-6 h-6 text-cyan-400 mx-auto mb-2" />
          <div className="text-xl font-bold text-white">{totalTechs}</div>
          <div className="text-xs text-white/60">Tecnologías</div>
        </GlassCard>
      </div>

      <Accordion type="single" collapsible>
        <AccordionItem value="item-1">
          <AccordionTrigger>Ver Tecnologías Desbloqueadas</AccordionTrigger>
          <AccordionContent>
            <TechnologySection techCompleteGraph={techCompleteGraph} />
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <Accordion type="single" collapsible>
        <AccordionItem value="item-1">
          <AccordionTrigger>Ver Configuración del BOT</AccordionTrigger>
          <AccordionContent>
            <ConfigurationSection
              configuration={configuration}
              setConfiguration={setConfiguration}
            />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      <GlassCard className="text-center flex flex-col items-center justify-center">
        <span className="text-sm text-white/60 flex items-center gap-2 mb-2">
          POR JOEL NICOLAS SARTORI
        </span>
        <div className="flex flex-row items-center justify-between">
          {UNITS_ICONS[UnitType.INFANTRY]}
          {UNITS_ICONS[UnitType.CAVALRY]}
          {UNITS_ICONS[UnitType.ELEPHANT]}
          {UNITS_ICONS[UnitType.LEADER]}
          {UNITS_ICONS[UnitType.SHIP]}
        </div>
      </GlassCard>
    </div>
  );
}
