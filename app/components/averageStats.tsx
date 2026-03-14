import { Drink } from "~/lib/schema";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import type { co } from "jazz-tools";
import { useMemo } from "react";
dayjs.extend(relativeTime);

const WEEKLY_UNIT_TARGET = 14;

export function AverageStats({ drinks }: { drinks: co.loaded<typeof Drink>[] }) {
  const calculateAverageDailyUnits = () => {
    if (!drinks || drinks.length === 0) return 0;
    const earliestDrink = drinks[drinks.length - 1];
    if (!earliestDrink?.date) return 0;
    const totalDays = Math.max(
      dayjs().endOf("day").diff(dayjs(earliestDrink.date).startOf("day"), "days") + 1,
      1,
    );
    const totalMlAlcohol = drinks.reduce((acc, curr) => {
      return acc + (curr?.volume || 0) * (curr?.percent || 0);
    }, 0);
    return parseFloat((totalMlAlcohol / 10 / totalDays).toFixed(2));
  };

  const calculateExcessiveWeeks = () => {
    if (!drinks || drinks.length === 0) return 0;
    const earliestDrinkData = drinks[drinks.length - 1];
    if (!earliestDrinkData?.date) return 0;
    let excessiveWeeksCount = 0;
    let currentPeriodStart = dayjs(earliestDrinkData.date).startOf("day");
    while (currentPeriodStart.isBefore(dayjs().startOf("day").add(1, "day"))) {
      const currentPeriodEnd = currentPeriodStart.add(7, "days");
      const drinksInPeriod = drinks.filter((drink) => {
        if (!drink?.date) return false;
        const d = dayjs(drink.date);
        return !d.isBefore(currentPeriodStart) && d.isBefore(currentPeriodEnd);
      });
      const unitsInPeriod = drinksInPeriod.reduce(
        (acc, curr) => acc + ((curr?.volume || 0) * (curr?.percent || 0)) / 10,
        0,
      );
      if (unitsInPeriod > WEEKLY_UNIT_TARGET) excessiveWeeksCount++;
      currentPeriodStart = currentPeriodStart.add(7, "days");
    }
    return excessiveWeeksCount;
  };

  const calculateExcessiveDays = () => {
    if (!drinks || drinks.length === 0) return 0;
    const dailyTargetExcess = WEEKLY_UNIT_TARGET / 3;
    const drinksByDay: { [key: string]: co.loaded<typeof Drink>[] } = {};
    drinks.forEach((drink) => {
      if (!drink?.date) return;
      const dayKey = dayjs(drink.date).startOf("day").toISOString();
      if (!drinksByDay[dayKey]) drinksByDay[dayKey] = [];
      drinksByDay[dayKey].push(drink);
    });
    return Object.values(drinksByDay).filter(
      (drinksOnDay) =>
        drinksOnDay.reduce(
          (acc, curr) => acc + ((curr?.volume || 0) * (curr?.percent || 0)) / 10,
          0,
        ) > dailyTargetExcess,
    ).length;
  };

  const excessiveWeeks = useMemo(() => calculateExcessiveWeeks(), [drinks]);
  const excessiveDays = useMemo(() => calculateExcessiveDays(), [drinks]);
  const averageDailyUnits = useMemo(() => calculateAverageDailyUnits(), [drinks]);
  const averageWeeklyUnits = useMemo(() => averageDailyUnits * 7, [averageDailyUnits]);

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-xl">Drinking Patterns</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="grid grid-cols-2 divide-x divide-y divide-border">
          <div className="stat-block">
            <span className="stat-label">Avg daily units</span>
            <p className="stat-value">{averageDailyUnits.toFixed(2)}</p>
          </div>
          <div className="stat-block">
            <span className="stat-label">Avg weekly units</span>
            <p className="stat-value">{averageWeeklyUnits.toFixed(2)}</p>
          </div>
          <div className="stat-block">
            <span className="stat-label">Excess weeks</span>
            <p className="stat-value">{excessiveWeeks}</p>
          </div>
          <div className="stat-block">
            <span className="stat-label">Excess days</span>
            <p className="stat-value">{excessiveDays}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
