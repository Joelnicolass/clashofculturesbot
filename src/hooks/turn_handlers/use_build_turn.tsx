import { BuildingType, ResourceType } from "@/utils/enums";
import { Settlement } from "../use_settlement";
import { BuildingTrack } from "@/utils/types";

const CITY_NAMES = [
  "Nueva Esperanza",
  "Ciudad del Sol",
  "Fortaleza del Norte",
  "Puerto Alegre",
  "Villa del Mar",
  "Pueblo Unido",
  "Ciudadela de la Ciencia",
  "Tierra de los Valientes",
  "Asentamiento del Bosque",
  "Colonia del Desierto",
  "Ciudad de los Sueños",
  "Villa de la Sabiduría",
  "Fortaleza del Viento",
  "Puerto de la Luna",
  "Ciudad de la Aurora",
  "Asentamiento del Río",
  "Villa de la Montaña",
  "Ciudad de la Esperanza",
  "Fortaleza del Océano",
  "Puerto del Amanecer",
  "Ciudad de la Eternidad",
  "Villa del Horizonte",
  "Asentamiento del Valle",
  "Ciudad de la Armonía",
  "Fortaleza del Fuego",
];

export const useBuildTurn = (
  settlements: Settlement[],
  buildingTrack: BuildingTrack,
  initializeSettlement: (name: string, indicator: ResourceType) => void,
  addBuildingToSettlement: (
    settlementIndicator: ResourceType,
    building: BuildingType
  ) => { result: boolean },
  moveAllBuildingsToLeft: () => void,
  moveColonToSettlement: (
    settlementIndicator: ResourceType,
    settlements: Settlement[]
  ) => void,
  setTurnSection: React.Dispatch<React.SetStateAction<React.ReactNode>>
) => {
  const buildTurn = () => {
    const activeSettlement = settlements.find((s) => s.active);
    if (!activeSettlement) return;

    const keys = Object.keys(buildingTrack);
    const startIndex = keys.findIndex(
      (key) => buildingTrack[key as keyof typeof buildingTrack] !== null
    );

    if (startIndex === -1) return;

    const resources = Object.values(ResourceType);

    for (let i = startIndex; i < keys.length; i++) {
      const key = keys[i] as keyof typeof buildingTrack;
      const building = buildingTrack[key];
      if (!building) continue;
      // en el primer lugar, permitir fundar ciudad si es Settlement
      if (i === startIndex && building === BuildingType.SETTLEMENT) {
        const nextResource = resources.find(
          (res) => !settlements.some((s) => s.indicator === res)
        );
        if (nextResource) {
          const newName =
            CITY_NAMES[Math.floor(Math.random() * CITY_NAMES.length)];
          initializeSettlement(newName, nextResource);
          moveAllBuildingsToLeft();
          setTurnSection(
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="font-bold">¡Nueva Ciudad!</span>
              </div>
              <div className="text-white">
                <span className="font-semibold text-green-400">{building}</span>{" "}
                {newName} fundado en{" "}
                <span className="font-semibold text-cyan-300">
                  {nextResource}
                </span>
              </div>
            </div>
          );
        }

        return;
      }
      // en intentos posteriores, ignorar Settlement
      if (building === BuildingType.SETTLEMENT) continue;

      // intentar construir edificio
      const { result } = addBuildingToSettlement(
        activeSettlement.indicator,
        building
      );
      if (result) {
        moveAllBuildingsToLeft();
        setTurnSection(
          <div className="text-white">
            <div className="flex items-center gap-2 mb-2">
              <span className="font-bold">¡Edificio Inaugurado!</span>
            </div>
            <span className="font-semibold text-green-400">{building}</span>{" "}
            construido en{" "}
            <span className="font-semibold text-cyan-300">
              {activeSettlement.name}
            </span>
          </div>
        );
        return;
      }
    }

    // si ningún edificio pudo construirse
    // mover colono a la ciudad con menos edificios sin contar donde se encuentra
    const smallestSettlement = settlements.reduce((prev, curr) => {
      if (curr.buildings.length < prev.buildings.length) return curr;
      return prev;
    });

    moveColonToSettlement(smallestSettlement.indicator, settlements);

    setTurnSection(
      <div className="text-white">
        No se pudo construir ningún edificio pendiente en{" "}
        <span className="font-semibold text-cyan-300">
          {activeSettlement.name}
        </span>
      </div>
    );
  };

  return {
    buildTurn,
  };
};
