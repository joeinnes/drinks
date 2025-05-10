import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerTitle,
  DrawerTrigger,
  DrawerContent,
  DrawerClose,
  DrawerHeader,
  DrawerFooter,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { useAccount } from "jazz-react";

import { SettingsIcon } from "lucide-react";
import { Drink } from "~/lib/schema";
import { AuthModal } from "./authModal";

export function Settings() {
  const { me } = useAccount();
  const oldDrinks = window.localStorage.getItem("drinks");
  const drinks = oldDrinks ? JSON.parse(oldDrinks) : [];
  return (
    <Drawer repositionInputs={false}>
      <DrawerTrigger asChild>
        <Button variant="outline">
          <SettingsIcon className="mr-2" />
          Settings
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerClose />
        <DrawerHeader>
          <DrawerTitle>Settings</DrawerTitle>
        </DrawerHeader>
        <div className="p-4 pt-0 space-y-4">
          <div>
            <Label>Weight</Label>
            <Input
              type="number"
              value={me?.root?.myWeight}
              onChange={(e) => {
                e.preventDefault();
                if (!me?.root) return;
                me.root.myWeight = parseInt(e.target.value);
              }}
            />
          </div>
          <div>
            <Label>Gender</Label>
            <Select
              value={me?.root?.myGender}
              onValueChange={(val: "male" | "female") => {
                if (!me?.root) return;
                me.root.myGender = val;
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Target</Label>
            <Input
              type="number"
              value={me?.root?.myTarget}
              onChange={(e) => {
                e.preventDefault();
                if (!me?.root) return;
                me.root.myTarget = parseFloat(e.target.value);
              }}
            />
          </div>
          <div>
            <Label>Weekly Unit Target</Label>
            <Input
              type="number"
              value={me?.root?.myWeeklyTarget}
              onChange={(e) => {
                e.preventDefault();
                if (!me?.root) return;
                me.root.myWeeklyTarget = parseInt(e.target.value);
              }}
            />
          </div>
          {drinks && (
            <div className="grid grid-cols-2 gap-2">
              <Button
                className="w-full"
                onClick={() => {
                  if (window.localStorage.getItem("drinksImported") === "true")
                    alert("You have already imported your drinks");
                  drinks.forEach((drink: any) => {
                    const newDrink = Drink.create({
                      name: drink.name,
                      volume: drink.volume,
                      percent: 1,
                      date: new Date(drink.datetime),
                      bacAddition: drink.bac,
                      isDeleted: false,
                    });
                    me.root?.myDrinks?.push(newDrink);
                  });
                  window.localStorage.setItem("drinksImported", "true");
                }}
              >
                Import old drinks
              </Button>
              <Button
                variant={"destructive"}
                onClick={() => {
                  window.localStorage.removeItem("drinks");
                }}
                className="w-full"
              >
                Delete old drinks
              </Button>
            </div>
          )}
        </div>
        <AuthModal />

        <DrawerFooter>
          <DrawerClose asChild>
            <Button>Save</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
