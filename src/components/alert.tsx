import { RocketIcon } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";

export function AlertError() {
  return (
    <Alert variant="destructive">
      <RocketIcon className="h-4 w-4" />
      <AlertTitle>Heads up!</AlertTitle>
      <AlertDescription>Something wrong with your action!</AlertDescription>
    </Alert>
  );
}
