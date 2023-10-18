import { Menu, Send } from "lucide-react";

import { db } from "@/config";
import { MessageType } from "@/lib/types";
import { cn, fallbackDisplayname } from "@/lib/utils";
import useAuthStore from "@/stores/auth";
import useChatStore from "@/stores/chat";
import {
  DocumentData,
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  where,
} from "firebase/firestore";
import {
  SyntheticEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { v4 as uuidv4 } from "uuid";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";
import { Input } from "./ui/input";

export function Chat() {
  const [message, setMessage] = useState<string>("");

  const {
    rooms,
    selectedRoom,
    messageByRoomId,
    getMessageByRoomId,
    setRoomSelect,
    setMessageByRoomId,
  } = useChatStore();
  const { user } = useAuthStore();
  const { setShowMobileDraw } = useChatStore();

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const detechChatType = useCallback(() => {
    // USER CHAT
    if (!selectedRoom?.isGroup) {
      const userFilter = selectedRoom.members?.find(
        (member) => member.uid !== user?.uid
      );

      const uid = userFilter?.uid;
      const avatar = userFilter?.photoURL;
      const email = userFilter?.email;
      const displayName = userFilter?.displayName;

      return (
        <div key={uid} className="flex items-center space-x-4">
          <i
            onClick={() => setShowMobileDraw(true)}
            className="md:hidden md:max-w-none cursor-pointer"
          >
            <Menu />
          </i>

          <Avatar>
            <AvatarImage src={avatar} alt="Image" />
            <AvatarFallback>{fallbackDisplayname(displayName)}</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium leading-none">{displayName}</p>
            <p className="text-sm text-muted-foreground">{email}</p>
          </div>
        </div>
      );
    }

    // GROUP CHAT
    const usersGroup = selectedRoom?.members?.reduce(
      (acc: string[], value: DocumentData) => {
        if (value?.displayName) return acc.concat([value.displayName]);
        return acc;
      },
      [] as string[]
    );

    return (
      <div className="flex items-center space-x-4">
        <i
          onClick={() => setShowMobileDraw(true)}
          className="md:hidden md:max-w-none cursor-pointer"
        >
          <Menu />
        </i>

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
    );
  }, [
    selectedRoom?.isGroup,
    selectedRoom.members,
    setShowMobileDraw,
    user?.uid,
  ]);

  const handleReadMessage = useCallback(() => {
    if (selectedRoom?.roomId) {
      const q = query(
        collection(db, "rooms", selectedRoom?.roomId, "messages"),
        where("read", "==", false)
      );
      onSnapshot(q, (snapshot) => {
        snapshot.docChanges().forEach((change) => {
          console.log(change.doc.data());
        });
      });
    }

    console.log("runnn");
  }, [selectedRoom?.roomId]);

  const handleSendChat = useCallback(
    async (e: SyntheticEvent) => {
      e.preventDefault();

      if (user?.uid && selectedRoom?.roomId) {
        const messageSend: MessageType = {
          senderId: user?.uid,
          content: message,
          createdAt: serverTimestamp(),
          displayName: user?.displayName,
          photoURL: user?.photoURL ?? "",
        };

        await setDoc(
          doc(db, "rooms", selectedRoom?.roomId, "messages", uuidv4()),
          messageSend
        );

        setMessage("");
      }
    },
    [
      message,
      selectedRoom?.roomId,
      user?.displayName,
      user?.photoURL,
      user?.uid,
    ]
  );

  // selected room on first start
  useEffect(() => {
    if (!selectedRoom?.roomId && rooms?.length) {
      setRoomSelect(rooms[0]);
    }
  }, [rooms, selectedRoom?.roomId, setRoomSelect]);

  // listener event chat event
  useEffect(() => {
    if (selectedRoom?.roomId) {
      const q = query(
        collection(db, "rooms", selectedRoom?.roomId, "messages"),
        orderBy("createdAt", "asc")
      );
      const unsubscribe = onSnapshot(q, (snapshot) => {
        snapshot.docChanges().forEach((change) => {
          if (change.type === "added") {
            const newMessage = change.doc.data() as MessageType;

            if (newMessage.senderId !== user?.uid) {
              setMessageByRoomId(change.doc.data() as MessageType);
              messagesEndRef?.current?.scrollTo({
                behavior: "smooth",
                top: 0,
              });
            }
          }
          if (change.type === "modified") {
            setMessageByRoomId(change.doc.data() as MessageType);
            messagesEndRef?.current?.scrollTo({
              behavior: "smooth",
              top: 0,
            });
          }
        });
      });

      // Stop listening to changes
      return () => unsubscribe();
    }
  }, [selectedRoom?.roomId, setMessageByRoomId, user?.uid]);

  // Auto select room ID if have one
  useEffect(() => {
    if (selectedRoom?.roomId) {
      getMessageByRoomId(selectedRoom?.roomId);
    }
  }, [getMessageByRoomId, selectedRoom?.roomId]);

  useEffect(() => {
    if (message) {
      messagesEndRef?.current?.scrollTo({
        behavior: "smooth",
        top: 0,
      });
    }
  }, [message]);

  if (!selectedRoom?.roomId) {
    return (
      <Card>
        <CardHeader className="flex flex-col items-center justify-center h-full">
          <img
            src="https://firebasestorage.googleapis.com/v0/b/chat-f60b9.appspot.com/o/empty.svg?alt=media&token=8e92ccb7-f17b-4300-b80f-e433701065f0&_gl=1*whwqrv*_ga*NzE3OTE0NDQ0LjE2OTc1MjQ0MDc.*_ga_CW55HF8NVT*MTY5NzUyNDQwNy4xLjEuMTY5NzU0Mzk5Ny4yOC4wLjA."
            alt="empty"
            className="max-w-[30%]"
          />
          <h3 className="font-semibold text-lg leading-none tracking-tight p-8 m-auto">
            Please search users to create chat room
          </h3>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="w-full h-full">
      <Card>
        <CardHeader className="flex flex-row items-center">
          {detechChatType()}
        </CardHeader>

        <CardContent ref={messagesEndRef} className="flex flex-col-reverse">
          <div key={selectedRoom?.roomId} className="space-y-4 max-h-max">
            {messageByRoomId?.map((data, index) => (
              <div
                key={index}
                className={cn(
                  "flex gap-2 items-center",
                  data.senderId === user?.uid
                    ? ""
                    : "flex-row-reverse justify-end"
                )}
              >
                <div
                  className={cn(
                    "flex w-max max-w-[75%] flex-col gap-2 rounded-lg px-3 py-2 text-sm",
                    data.senderId === user?.uid
                      ? "ml-auto bg-primary text-primary-foreground"
                      : "bg-muted"
                  )}
                >
                  {data.content}
                </div>
                <Avatar>
                  <AvatarImage src={data?.photoURL} alt="Image" />
                  <AvatarFallback>
                    {fallbackDisplayname(data?.displayName)}
                  </AvatarFallback>
                </Avatar>
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter>
          <form
            onSubmit={handleSendChat}
            className="flex w-full items-center space-x-2"
          >
            <Input
              id="message"
              placeholder="Type your message..."
              className="flex-1"
              autoComplete="off"
              value={message}
              onFocus={handleReadMessage}
              onChange={(event) => setMessage(event.target.value)}
            />
            <Button type="submit" size="icon" disabled={message.length === 0}>
              <Send className="h-4 w-4" />
              <span className="sr-only">Send</span>
            </Button>
          </form>
        </CardFooter>
      </Card>
    </div>
  );
}
