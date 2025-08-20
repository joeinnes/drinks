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

import { SettingsIcon } from "lucide-react";
import { DrinksAccount, ListOfDrinks } from "~/lib/schema";
import { AuthModal } from "./authModal";
import type { co } from "jazz-tools";

export function Settings({ me }: { me: co.loaded<typeof DrinksAccount> }) {
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
            <Label>Sex</Label>
            <Select
              value={me?.root?.myGender}
              onValueChange={(val: "male" | "female") => {
                if (!me?.root) return;
                me.root.myGender = val;
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Sex" />
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
          <Button
            variant="destructive"
            onClick={() => {
              const sortedDrinks = me?.root?.myDrinks
                ?.filter(Boolean)
                ?.sort((a, b) =>
                  a && b ? b.date.getTime() - a.date.getTime() : 0,
                );
              console.log(sortedDrinks);
              if (me && me.root) {
                me.root.myDrinks = ListOfDrinks.create(
                  sortedDrinks?.filter((el) => el !== null) || [],
                );
              }
            }}
          >
            Sort Drinks
          </Button>
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
