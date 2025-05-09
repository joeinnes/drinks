import dayjs from "dayjs";
import type { Drink, ListOfDrinks } from "../schema";
import { DECAY_RATE } from "../utils";
import type { co } from "jazz-tools";

export const getCurrentBac = (drinks: ListOfDrinks | null) => {
  if (!drinks) return 0;
  const drinksArrSorted = [...drinks]
    .sort((a, b) => (a && b ? a.date.getTime() - b.date.getTime() : 0))
    .filter((el) => el !== null && !el.isDeleted) as co<Drink>[]; // I can assert this because of the null check
  let currentBac = 0;
  if (drinksArrSorted.length === 0) {
    return 0;
  }
  let timeOfLastDrink = drinksArrSorted[0]?.date;
  for (const { date, bacAddition } of drinksArrSorted) {
    const hoursSinceLast = dayjs(date).diff(timeOfLastDrink, "hour", true);
    currentBac = Math.max(currentBac - DECAY_RATE * hoursSinceLast, 0);
    currentBac += bacAddition;
    timeOfLastDrink = date;
  }
  if (timeOfLastDrink) {
    const hoursSinceLastDrinkToNow = dayjs().diff(
      timeOfLastDrink,
      "hour",
      true
    );
    currentBac = Math.max(
      currentBac - DECAY_RATE * hoursSinceLastDrinkToNow,
      0
    );
  }
  return currentBac;
};
