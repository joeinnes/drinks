import { useAccount } from "jazz-tools/react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DrinksAccount } from "~/lib/schema";

export function AcceptTerms() {
  const { me } = useAccount(DrinksAccount);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Warning</CardTitle>
      </CardHeader>
      <CardContent>
        <p>
          This app uses some calculations to guess approximately what your blood
          alcohol content is based on what you have had to drink and when.
        </p>
        <ul className="list-disc list-inside">
          <li>
            <span>
              You <strong>MUST NOT</strong> use this app to estimate when you
              may be below a drink-driving limit, or safe to operate heavy
              machinery, etc.
            </span>
          </li>
          <li>
            <span>
              This app <strong>MUST NOT</strong> be used for any purpose other
              than out of personal curiosity. The numbers it creates are at best
              guesses.
            </span>
          </li>
          <li>
            <span>
              You <strong>MUST NOT</strong> rely on this app for making
              decisions.
            </span>
          </li>

          <p>
            This app is available as-is, with no warranty express or implied.
            You must not rely on this app to inform decisions.
          </p>
        </ul>
      </CardContent>
      <CardFooter className="flex justify-center">
        <Button
          onClick={() => {
            if (me && me.root) me.root.hasAcceptedTerms = true;
          }}
        >
          I understand and agree
        </Button>
      </CardFooter>
    </Card>
  );
}
