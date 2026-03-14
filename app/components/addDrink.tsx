import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { getBacAddition } from "@/lib/utils/getBacAddition";
import { AddCustomDrink } from "@/components/addCustomDrink";

import { Beer, Martini, Wine } from "lucide-react";
import { Drink, DrinksAccount } from "@/lib/schema";
import { DECAY_RATE } from "~/lib/utils";
import type { co } from "jazz-tools";
import { cn } from "~/lib/utils";

export function AddDrink({
  currentBac,
  me,
}: {
  currentBac: number;
  me: co.loaded<
    typeof DrinksAccount,
    {
      root: {
        myDrinks: {
          $each: true;
        };
      };
    }
  >;
}) {
  const bac = currentBac;
  const target = me.root.myTarget;
  const gender = me.root.myGender;
  const weight = me.root.myWeight;

  const addDrink = (name: string, volume: number, percent: number, time?: Date) => {
    const bacAddition = getBacAddition(volume * percent, weight, gender);
    const newDrink = Drink.create({
      name,
      volume,
      date: time || new Date(),
      percent,
      isDeleted: false,
      bacAddition,
    });
    me.root.myDrinks.$jazz.unshift(newDrink);
  };

  const buttons = [
    { label: "Small Beer", volume: 330, percent: 0.045, icon: Beer },
    { label: "Large Beer", volume: 500, percent: 0.045, icon: Beer },
    { label: "Red Wine", volume: 150, percent: 0.14, icon: Wine },
    { label: "White Wine", volume: 150, percent: 0.12, icon: Wine },
    { label: "Shot", volume: 40, percent: 0.375, icon: Martini },
  ];

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-xl">Add a Drink</CardTitle>
      </CardHeader>
      <CardContent className="px-3 pb-4">
        <div className="grid grid-cols-3 gap-2">
          {buttons.map((button, i) => {
            const addition = getBacAddition(button.volume * button.percent, weight, gender);
            const newBac = bac + addition;
            const timeToZero = newBac / DECAY_RATE;
            const timeToTarget = Math.max((newBac - target) / DECAY_RATE, 0);
            const overTarget = bac > target;
            const wouldExceed = addition + bac > target;

            return (
              <button
                key={i}
                onClick={() => addDrink(button.label, button.volume, button.percent)}
                className={cn(
                  "drink-card",
                  overTarget && "danger",
                  !overTarget && wouldExceed && "warning",
                )}
              >
                <button.icon
                  className={cn(
                    "size-5",
                    overTarget ? "text-destructive" : "text-primary",
                  )}
                />
                <span className="font-display text-sm font-semibold text-foreground leading-tight">
                  {button.label}
                </span>
                <span className="font-nums text-xs text-primary tabular-nums">
                  {newBac.toFixed(4)}
                </span>
                <div className="flex gap-1 items-center font-nums text-[0.6rem] text-muted-foreground">
                  <span>
                    ↓{Math.floor(timeToTarget)}h
                    {Math.round((timeToTarget - Math.floor(timeToTarget)) * 60)}m
                  </span>
                  <span className="opacity-40">·</span>
                  <span>
                    ∅{Math.floor(timeToZero)}h
                    {Math.round((timeToZero - Math.floor(timeToZero)) * 60)}m
                  </span>
                </div>
              </button>
            );
          })}

          <AddCustomDrink addDrink={addDrink} bac={bac} />
        </div>
      </CardContent>
    </Card>
  );
}
