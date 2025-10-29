import { co } from "jazz-tools";
import { DrinksAccount } from "../schema";

export async function onAnonymousAccountDiscarded(
  anonymousAccount: co.loaded<typeof DrinksAccount>,
) {
  const { root: drinksRoot } = await anonymousAccount.$jazz.ensureLoaded({
    resolve: {
      root: {
        myDrinks: true,
      },
    },
  });

  const me = await DrinksAccount.getMe().$jazz.ensureLoaded({
    resolve: {
      root: {
        myDrinks: true,
      },
    },
  });

  for (let i = 0; i < drinksRoot.myDrinks.length; i++) {
    const drink = drinksRoot.myDrinks[i];
    if (!drink || !drink.$isLoaded) continue;
    if (drink.isDeleted) continue;
    const drinkGroup = drink.$jazz.owner;
    drinkGroup.addMember(me, "admin");
    me.root.myDrinks.$jazz.unshift(drink);
  }

  me.root.$jazz.set("myGender", drinksRoot.myGender);
  me.root.$jazz.set("myTarget", drinksRoot.myTarget);
  me.root.$jazz.set("myWeight", drinksRoot.myWeight);
  me.root.$jazz.set("myWeeklyTarget", drinksRoot.myWeeklyTarget);
}
