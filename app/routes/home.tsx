import { useAccount } from "jazz-tools/react";

import { Header as OriginalHeader } from "../components/header";
import { AcceptTerms } from "../components/acceptTerms";
import { AddDrink } from "../components/addDrink";
import { AverageStats as OriginalAverageStats } from "~/components/averageStats";
import { CurrentState } from "../components/currentState";
import { Disclaimer as OriginalDisclaimer } from "~/components/disclaimer";
import { DrinkList as OriginalDrinkList } from "../components/drinkList";
import { HelpfulLinks as OriginalHelpfulLinks } from "../components/helpfulLinks";
import { LastSevenDays as OriginalLastSevenDays } from "~/components/lastSevenDays";
import { Settings as OriginalSettings } from "../components/settings";
import { appName, appDescription } from "@/lib/utils";
import { getCurrentBac } from "@/lib/utils/getCurrentBac";
import { useEffect, useState, memo } from "react";
import { DrinksAccount } from "~/lib/schema";

export function meta() {
  return [{ title: appName }, { name: "description", content: appDescription }];
}

// Memoise all the components that don't depend on the current BAC.
const Header = memo(OriginalHeader);
const DrinkList = memo(OriginalDrinkList);
const AverageStats = memo(OriginalAverageStats);
const LastSevenDays = memo(OriginalLastSevenDays);
const Settings = memo(OriginalSettings);
const HelpfulLinks = memo(OriginalHelpfulLinks);
const Disclaimer = memo(OriginalDisclaimer);

export default function Home() {
  const me = useAccount(DrinksAccount, {
    resolve: {
      root: {
        myDrinks: {
          $each: true,
        },
      },
    },
    select: (me) => (me.$isLoaded ? me : me.$jazz.loadingState === "loading" ? undefined : null),
  });

  const drinks = me?.$isLoaded ? me.root.myDrinks.filter((el) => !!el && !el.isDeleted) : undefined;
  const [currentBac, setCurrentBac] = useState(0);
  useEffect(() => {
    const myDrinks = me?.$isLoaded ? me.root.myDrinks : null;
    const updateCurrentBac = setInterval(() => {
      const newBac = getCurrentBac(myDrinks);
      setCurrentBac(newBac);
    }, 1000);
    return () => clearInterval(updateCurrentBac);
  }, [me?.$isLoaded && me.root.myDrinks]);

  return (
    <>
      <Header />

      <main className="px-2 pb-6 flex flex-col gap-2 max-w-lg mx-auto w-full">
        {me?.$isLoaded && !me.root.hasAcceptedTerms && <AcceptTerms />}
        <CurrentState
          currentBac={currentBac}
          lastDrink={drinks ? drinks[0] : undefined}
          target={me?.$isLoaded ? me.root.myTarget : undefined}
        />
        {me && <AddDrink currentBac={currentBac} me={me} />}
        {drinks && <DrinkList drinks={drinks} />}
        {drinks && <LastSevenDays drinks={drinks} />}
        {drinks && <AverageStats drinks={drinks} />}
        {me && <Settings me={me} />}
        <HelpfulLinks />
        <Disclaimer />
      </main>
    </>
  );
}
