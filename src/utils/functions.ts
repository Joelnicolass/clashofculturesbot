import { HappinessType } from "./enums";

const happinessOrder: HappinessType[] = [
  HappinessType.ANGRY,
  HappinessType.NEUTRAL,
  HappinessType.HAPPY,
];

export const increaseHappiness = (current: HappinessType): HappinessType => {
  const index = happinessOrder.indexOf(current);
  const nextIndex = Math.min(index + 1, happinessOrder.length - 1);
  return happinessOrder[nextIndex];
};

export const decreaseHappiness = (current: HappinessType): HappinessType => {
  const index = happinessOrder.indexOf(current);
  const prevIndex = Math.max(index - 1, 0);
  return happinessOrder[prevIndex];
};

export const isEmpty = (obj: object) => {
  return (
    Object.keys(obj).length === 0 ||
    Object.values(obj).every((arr) => arr.length === 0)
  );
};

export const numberToText = (num: number): string => {
  const units = [
    "",
    "uno",
    "dos",
    "tres",
    "cuatro",
    "cinco",
    "seis",
    "siete",
    "ocho",
    "nueve",
  ];
  const tens = [
    "",
    "diez",
    "veinte",
    "treinta",
    "cuarenta",
    "cincuenta",
    "sesenta",
    "setenta",
    "ochenta",
    "noventa",
  ];
  const teens = [
    "diez",
    "once",
    "doce",
    "trece",
    "catorce",
    "quince",
    "dieciséis",
    "diecisiete",
    "dieciocho",
    "diecinueve",
  ];
  const hundreds = [
    "",
    "cien",
    "doscientos",
    "trescientos",
    "cuatrocientos",
    "quinientos",
    "seiscientos",
    "setecientos",
    "ochocientos",
    "novecientos",
  ];
  if (num < 10) return units[num];
  if (num < 20) return teens[num - 10];
  if (num < 100) {
    const unit = num % 10;
    const ten = Math.floor(num / 10);
    return `${tens[ten]}${unit ? ` y ${units[unit]}` : ""}`;
  }
  if (num < 1000) {
    const unit = num % 10;
    const ten = Math.floor((num % 100) / 10);
    const hundred = Math.floor(num / 100);
    return `${hundreds[hundred]}${ten ? ` ${tens[ten]}` : ""}${
      unit ? ` y ${units[unit]}` : ""
    }`;
  }
  return num.toString();
};

/**
 * Selecciona una clave de un objeto de tasas basado en una distribución ponderada.
 */
export function selectWeightedRandom<K extends string>(
  rates: Record<K, number>
): K {
  const entries = Object.entries(rates) as [K, number][];
  const total = entries.reduce((sum, [, r]) => sum + r, 0);
  const rnd = Math.random() * total;
  let acc = 0;
  for (const [key, rate] of entries) {
    acc += rate;
    if (rnd < acc) {
      return key;
    }
  }
  return entries[0][0];
}
