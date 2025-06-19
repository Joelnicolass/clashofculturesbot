import { BuildingType } from "@/utils/enums";
import { BuildingTrack } from "@/utils/types";
import { useState } from "react";

const INITIAL_BUILDING_TRACK: BuildingTrack = {
  place0: BuildingType.SETTLEMENT,
  place1: null,
  place2: null,
  place3: BuildingType.SETTLEMENT,
  place4: null,
  place5: BuildingType.SETTLEMENT,
  place6: null,
  place7: BuildingType.SETTLEMENT,
};

export const useBuildTrack = () => {
  const [buildingTrack, setBuildingTrack] = useState<BuildingTrack>(
    INITIAL_BUILDING_TRACK
  );

  const moveAllBuildingsToLeft = () => {
    const newBuildingTrack: BuildingTrack = { ...buildingTrack };
    Object.keys(newBuildingTrack).forEach((key, index) => {
      if (index < Object.keys(newBuildingTrack).length - 1) {
        newBuildingTrack[key as keyof typeof newBuildingTrack] =
          newBuildingTrack[
            Object.keys(newBuildingTrack)[
              index + 1
            ] as keyof typeof newBuildingTrack
          ];
      } else {
        newBuildingTrack[key as keyof typeof newBuildingTrack] = null;
      }
    });
    setBuildingTrack(newBuildingTrack);
  };

  const addBuilding = (building: BuildingType) => {
    const firstEmptyPlace = Object.keys(buildingTrack).find(
      (key) => buildingTrack[key as keyof typeof buildingTrack] === null
    );

    const newBuildingTrack = { ...buildingTrack };
    if (firstEmptyPlace) {
      newBuildingTrack[firstEmptyPlace as keyof typeof buildingTrack] =
        building;
    }
    setBuildingTrack(newBuildingTrack);

    return newBuildingTrack;
  };

  return {
    buildingTrack,
    setBuildingTrack,
    moveAllBuildingsToLeft,
    addBuilding,
  };
};
