import useChatStore from "@/stores/chat";
import { useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { DocumentData } from "firebase/firestore";
import useAuthStore from "@/stores/auth";

export function ChatList() {
  const { user } = useAuthStore();
  const { rooms, getRoomsUser } = useChatStore();

  useEffect(() => {
    if (user) {
      getRoomsUser({
        displayName: user.displayName,
        email: user?.email ?? "",
        photoURL: user?.photoURL ?? "",
        uid: user?.uid,
      });
    }
  }, [getRoomsUser, user]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Chat list</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-6">
        {rooms.map((item) => {
          const members = item?.members;

          // USER CHAT
          if (members?.length === 1) {
            const uid = members?.[0]?.uid;
            const avatar = members?.[0]?.photoURL;
            const email = members?.[0]?.email;
            const displayName = members?.[0]?.displayName;

            return (
              <div
                key={uid}
                className="flex items-center justify-between space-x-4"
              >
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarImage src={avatar} />
                    <AvatarFallback>OM</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium leading-none capitalize">
                      {displayName}
                    </p>
                    <p className="text-sm text-muted-foreground">{email}</p>
                  </div>
                </div>
              </div>
            );
          }

          // GROUP CHAT
          const usersGroup = members?.reduce(
            (acc: string[], value: DocumentData) => {
              if (value?.displayName) return acc.concat([value.displayName]);
              return acc;
            },
            [] as string[]
          );

          return (
            <div className="flex items-center justify-between space-x-4">
              <div className="flex items-center space-x-4">
                <Avatar>
                  <AvatarFallback>GR</AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex gap-1">
                    {usersGroup?.map((userName: string, i: number) => (
                      <p
                        key={`${userName}-${i}`}
                        className="text-sm font-medium leading-none capitalize"
                      >
                        {userName + (usersGroup.length === i + 1 ? "" : ",")}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
