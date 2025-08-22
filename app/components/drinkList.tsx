import { useState } from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Drink } from "~/lib/schema";
import type { co } from "jazz-tools";
import { DrinkItem } from "./DrinkItem";

export function DrinkList({ drinks }: { drinks: co.loaded<typeof Drink>[] }) {
  const [page, setPage] = useState(1);
  return (
    <Card>
      <CardHeader>
        <CardTitle>Drink List</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Flexbox container for the entire list */}
        <div className="flex flex-col">
          {/* Header Row */}
          <div className="flex items-center border-b p-2 font-semibold text-sm">
            <div className="flex-1 min-w-0">Drink</div>
            <div className="w-[120px]">BAC Added</div>
            <div className="w-[150px]">Time</div>
            <div className="w-[80px] text-center">Remove</div>
          </div>

          {/* List Body */}
          <div>
            {drinks && drinks.length > 0 ? (
              drinks
                .slice(10 * (page - 1), 10 * (page - 1) + 10)
                .map((drink) => {
                  if (!drink) {
                    return null;
                  }
                  // Assuming DrinkItem will be refactored to be a flex row div
                  return <DrinkItem key={drink.id} drink={drink} />;
                })
            ) : (
              <p className="text-muted-foreground mt-4 text-center text-sm">
                A list of your recent drinks will appear here.
              </p>
            )}
          </div>
        </div>

        {/* Pagination Controls */}
        {drinks && drinks.length > 10 && (
          <div className="flex items-center justify-center space-x-4 py-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(page - 1)}
              disabled={page <= 1}
            >
              Previous
            </Button>
            <div className="text-sm font-medium">
              Page {page} of {Math.ceil(drinks.length / 10)}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(page + 1)}
              disabled={page >= Math.ceil(drinks.length / 10)}
            >
              Next
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
