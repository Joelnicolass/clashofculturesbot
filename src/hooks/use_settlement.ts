import {
  BuildingType,
  HappinessType,
  ResourceType,
  UnitType,
} from "@/utils/enums";
import { useState } from "react";
import { increaseHappiness, decreaseHappiness } from "@/utils/functions";

export type Settlement = {
  indicator: ResourceType; // indicador de asentamiento
  name: string; // nombre del asentamiento
  active: boolean; // si el colono se encuentra aquí
  isDestroyed: boolean; // si el asentamiento ha sido destruido
  units: UnitType[]; // unidades en el asentamiento
  buildings: BuildingType[]; // edificios construidos en el asentamiento
  maxBuildings: number; // cantidad máxima de edificios permitidos
  happiness?: HappinessType; // felicidad del asentamiento
  ships?: number; // cantidad de barcos en el asentamiento
};

const MAX_BUILDINGS = 4; // cantidad máxima de edificios por asentamiento

const initialSettlement: Settlement = {
  indicator: ResourceType.FOOD,
  name: "Capital",
  active: true,
  isDestroyed: false,
  units: [UnitType.INFANTRY],
  buildings: [],
  maxBuildings: MAX_BUILDINGS,
  happiness: HappinessType.HAPPY,
  ships: 0, // cantidad de barcos en el asentamiento
};

const createSettlement = (
  indicator: ResourceType,
  name: string
): Settlement => {
  return {
    indicator,
    name,
    active: false,
    isDestroyed: false,
    units: [],
    buildings: [],
    maxBuildings: MAX_BUILDINGS,
    happiness: HappinessType.NEUTRAL,
    ships: 0,
  };
};

export const useSettlement = () => {
  const [settlements, setSettlements] = useState<Settlement[]>([
    initialSettlement,
  ]);

  const _setSettlementActive = (
    indicator: ResourceType,
    settlements: Settlement[]
  ) => {
    const updatedSettlements = settlements.map((settlement) => ({
      ...settlement,
      active: settlement.indicator === indicator,
    }));
    return updatedSettlements;
  };

  const _evaluateMinimumBuildings = (settlements: Settlement[]) => {
    return settlements.reduce((prev, current) => {
      if (
        current.buildings.length < prev.buildings.length &&
        !current.isDestroyed &&
        current.happiness !== HappinessType.ANGRY
      ) {
        return current;
      }
      return prev;
    });
  };

  const _evaluateValidSettlement = (indicator: ResourceType): boolean =>
    settlements.some((settlement) => settlement.indicator === indicator);

  const initializeSettlement = (name: string, indicator: ResourceType) => {
    if (_evaluateValidSettlement(indicator)) return;

    const newSettlement: Settlement = createSettlement(indicator, name);
    const newSettlements = [...settlements, newSettlement];

    const selectActiveSettlement = _evaluateMinimumBuildings(newSettlements);
    const settlementsWithActiveUpdated = _setSettlementActive(
      selectActiveSettlement.indicator,
      newSettlements
    );

    setSettlements(settlementsWithActiveUpdated);
  };

  const incrementHappinessAllCities = () => {
    const updatedSettlements = settlements.map((settlement) => {
      const currentHappiness = settlement.happiness || HappinessType.NEUTRAL;
      const newHappiness = increaseHappiness(currentHappiness);
      return { ...settlement, happiness: newHappiness };
    });
    setSettlements(updatedSettlements);
  };

  const decrementHappinessAllCities = () => {
    const updatedSettlements = settlements.map((settlement) => {
      const currentHappiness = settlement.happiness || HappinessType.NEUTRAL;
      const newHappiness = decreaseHappiness(currentHappiness);
      return { ...settlement, happiness: newHappiness };
    });
    setSettlements(updatedSettlements);
  };

  const decrementHappiness = (indicator: ResourceType) => {
    const updatedSettlements = settlements.map((settlement) => {
      if (settlement.indicator === indicator) {
        const currentHappiness = settlement.happiness || HappinessType.NEUTRAL;
        const newHappiness = decreaseHappiness(currentHappiness);
        return { ...settlement, happiness: newHappiness };
      }
      return settlement;
    });
    setSettlements(updatedSettlements);
  };

  const incrementHappiness = (indicator: ResourceType) => {
    const updatedSettlements = settlements.map((settlement) => {
      if (settlement.indicator === indicator) {
        const currentHappiness = settlement.happiness || HappinessType.NEUTRAL;
        const newHappiness = increaseHappiness(currentHappiness);
        return { ...settlement, happiness: newHappiness };
      }
      return settlement;
    });
    setSettlements(updatedSettlements);
  };

  const moveColonToSettlement = (
    indicator: ResourceType,
    settlements: Settlement[]
  ): Settlement | undefined => {
    const foundSettlement = settlements.find(
      (settlement) => settlement.indicator === indicator
    );
    if (!foundSettlement) return;
    const updatedSettlements = settlements.map((settlement) => {
      if (settlement.indicator === indicator) {
        return { ...settlement, active: true };
      }
      return { ...settlement, active: false };
    });
    setSettlements(updatedSettlements);
    return foundSettlement;
  };

  const calculateSettlementLevel = (s: Settlement) =>
    s.buildings.length + 1 + (s.happiness === HappinessType.HAPPY ? 1 : 0);

  const findSettlementMinimumBuildings = () =>
    _evaluateMinimumBuildings(settlements);

  const addBuildingToSettlement = (
    indicator: ResourceType,
    building: BuildingType
  ): {
    result: boolean;
    settlement: Settlement | undefined;
  } => {
    let isBuild = false;
    const updatedSettlements = settlements.map((settlement) => {
      if (settlement.indicator === indicator) {
        if (
          settlement.buildings.length < settlement.maxBuildings &&
          !settlement.buildings.includes(building)
        ) {
          isBuild = true;
          return {
            ...settlement,
            buildings: [...settlement.buildings, building],
          };
        }
      }
      return settlement;
    });

    const smallestSettlement = _evaluateMinimumBuildings(updatedSettlements);
    const settlementsWithActiveUpdated = _setSettlementActive(
      smallestSettlement.indicator,
      updatedSettlements
    );

    setSettlements(settlementsWithActiveUpdated);

    return {
      result: isBuild,
      settlement: settlementsWithActiveUpdated.find(
        (settlement) => settlement.indicator === indicator
      ),
    };
  };

  const conquestSettlement = (buildings: BuildingType[]) => {
    // si tengo todos los asentamientos construidos, no puedo conquistar más
    if (settlements.length >= Object.keys(ResourceType).length) return null;

    // conquistar equivale a crear un nuevo asentamiento pero con la felicidad en enojo.
    const newIndicator = Object.values(ResourceType).find(
      (res) => !settlements.some((s) => s.indicator === res)
    );
    if (!newIndicator) return null;

    const newName = `Conquistado ${newIndicator}`;
    const newSettlement = createSettlement(newIndicator, newName);
    newSettlement.happiness = HappinessType.ANGRY; // felicidad en enojo al conquistar
    newSettlement.buildings = buildings; // asignar edificios conquistados
    const updatedSettlements = [...settlements, newSettlement];
    const selectActiveSettlement =
      _evaluateMinimumBuildings(updatedSettlements);
    const settlementsWithActiveUpdated = _setSettlementActive(
      selectActiveSettlement.indicator,
      updatedSettlements
    );

    setSettlements(settlementsWithActiveUpdated);
    return newSettlement;
  };

  return {
    settlements,
    initializeSettlement,
    decrementHappiness,
    incrementHappiness,
    incrementHappinessAllCities,
    decrementHappinessAllCities,
    moveColonToSettlement,
    calculateSettlementLevel,
    findSettlementMinimumBuildings,
    addBuildingToSettlement,
    setSettlements,
    conquestSettlement,
  };
};
