import type { co } from "jazz-tools";
import type { Drink } from "~/lib/schema";
import { TableRow, TableCell } from "@/components/ui/table";
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
import { Button } from "./ui/button";
import dayjs from "dayjs";
import { Delete } from "lucide-react";
import React from "react";

export const DrinkItem = React.memo(
  ({ drink }: { drink: co.loaded<typeof Drink> }) => {
    return (
      <TableRow key={drink.id}>
        <TableCell className="w-1/2 font-semibold">
          <div className="truncate">
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
                  <p className="opacity-70">
                    {Number((drink.percent * 100).toFixed(2))}%
                  </p>

                  <strong>BAC Addition</strong>
                  <p className="opacity-70">{drink.bacAddition.toFixed(4)}</p>
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
          </div>
        </TableCell>
        <TableCell className="w-[120px]">
          {drink.bacAddition.toFixed(4)}
        </TableCell>
        <TableCell className="w-[150px] text-center md:text-start flex flex-col">
          <p className="hidden md:inline">{dayjs(drink.date).fromNow()}</p>
          <p className="inline md:hidden">
            {dayjs(drink.date).format("HH:mm")}
          </p>
          <small>{dayjs(drink.date).format("DD MMM")}</small>
        </TableCell>
        <TableCell className="w-[80px] text-end">
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
                  You are about to delete the only copy of this data. There is
                  no undo button, and no way to recover this data if you
                  proceed.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <DialogClose asChild>
                  <Button
                    variant="destructive"
                    onClick={(e) => {
                      drink.isDeleted = true;
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
  },
);
