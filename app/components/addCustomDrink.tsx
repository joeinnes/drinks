import { useState } from "react";
import { useAccount } from "jazz-tools/react";

import dayjs from "dayjs";

import { Button } from "@/components/ui/button";
import { GlassWater } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { getBacAddition } from "@/lib/utils/getBacAddition";

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { DECAY_RATE } from "~/lib/utils";
import { DrinksAccount } from "~/lib/schema";

export function AddCustomDrink({
  addDrink,
  bac,
}: {
  addDrink: (name: string, volume: number, percent: number, time: Date) => void;
  bac: number;
}) {
  const { me } = useAccount(DrinksAccount);
  const [customName, setCustomName] = useState("Spirit shot");
  const [customVolume, setCustomVolume] = useState(40);
  const [customPercent, setCustomPercent] = useState(37.5);
  const [customTime, setCustomTime] = useState(new Date());
  const target = me?.root?.myTarget || 0.05;
  const weight = me?.root?.myWeight || 80000;
  const gender = me?.root?.myGender || "male";
  const newBac =
    bac + getBacAddition((customVolume * customPercent) / 100, weight, gender);
  const timeToZero = newBac / DECAY_RATE;
  const timeToTarget = Math.max(
    (newBac - (me?.root?.myTarget || 0.05)) / DECAY_RATE,
    0,
  );
  return (
    <Drawer
      onOpenChange={() => setCustomTime(new Date())}
      repositionInputs={false}
    >
      <DrawerTrigger asChild>
        <Button
          variant={
            bac > target
              ? "destructive"
              : getBacAddition(
                    (customVolume * customPercent) / 100,
                    weight,
                    gender,
                  ) +
                    bac >
                  target
                ? "secondary"
                : undefined
          }
          className="flex w-full"
        >
          <GlassWater className="size-4" />
          <span className="flex-1">Custom</span>
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Add a custom drink</DrawerTitle>
          <DrawerDescription>Add details of your drink.</DrawerDescription>
        </DrawerHeader>
        <div className="px-4">
          <div className="pb-2">
            <Label htmlFor="name">Drink Name</Label>
            <Input
              name="name"
              id="name"
              className="w-full"
              value={customName}
              onChange={(e) => {
                e.preventDefault();
                setCustomName(e.target.value);
              }}
              required
            />
          </div>
          <div className="pb-2">
            <Label htmlFor="volume">Volume in ml</Label>
            <Input
              name="volume"
              id="volume"
              type="number"
              className="w-full"
              value={customVolume}
              onChange={(e) => {
                e.preventDefault();
                setCustomVolume(parseInt(e.target.value));
              }}
              required
            />
          </div>
          <div className="pb-2">
            <Label htmlFor="percent">Percentage</Label>
            <Input
              name="percent"
              id="percent"
              type="number"
              className="w-full"
              value={customPercent}
              onChange={(e) => {
                e.preventDefault();
                setCustomPercent(parseFloat(e.target.value));
              }}
              required
            />
          </div>
          <div className="pb-2">
            <Label htmlFor="time">Time</Label>
            <Input
              name="time"
              id="time"
              type="datetime-local"
              className="w-full"
              value={dayjs().format("YYYY-MM-DDTHH:mm")}
              onChange={(e) => {
                e.preventDefault();
                setCustomTime(new Date(e.target.value));
              }}
              required
            />
          </div>
        </div>
        <div className="px-4">
          <DrawerTitle>After this drink</DrawerTitle>
        </div>
        <div className="grid grid-cols-3 gap-2 text-center pt-2">
          <div>
            <h3 className="text-sm">BAC</h3>
            <p className="font-black text-2xl">
              {isNaN(newBac) ? "0" : newBac.toFixed(4)}
            </p>
          </div>
          <div>
            <h3 className="text-sm">Time To Zero</h3>
            <p className="font-black text-2xl">
              {isNaN(timeToZero) ? (
                "0h0m"
              ) : (
                <>
                  {Math.floor(timeToZero)}h
                  {Math.round((timeToZero - Math.floor(timeToZero)) * 60)}m
                </>
              )}
            </p>
            <small>
              {timeToZero
                ? dayjs().add(timeToZero, "hours").format("h:mm a")
                : ""}
            </small>
          </div>
          <div>
            <h3 className="text-sm">Time To Target</h3>
            <p className="font-black text-2xl">
              {isNaN(timeToTarget) ? (
                "0h0m"
              ) : (
                <>
                  {Math.floor(timeToTarget)}h
                  {Math.round((timeToTarget - Math.floor(timeToTarget)) * 60)}m
                </>
              )}
            </p>
            <small>
              {timeToTarget
                ? dayjs().add(timeToTarget, "hours").format("h:mm a")
                : ""}
            </small>
          </div>
        </div>
        <DrawerFooter>
          <div className="grid grid-cols-2 gap-2">
            <DrawerClose asChild>
              <Button
                variant="outline"
                onClick={() => {
                  setCustomName("Spirit shot");
                  setCustomVolume(40);
                  setCustomPercent(37.5);
                }}
              >
                Cancel
              </Button>
            </DrawerClose>
            <DrawerClose asChild>
              <Button
                onClick={() => {
                  addDrink(
                    customName,
                    customVolume,
                    customPercent / 100,
                    customTime,
                  );
                  setCustomName("Spirit shot");
                  setCustomVolume(40);
                  setCustomPercent(37.5);
                }}
              >
                Save
              </Button>
            </DrawerClose>
          </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
