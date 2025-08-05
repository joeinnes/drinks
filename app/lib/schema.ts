import { Account, co, CoList, CoMap, z } from "jazz-tools";

export const Drink = co.map({
  name: z.string(),
  volume: z.number(),
  percent: z.number(),
  bacAddition: z.number(), // I thought about storing only the percent and deriving the BAC later, but if the user changes weight, BAC should not change.
  date: z.date(),
  isDeleted: z.boolean(),
});

export const ListOfDrinks = co.list(Drink);

export const DrinksRoot = co.map({
  hasAcceptedTerms: z.boolean(),
  myDrinks: co.list(Drink),
  myWeight: z.number(),
  myGender: z.literal(["male", "female"]),
  myTarget: z.number(),
  myWeeklyTarget: z.number(),
});

export const DrinksAccount = co
  .account({
    profile: co.profile(),
    root: DrinksRoot,
  })
  .withMigration(async (account) => {
    if (account.root === undefined) {
      account.root = DrinksRoot.create({
        hasAcceptedTerms: false,
        myWeight: 85000,
        myGender: "male",
        myDrinks: ListOfDrinks.create([]),
        myTarget: 0.05,
        myWeeklyTarget: 14,
      });
    }
    let { root } = await account.ensureLoaded({
      resolve: { root: true },
    });

    if (root.myDrinks === undefined) {
      root.myDrinks = ListOfDrinks.create([]);
    }

    root.myWeight ??= 85000;
    root.myGender ??= "male";
    root.myTarget ??= 0.05;
    root.myWeeklyTarget ??= 14;
  });
