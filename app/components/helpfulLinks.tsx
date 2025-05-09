import { CarTaxiFront } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export function HelpfulLinks() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Helpful Links</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col gap-2">
          <p>Don't drink and drive. Call a taxi.</p>

          <Button asChild>
            <a
              href="https://www.google.com/search?q=taxis+near+me"
              target="_blank"
            >
              <CarTaxiFront className="mr-2" />
              Taxi Companies
            </a>
          </Button>
        </div>

        <div className="flex flex-col gap-2">
          <p>Worried about your alcohol use?</p>
          <Button asChild>
            <a
              href="https://www.smartrecoveryinternational.org/"
              target="_blank"
            >
              Smart Recovery International
            </a>
          </Button>
          <Button asChild>
            <a
              href="https://www.google.com/search?q=help+with+alcohol+addiction"
              target="_blank"
            >
              Help with alcohol addiction
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
