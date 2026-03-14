import { useState } from "react";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Drink } from "~/lib/schema";
import type { co } from "jazz-tools";
import { DrinkItem } from "./DrinkItem";

export function DrinkList({ drinks }: { drinks: co.loaded<typeof Drink>[] }) {
  const [page, setPage] = useState(1);
  const totalPages = Math.max(Math.ceil(drinks.length / 10), 1);

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-xl">Drink Log</CardTitle>
      </CardHeader>
      <CardContent className="px-2 pb-3">
        <Table>
          <TableHeader>
            <TableRow className="border-border">
              <TableHead className="font-nums text-[0.65rem] tracking-widest uppercase text-muted-foreground">
                Drink
              </TableHead>
              <TableHead className="hidden md:table-cell font-nums text-[0.65rem] tracking-widest uppercase text-muted-foreground">
                BAC +
              </TableHead>
              <TableHead className="font-nums text-[0.65rem] tracking-widest uppercase text-muted-foreground">
                BAC
              </TableHead>
              <TableHead className="font-nums text-[0.65rem] tracking-widest uppercase text-muted-foreground">
                Time
              </TableHead>
              <TableHead className="text-center font-nums text-[0.65rem] tracking-widest uppercase text-muted-foreground">
                Del
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {drinks.slice(10 * (page - 1), 10 * (page - 1) + 10).map((drink) => {
              if (!drink) return null;
              return <DrinkItem key={drink.$jazz.id} drink={drink} />;
            })}
          </TableBody>
        </Table>

        <div className="flex items-center justify-center gap-4 pt-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(page - 1)}
            disabled={page <= 1}
            className="font-nums text-xs"
          >
            ← Prev
          </Button>
          <span className="font-nums text-xs text-muted-foreground tabular-nums">
            {page} / {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(page + 1)}
            disabled={page >= totalPages}
            className="font-nums text-xs"
          >
            Next →
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
