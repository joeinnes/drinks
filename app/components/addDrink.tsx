import { useAccount } from "jazz-tools/react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { getBacAddition } from "@/lib/utils/getBacAddition";

import { AddCustomDrink } from "@/components/addCustomDrink";

import { Beer, Martini, Wine } from "lucide-react";
import { Drink, DrinksAccount } from "@/lib/schema";
import { DECAY_RATE } from "~/lib/utils";

export function AddDrink({ currentBac }: { currentBac: number }) {
  const { me } = useAccount(DrinksAccount);
  const bac = currentBac;
  const target = me.root?.myTarget || 0.05;
  const gender = me.root?.myGender || "male";
  const weight = me.root?.myWeight || 85000;
  const addDrink = (
    name: string,
    volume: number,
    percent: number,
    time?: Date
  ) => {
    const bacAddition = getBacAddition(volume * percent, weight, gender);
    const newDrink = Drink.create({
      name,
      volume,
      date: time || new Date(),
      percent,
      isDeleted: false,
      bacAddition,
    });
    me.root?.myDrinks?.unshift(newDrink);
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
      <CardHeader>
        <CardTitle>Add Drink</CardTitle>
      </CardHeader>
      <CardContent className="px-2">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Drink</TableHead>
              <TableHead>BAC</TableHead>
              <TableHead>To Target</TableHead>
              <TableHead>To Zero</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {buttons.map((button, i) => {
              const newBac =
                bac +
                getBacAddition(button.volume * button.percent, weight, gender);
              const timeToZero = newBac / DECAY_RATE;
              const timeToTarget = Math.max(
                (newBac - (me?.root?.myTarget || 0.05)) / DECAY_RATE,
                0
              );
              return (
                <TableRow key={i} className="border-0">
                  <TableCell className="px-0">
                    <Button
                      key={button.label}
                      variant={
                        bac > target
                          ? "destructive"
                          : getBacAddition(
                            button.volume * button.percent,
                            weight,
                            gender
                          ) +
                            bac >
                            target
                            ? "secondary"
                            : undefined
                      }
                      onClick={() =>
                        addDrink(button.label, button.volume, button.percent)
                      }
                      className="flex w-full"
                    >
                      <button.icon className="size-4" />
                      <span className="flex-1">{button.label}</span>
                    </Button>
                  </TableCell>
                  <TableCell>{newBac.toFixed(4)}</TableCell>
                  <TableCell>
                    {isNaN(timeToTarget) ? (
                      "0h0m"
                    ) : (
                      <>
                        {Math.floor(timeToTarget)}h
                        {Math.round(
                          (timeToTarget - Math.floor(timeToTarget)) * 60
                        )}
                        m
                      </>
                    )}
                  </TableCell>
                  <TableCell>
                    {isNaN(timeToZero) ? (
                      "0h0m"
                    ) : (
                      <>
                        {Math.floor(timeToZero)}h
                        {Math.round((timeToZero - Math.floor(timeToZero)) * 60)}
                        m
                      </>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}

            <TableRow>
              <TableCell className="px-0">
                <AddCustomDrink addDrink={addDrink} bac={bac} />
              </TableCell>
              <TableCell></TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
