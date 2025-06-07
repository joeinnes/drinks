import { co, Group } from "jazz-tools";
import { DrinksAccount } from "../schema";

export async function onAnonymousAccountDiscarded(
  anonymousAccount: co.loaded<typeof DrinksAccount>
) {
  const { root: drinksRoot } = await anonymousAccount.ensureLoaded({
    resolve: {
      root: {
        myDrinks: true,
      },
    },
  });

  const me = await DrinksAccount.getMe().ensureLoaded({
    resolve: {
      root: {
        myDrinks: true,
      },
    },
  });

  for (const drink of drinksRoot.myDrinks) {
    if (!drink || drink?.isDeleted) continue;
    const drinkGroup = drink._owner.castAs(Group);
    drinkGroup.addMember(me, "admin");
    me.root.myDrinks.push(drink);
  }

  me.root.myGender = drinksRoot.myGender;
  me.root.myTarget = drinksRoot.myTarget;
  me.root.myWeight = drinksRoot.myWeight;
  me.root.myWeeklyTarget = drinksRoot.myWeeklyTarget;
}
