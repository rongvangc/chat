import { fallbackDisplayname } from "@/lib/utils";
import useAuthStore from "@/stores/auth";
import useChatStore from "@/stores/chat";
import { DocumentData } from "firebase/firestore";
import { useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

export function ChatList() {
  const { user } = useAuthStore();
  const { rooms, getRoomsUser, setRoomSelect } = useChatStore();

  useEffect(() => {
    if (user) {
      getRoomsUser(user?.uid);
    }
  }, [getRoomsUser, user]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Chat list</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-6">
        {rooms?.map((item) => {
          const members = item?.members;

          // USER CHAT
          if (!item?.isGroup) {
            const userFilter = members?.find(
              (member) => member.uid !== user?.uid
            );

            const uid = userFilter?.uid;
            const avatar = userFilter?.photoURL;
            const email = userFilter?.email;
            const displayName = userFilter?.displayName;

            return (
              <div
                key={uid}
                onClick={() => setRoomSelect(item)}
                className="flex items-center justify-between space-x-4 cursor-pointer rounded-s-full rounded-e-md hover:bg-slate-50"
              >
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarImage src={avatar} />
                    <AvatarFallback>
                      {fallbackDisplayname(displayName)}
                    </AvatarFallback>
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
            <div
              key={item?.roomId}
              onClick={() => setRoomSelect(item)}
              className="flex items-center justify-between space-x-4 cursor-pointer rounded-s-full rounded-e-md hover:bg-slate-50"
            >
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
              {/* {count && (
                <div className="rounded-full bg-red-400 text-white w-7 h-7 flex items-center justify-center">
                  1
                </div>
              )} */}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
