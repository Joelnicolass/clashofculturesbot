import {
  Castle,
  House,
  Pyramid,
  Sailboat,
  School,
  Store,
  Telescope,
} from "lucide-react";
import {
  BuildingType,
  HappinessType,
  IBOActions,
  ResourceType,
  UnitType,
} from "./enums";

export const IMAGE_RESOURCES = {
  [ResourceType.FOOD]: "/icon_food.png",
  [ResourceType.WOOD]: "/icon_wood.png",
  [ResourceType.STONE]: "/icon_stone.png",
  [ResourceType.SCIENCE]: "/icon_science.png",
  [ResourceType.GOLD]: "/icon_gold.png",
};

export const HAPPINESS_STAUS_COLORS = {
  [HappinessType.HAPPY]: "text-green-500",
  [HappinessType.NEUTRAL]: "text-yellow-500",
  [HappinessType.ANGRY]: "text-red-500",
};

export const ICONS_BUILDINGS = {
  [BuildingType.ACADEMY]: <School className="w-4 h-4 text-blue-400" />,
  [BuildingType.FORTRESS]: <Castle className="w-4 h-4 text-red-400" />,
  [BuildingType.MARKET]: <Store className="w-4 h-4 text-yellow-400" />,
  [BuildingType.OBELISK]: <Pyramid className="w-4 h-4 text-orange-400" />,
  [BuildingType.PORT]: <Sailboat className="w-4 h-4 text-blue-500" />,
  [BuildingType.TEMPLE]: <House className="w-4 h-4 text-purple-400" />,
  [BuildingType.OBSERVATORY]: <Telescope className="w-4 h-4 text-cyan-400" />,
  [BuildingType.SETTLEMENT]: <House className="w-4 h-4 text-green-400" />,
};

export const DEFAUlT_ACTION_RATES: Record<IBOActions, number> = {
  [IBOActions.ADVANCE]: 0.5,
  [IBOActions.ATACK]: 0.1,
  [IBOActions.BUILD]: 0.2,
  [IBOActions.INFLUENCE]: 0.1,
  [IBOActions.RECRUIT]: 0.1,
};

export const DEFAULT_RECRUIT_RATES: Record<
  Exclude<UnitType, UnitType.SHIP>,
  number
> = {
  [UnitType.INFANTRY]: 0.7,
  [UnitType.CAVALRY]: 0.2,
  [UnitType.ELEPHANT]: 0.5,
  [UnitType.LEADER]: 0.5,
};
