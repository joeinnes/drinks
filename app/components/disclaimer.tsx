import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

export function Disclaimer() {
  return (
    <footer>
      <Card>
        <CardHeader>
          <CardTitle>Disclaimer</CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            Reminder: this app is not to be used to calculate BAC with accuracy,
            and should not be relied on for any purpose. If you or others around
            you have concerns about your drinking, seek professional help.
          </p>
        </CardContent>
      </Card>
    </footer>
  );
}
