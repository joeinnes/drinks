import { useAccount, usePasskeyAuth } from "jazz-tools/react";
import { useState } from "react";
import { appName } from "~/lib/utils";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Label } from "./ui/label";
import { Input } from "./ui/input";

export function AuthModal() {
  const [username, setUsername] = useState("");
  const [open, setOpen] = useState(false);
  const [isNew, setIsNew] = useState(false);

  const auth = usePasskeyAuth({
    // Must be inside the JazzProvider!
    appName,
  });
  const { logOut } = useAccount();

  if (auth.state === "signedIn") {
    return (
      <div className="px-4 w-full">
        <Button
          onClick={() => logOut()}
          variant="destructive"
          className="w-full"
        >
          Log Out
        </Button>
      </div>
    );
  }

  const handleSignUp = async () => {
    await auth.signUp(username);
    setOpen(false);
  };

  const handleLogIn = async () => {
    await auth.logIn();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="mx-4">Log in or sign up</Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Log In or Sign Up</DialogTitle>
        </DialogHeader>
        {isNew ? (
          <>
            <Label>Name</Label>
            <Input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <Button onClick={handleSignUp}>Sign up</Button>
            <Button onClick={() => setIsNew(false)} variant="ghost">
              I already have an account
            </Button>
          </>
        ) : (
          <>
            <Button onClick={handleLogIn}>Log in</Button>
            <Button onClick={() => setIsNew(true)} variant="ghost">
              I'm new, sign me up!
            </Button>
          </>
        )}
        <small>
          You don't have to sign in to use this app, but signing in will allow
          you to sync your drinks and settings across devices.
        </small>
      </DialogContent>
    </Dialog>
  );
}
