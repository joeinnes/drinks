import { useAccount } from "jazz-tools/react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

import { stateInWords } from "~/lib/utils/getStateInWords";

import { Card, CardContent } from "@/components/ui/card";
import { DECAY_RATE } from "~/lib/utils";
import { Drink } from "~/lib/schema";
import type { co } from "jazz-tools";

export function CurrentState({
  currentBac,
  lastDrink,
  target = 0.05,
}: {
  currentBac: number;
  lastDrink: co.loaded<typeof Drink> | undefined;
  target?: number;
}) {
  const timeToZero = currentBac / DECAY_RATE;
  const timeToTarget = Math.max((currentBac - target) / DECAY_RATE, 0);
  return (
    <Card>
      <CardContent>
        {lastDrink ? (
          <p>Your last drink was {dayjs().to(lastDrink.date)}.</p>
        ) : (
          <p>No drinks recorded.</p>
        )}

        <div className="grid grid-cols-3 gap-2 text-center pt-2">
          <div>
            <h3 className="text-sm">Current BAC</h3>
            <p className="font-black text-2xl">{currentBac.toFixed(4)}</p>
            <small>{stateInWords(currentBac)}</small>
          </div>
          <div>
            <h3 className="text-sm">Time to Zero</h3>
            <p className="font-black text-2xl">
              {Math.floor(timeToZero)}h
              {Math.round((timeToZero - Math.floor(timeToZero)) * 60)}m
            </p>
            <small>
              {timeToZero
                ? dayjs().add(timeToZero, "hours").format("h:mm a")
                : ""}
            </small>
          </div>
          <div>
            <h3 className="text-sm">Time to Target</h3>
            <p className="font-black text-2xl">
              {Math.floor(timeToTarget)}h
              {Math.round((timeToTarget - Math.floor(timeToTarget)) * 60)}m
            </p>
            <small>
              {timeToTarget
                ? dayjs().add(timeToTarget, "hours").format("h:mm a")
                : ""}
            </small>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
