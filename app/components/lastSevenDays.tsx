import { DrinksAccount, type Drink } from "~/lib/schema";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { useAccount } from "jazz-tools/react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import type { co } from "jazz-tools";
dayjs.extend(relativeTime);

export function LastSevenDays({
  drinks,
}: {
  drinks: co.loaded<typeof Drink>[];
}) {
  const filteredDrinks = drinks
    .filter(
      (el) =>
        !!el &&
        dayjs(el.date).isAfter(dayjs().endOf("day").subtract(7, "days")),
    )
    .sort((a, b) => (a && b ? b.date.getTime() - a.date.getTime() : 0));

  let numberOfDrinks = filteredDrinks.length;
  let unitsConsumed = filteredDrinks.reduce((acc: number, drink) => {
    if (!drink) return acc;
    return acc + (drink.volume * drink.percent) / 10;
  }, 0);
  let daysDrinking = filteredDrinks.reduce((acc: string[], drink) => {
    if (!drink) return acc;
    const date = dayjs(drink.date);
    const day = date.format("YYYY-MM-DD");
    if (!acc.includes(day)) {
      acc.push(day);
    }
    return acc;
  }, []).length;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Last 7 Days</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-2 text-center pt-2">
          <div className="flex flex-col justify-between">
            <h3 className="text-xs">Number Of Drinks</h3>
            <p className="font-black text-2xl">{numberOfDrinks}</p>
          </div>

          <div className="flex flex-col justify-between">
            <h3 className="text-xs">Units Consumed</h3>
            <p className="font-black text-2xl">{unitsConsumed.toFixed(2)}</p>
          </div>

          <div className="flex flex-col justify-between">
            <h3 className="text-xs">Days Drinking</h3>
            <p className="font-black text-2xl">{daysDrinking}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
