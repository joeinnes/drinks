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

  const formatTime = (hours: number) =>
    `${Math.floor(hours)}h\u202f${Math.round((hours - Math.floor(hours)) * 60)}m`;

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        {/* BAC centrepiece */}
        <div className="flex flex-col items-center py-4 px-6 gap-1">
          <p className="stat-label">
            {lastDrink ? `Last drink ${dayjs().to(lastDrink.date)}` : "No drinks recorded"}
          </p>

          <div className="flex flex-col items-center gap-0.5 py-1">
            <span className="stat-label">Current BAC</span>
            <p className="font-nums text-5xl text-primary bac-glow leading-none tabular-nums">
              {currentBac.toFixed(4)}
            </p>
            <span className="font-display text-base italic text-muted-foreground">
              {stateInWords(currentBac)}
            </span>
          </div>
        </div>

        {/* Time stats */}
        <div className="grid grid-cols-2 border-t border-border">
          <div className="stat-block py-2 border-r border-border">
            <span className="stat-label">Time to zero</span>
            <p className="stat-value text-xl">{formatTime(timeToZero)}</p>
            <span className="stat-sub">
              {timeToZero ? dayjs().add(timeToZero, "hours").format("h:mm a") : "—"}
            </span>
          </div>
          <div className="stat-block py-2">
            <span className="stat-label">Time to target</span>
            <p className="stat-value text-xl">{formatTime(timeToTarget)}</p>
            <span className="stat-sub">
              {timeToTarget ? dayjs().add(timeToTarget, "hours").format("h:mm a") : "—"}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
