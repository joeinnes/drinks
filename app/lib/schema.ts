import { Account, co, CoList, CoMap } from "jazz-tools";

export class Drink extends CoMap {
  name = co.string;
  volume = co.number;
  percent = co.number;
  bacAddition = co.number; // I thought about storing only the percent and deriving the BAC later, but if the user changes weight, BAC should not change.
  date = co.Date;
  isDeleted = co.boolean;
}
export class ListOfDrinks extends CoList.Of(co.ref(Drink)) {}

export class DrinksRoot extends CoMap {
  hasAcceptedTerms = co.boolean;
  myDrinks = co.ref(ListOfDrinks);
  myWeight = co.number;
  myGender = co.literal("male", "female");
  myTarget = co.number;
  myWeeklyTarget = co.number;
}

export class DrinksAccount extends Account {
  name = co.string;
  root = co.ref(DrinksRoot);

  async migrate(this: DrinksAccount) {
    if (this.root === undefined) {
      console.log(`Migrating account ${this.id}: creating root node`);
      const myDrinks = ListOfDrinks.create([], { owner: this });
      this.root = DrinksRoot.create(
        {
          hasAcceptedTerms: false,
          myWeight: 85000,
          myGender: "male",
          myDrinks,
          myTarget: 0.05,
          myWeeklyTarget: 14,
        },
        { owner: this }
      );
    }

    let { root } = await this.ensureLoaded({
      resolve: { root: true },
    });

    if (root.myDrinks === undefined) {
      console.log(`Migrating account root ${root.id}: creating myMoments list`);
      root.myDrinks = ListOfDrinks.create([], { owner: this });
    }

    root.myWeight ??= 85000;
    root.myGender ??= "male";
    root.myTarget ??= 0.05;
    root.myWeeklyTarget ??= 14;
  }
}
