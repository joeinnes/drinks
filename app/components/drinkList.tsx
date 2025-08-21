import { useState } from "react";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCaption,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
        <Table className="table-fixed">
          <TableCaption>A list of your recent drinks.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-1/2">Drink</TableHead>
              <TableHead className="w-[120px]">BAC Added</TableHead>
              <TableHead className="w-[150px]">Time</TableHead>
              <TableHead className="w-[80px] text-center">Remove</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {drinks &&
              drinks
                .slice(10 * (page - 1), 10 * (page - 1) + 10)
                .map((drink) => {
                  if (!drink) {
                    return null;
                  }
                  return <DrinkItem drink={drink} />;
                })}
          </TableBody>
        </Table>
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
      </CardContent>
    </Card>
  );
}
