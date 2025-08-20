import { useState } from "react";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

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
      </CardContent>
    </Card>
  );
}
