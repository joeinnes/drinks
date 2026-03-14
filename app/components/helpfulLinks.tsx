import { CarTaxiFront, HeartHandshake } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export function HelpfulLinks() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-xl">Helpful Links</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <a
          href="https://www.google.com/search?q=taxis+near+me"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-3 p-3 rounded border border-border bg-muted hover:border-primary/40 hover:bg-accent transition-colors group"
        >
          <CarTaxiFront className="size-4 text-muted-foreground group-hover:text-primary shrink-0 transition-colors" />
          <div>
            <p className="font-display text-sm font-semibold text-foreground">Find a Taxi</p>
            <p className="font-nums text-[0.65rem] text-muted-foreground">
              Don't drink and drive. Call a taxi.
            </p>
          </div>
        </a>

        <a
          href="https://www.smartrecoveryinternational.org/"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-3 p-3 rounded border border-border bg-muted hover:border-primary/40 hover:bg-accent transition-colors group"
        >
          <HeartHandshake className="size-4 text-muted-foreground group-hover:text-primary shrink-0 transition-colors" />
          <div>
            <p className="font-display text-sm font-semibold text-foreground">
              Smart Recovery International
            </p>
            <p className="font-nums text-[0.65rem] text-muted-foreground">
              Worried about your alcohol use?
            </p>
          </div>
        </a>
      </CardContent>
    </Card>
  );
}
