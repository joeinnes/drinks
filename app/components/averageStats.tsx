import { DrinksAccount, type Drink } from "~/lib/schema";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { useAccount } from "jazz-tools/react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import type { co } from "jazz-tools";
dayjs.extend(relativeTime);

const WEEKLY_UNIT_TARGET = 14;

export function AverageStats() {
  const { me } = useAccount(DrinksAccount, { resolve: { root: { myDrinks: true } } });
  const drinks = me?.root?.myDrinks || [];
  const filteredDrinks = drinks
    .filter((el) => !!el && !el.isDeleted)
    .sort((a, b) => (a && b ? b.date.getTime() - a.date.getTime() : 0));

  const calculateAverageDailyUnits = () => {
    if (!filteredDrinks || filteredDrinks.length === 0) {
      return 0;
    }

    // The array is sorted descending by date, so the last element is the earliest.
    const earliestDrink = filteredDrinks[filteredDrinks.length - 1];
    if (!earliestDrink?.date) return 0; // Guard against missing earliest drink or date

    const totalDays = Math.max(
      dayjs()
        .endOf("day")
        .diff(dayjs(earliestDrink.date).startOf("day"), "days") + 1,
      1
    );
    const totalMlAlcohol = filteredDrinks.reduce((acc, curr) => {
      return acc + (curr?.volume || 0) * (curr?.percent || 0);
    }, 0);
    const totalUnits = totalMlAlcohol / 10;
    const average = totalUnits / totalDays;
    return parseFloat(average.toFixed(2));
  };

  const averageDailyUnits = calculateAverageDailyUnits();
  const averageWeeklyUnits = averageDailyUnits * 7;

  const calculateExcessiveWeeks = () => {
    if (!filteredDrinks || filteredDrinks.length === 0) {
      return 0;
    }
    let excessiveWeeksCount = 0;
    // Ensure there's an earliest drink to start from
    if (filteredDrinks.length === 0) return 0;
    const earliestDrinkData = filteredDrinks[filteredDrinks.length - 1];
    if (!earliestDrinkData?.date) return 0; // Ensure date exists for the earliest drink
    const earliestDrinkDate = dayjs(earliestDrinkData.date);

    let currentPeriodStart = earliestDrinkDate.startOf("day");

    // Iterate through 7-day periods starting from the earliest drink's day
    // up to periods that could include today's drinks.
    while (currentPeriodStart.isBefore(dayjs().startOf("day").add(1, "day"))) {
      const currentPeriodEnd = currentPeriodStart.add(7, "days");
      const drinksInPeriod = filteredDrinks.filter((drink) => {
        if (!drink?.date) return false;
        const drinkDate = dayjs(drink.date);
        // Include drinks on or after currentPeriodStart and strictly before currentPeriodEnd
        return (
          !drinkDate.isBefore(currentPeriodStart) &&
          drinkDate.isBefore(currentPeriodEnd)
        );
      });

      const unitsInPeriod = drinksInPeriod.reduce((acc, curr) => {
        // Unit calculation: (volume_ml * (ABV/100)) / 10
        return acc + ((curr?.volume || 0) * (curr?.percent || 0)) / 10;
      }, 0);

      if (unitsInPeriod > WEEKLY_UNIT_TARGET) {
        excessiveWeeksCount++;
      }
      currentPeriodStart = currentPeriodStart.add(7, "days"); // Move to the next 7-day block
    }
    return excessiveWeeksCount;
  };

  const calculateExcessiveDays = () => {
    if (!filteredDrinks || filteredDrinks.length === 0) {
      return 0;
    }
    const dailyTargetExcess = WEEKLY_UNIT_TARGET / 3;
    let excessiveDaysCount = 0;

    // Group drinks by calendar day to count excessive days
    const drinksByDay: { [key: string]: co.loaded<typeof Drink>[] } = {};
    filteredDrinks.forEach((drink) => {
      if (!drink?.date) return; // Ensure drink and its date exist
      const dayKey = dayjs(drink.date).startOf("day").toISOString();
      if (!drinksByDay[dayKey]) {
        drinksByDay[dayKey] = [];
      }
      drinksByDay[dayKey].push(drink);
    });

    Object.values(drinksByDay).forEach((drinksOnDay) => {
      const unitsOnDay = drinksOnDay.reduce((acc, curr) => {
        return acc + ((curr?.volume || 0) * (curr?.percent || 0)) / 10;
      }, 0);
      if (unitsOnDay > dailyTargetExcess) {
        excessiveDaysCount++;
      }
    });

    return excessiveDaysCount;
  };

  const excessiveWeeks = calculateExcessiveWeeks();
  const excessiveDays = calculateExcessiveDays();

  return (
    <Card>
      <CardHeader>
        <CardTitle>How Much Have You Been Drinking?</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-4 gap-2 text-center pt-2">
          <div className="flex flex-col justify-between">
            <h3 className="text-xs">Average Daily Units</h3>
            <p className="font-black text-2xl">
              {averageDailyUnits.toFixed(2)}
            </p>
          </div>

          <div className="flex flex-col justify-between">
            <h3 className="text-xs">Average Weekly Units</h3>
            <p className="font-black text-2xl">
              {averageWeeklyUnits.toFixed(2)}
            </p>
          </div>

          <div className="flex flex-col justify-between">
            <h3 className="text-xs">Excess Weeks</h3>
            <p className="font-black text-2xl">{excessiveWeeks}</p>
          </div>

          <div className="flex flex-col justify-between">
            <h3 className="text-xs">Excess Days</h3>
            <p className="font-black text-2xl">{excessiveDays}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
