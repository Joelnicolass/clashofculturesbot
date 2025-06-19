import { BuildingType } from "./enums";

export type BuildingTrack = {
  [key: string]: BuildingType | null;
};
