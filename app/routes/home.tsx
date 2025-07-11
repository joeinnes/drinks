import { useAccount } from "jazz-tools/react";

import type { Route } from "./+types/home";

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

export function meta({ }: Route.MetaArgs) {
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
  const { me } = useAccount(DrinksAccount);

  const [currentBac, setCurrentBac] = useState(0);
  useEffect(() => {
    const updateCurrentBac = setInterval(() => {
      const newBac = getCurrentBac(me?.root?.myDrinks || null);

      setCurrentBac(newBac);
    }, 1000);
    return () => clearInterval(updateCurrentBac);
  });
  return (
    <>
      <Header />

      <main className="p-2 flex flex-col gap-2">
        {!me?.root?.hasAcceptedTerms && <AcceptTerms />}
        <CurrentState currentBac={currentBac} />
        <AddDrink currentBac={currentBac} />
        <DrinkList />
        <AverageStats />
        <LastSevenDays />
        <Settings />
        <HelpfulLinks />
        <Disclaimer />
      </main>
    </>
  );
}
