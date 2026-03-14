import { type Drink } from "~/lib/schema";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import type { co } from "jazz-tools";
dayjs.extend(relativeTime);

export function LastSevenDays({ drinks }: { drinks: co.loaded<typeof Drink>[] }) {
  const filteredDrinks = drinks
    .filter((el) => !!el && dayjs(el.date).isAfter(dayjs().endOf("day").subtract(7, "days")))
    .sort((a, b) => (a && b ? b.date.getTime() - a.date.getTime() : 0));

  const numberOfDrinks = filteredDrinks.length;
  const unitsConsumed = filteredDrinks.reduce((acc: number, drink) => {
    if (!drink) return acc;
    return acc + (drink.volume * drink.percent) / 10;
  }, 0);
  const daysDrinking = filteredDrinks.reduce((acc: string[], drink) => {
    if (!drink) return acc;
    const day = dayjs(drink.date).format("YYYY-MM-DD");
    if (!acc.includes(day)) acc.push(day);
    return acc;
  }, []).length;

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-xl">Last 7 Days</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="grid grid-cols-3 divide-x divide-border">
          <div className="stat-block">
            <span className="stat-label">Drinks</span>
            <p className="stat-value">{numberOfDrinks}</p>
          </div>
          <div className="stat-block">
            <span className="stat-label">Units</span>
            <p className="stat-value">{unitsConsumed.toFixed(1)}</p>
          </div>
          <div className="stat-block">
            <span className="stat-label whitespace-nowrap text-[0.55rem]">Days drinking</span>
            <p className="stat-value">{daysDrinking}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
