import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

export function ChatList() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Chat list</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-6">
        <div className="flex items-center justify-between space-x-4">
          <div className="flex items-center space-x-4">
            <Avatar>
              <AvatarImage src="/avatars/01.png" />
              <AvatarFallback>OM</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium leading-none">Sofia Davis</p>
              <p className="text-sm text-muted-foreground">m@example.com</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
