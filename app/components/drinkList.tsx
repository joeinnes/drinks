import { useState } from "react";
import { useAccount } from "jazz-tools/react";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

import { Delete } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCaption,
  TableHead,
  TableHeader,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DrinksAccount } from "~/lib/schema";

export function DrinkList() {
  const { me } = useAccount(DrinksAccount, {
    resolve: {
      root: {
        myDrinks: true,
      },
    }
  });
  if (me?.root?.myDrinks[0].date.getTime() < me?.root?.myDrinks[1].date.getTime()) {
    me?.root?.myDrinks.sort((a, b) => (a && b ? b.date.getTime() - a.date.getTime() : 0));
  }
  
  const sortedDrinks = me?.root?.myDrinks
    .filter((el) => !!el && !el.isDeleted)
  const [page, setPage] = useState(1);
  return (
    <Card>
      <CardHeader>
        <CardTitle>Drink List</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableCaption>A list of your recent drinks.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Drink</TableHead>
              <TableHead className="hidden md:table-cell">
                This Drink Added
              </TableHead>
              <TableHead>
                BAC
                <span className="hidden md:inline">&nbsp;After This Drink</span>
              </TableHead>
              <TableHead>Time</TableHead>
              <TableHead className="text-center">Remove</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedDrinks
              .slice((page - 1) * 10, (page - 1) * 10 + 10)
              .map((drink, i) => {
                if (!drink) {
                  return null;
                }
                return (
                  <TableRow key={i}>
                    <TableCell className="font-semibold">
                      <Dialog>
                        <DialogTrigger>{drink.name}</DialogTrigger>
                        <DialogContent className="max-w-[90dvw]">
                          <DialogHeader>
                            <DialogTitle>{drink.name}</DialogTitle>
                          </DialogHeader>
                          <div className="text-sm">
                            <strong>Date</strong>
                            <p className="opacity-70">
                              {dayjs(drink.date).format("DD MMM YYYY @ HH:mm")}
                            </p>

                            <strong>Volume</strong>
                            <p className="opacity-70">
                              {drink.volume}ml{" "}
                              {drink.percent === 1 &&
                                "(this drink was imported, and shows the quantity of pure alcohol, rather than the total volume of the drink)"}
                            </p>
                            <strong>Percent</strong>
                            <p className="opacity-70">{drink.percent * 100}%</p>

                            <strong>BAC Addition</strong>
                            <p className="opacity-70">
                              {drink.bacAddition.toFixed(4)}
                            </p>
                          </div>
                          <DialogFooter>
                            <DialogClose asChild>
                              <Button variant="outline" className="mb-2">
                                Close
                              </Button>
                            </DialogClose>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {drink.bacAddition.toFixed(4)}
                    </TableCell>
                    <TableCell>{drink.bacAddition.toFixed(4)}</TableCell>
                    <TableCell className="text-center md:text-start flex flex-col">
                      <p className="hidden md:inline">
                        {dayjs(drink.date).fromNow()}
                      </p>
                      <p className="inline md:hidden">
                        {dayjs(drink.date).format("HH:mm")}
                      </p>
                      <small>{dayjs(drink.date).format("DD MMM")}</small>
                    </TableCell>
                    <TableCell className="text-end">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="secondary" size="icon">
                            <Delete />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-[90dvw]">
                          <DialogHeader>
                            <DialogTitle>Are you sure?</DialogTitle>
                            <DialogDescription>
                              You are about to delete the only copy of this
                              data. There is no undo button, and no way to
                              recover this data if you proceed.
                            </DialogDescription>
                          </DialogHeader>
                          <DialogFooter>
                            <DialogClose asChild>
                              <Button
                                variant="destructive"
                                onClick={(e) => {
                                  const thisDrink = me?.root?.myDrinks?.find(
                                    (drinkFromList) => {
                                      return drink?.id === drinkFromList?.id;
                                    }
                                  );
                                  if (!thisDrink) return;
                                  thisDrink.isDeleted = true;
                                }}
                              >
                                Yes, I'm sure
                              </Button>
                            </DialogClose>
                            <DialogClose asChild>
                              <Button variant="outline" className="mb-2">
                                No, don't delete
                              </Button>
                            </DialogClose>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
