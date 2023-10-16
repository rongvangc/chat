import { db } from "@/config";
import { UserType } from "@/lib/types";
import { cn } from "@/lib/utils";
import useAuthStore from "@/stores/auth";
import {
  collection,
  doc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  where,
} from "firebase/firestore";
import { Check } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./ui/command";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";

export const SearchUser = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [users, setUsers] = useState<UserType[]>();
  const [selectedUsers, setSelectedUsers] = useState<UserType[]>([]);
  const { user } = useAuthStore();

  const getAllUser = useCallback(async () => {
    const q = query(
      collection(db, "users"),
      where("displayName", "!=", user?.displayName)
    );
    let docs = [] as UserType[];
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      docs = docs.concat(doc.data() as UserType);
    });

    setUsers(docs);
  }, [user?.displayName]);

  const handleSelect = async () => {
    const listUID = selectedUsers?.reduce((acc, value) => {
      if (value?.uid) return acc.concat([value.uid]);
      return acc;
    }, [] as string[]);

    //create unique ID for room
    const roomId = listUID.join("-") + serverTimestamp();

    try {
      await setDoc(doc(db, "rooms", roomId), {
        roomId: roomId,
        createdAt: serverTimestamp(),
        members: selectedUsers,
      });
    } catch (err) {
      console.error(err);
    }
  };

  // get all users
  useEffect(() => {
    getAllUser();
  }, [getAllUser]);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "f" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <>
      <Button
        variant="outline"
        className={cn(
          "relative w-full justify-start text-sm text-muted-foreground"
        )}
        onClick={() => setOpen(true)}
      >
        <span className="hidden lg:inline-flex">Search users...</span>
        <kbd className="pointer-events-none absolute right-1.5 top-1.5 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
          <span className="text-xs">⌘</span>F
        </kbd>
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="gap-0 p-0 outline-none">
          <DialogHeader className="px-4 pb-4 pt-5">
            <DialogTitle>New message</DialogTitle>
            <DialogDescription>
              Invite a user to this thread. This will create a new group
              message.
            </DialogDescription>
          </DialogHeader>
          <Command className="overflow-hidden rounded-t-none border-t">
            <CommandInput placeholder="Search user..." />
            <CommandList>
              <CommandEmpty>No users found.</CommandEmpty>
              <CommandGroup className="p-2">
                {users?.map((user) => (
                  <CommandItem
                    key={user?.email}
                    className="flex items-center px-2"
                    onSelect={() => {
                      if (selectedUsers.includes(user)) {
                        return setSelectedUsers(
                          selectedUsers.filter(
                            (selectedUser) => selectedUser !== user
                          )
                        );
                      }

                      return setSelectedUsers(
                        [...users].filter((u) =>
                          [...selectedUsers, user].includes(u)
                        )
                      );
                    }}
                  >
                    <Avatar>
                      <AvatarImage src={user?.photoURL ?? ""} alt="Image" />
                      <AvatarFallback>
                        {user?.displayName?.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="ml-2">
                      <p className="text-sm font-medium leading-none">
                        {user?.displayName}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {user?.email}
                      </p>
                    </div>
                    {selectedUsers.includes(user) ? (
                      <Check className="ml-auto flex h-5 w-5 text-primary" />
                    ) : null}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
          <DialogFooter className="flex items-center border-t p-4 sm:justify-between">
            {selectedUsers.length > 0 ? (
              <div className="flex -space-x-2 overflow-hidden">
                {selectedUsers.map((user) => (
                  <Avatar
                    key={user?.displayName}
                    className="inline-block border-2 border-background"
                  >
                    <AvatarImage src={user?.photoURL ?? ""} />
                    <AvatarFallback>
                      {user?.displayName?.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                Select users to add to this thread.
              </p>
            )}
            <Button
              disabled={selectedUsers.length < 1}
              onClick={() => {
                setOpen(false);
                handleSelect();
              }}
            >
              Continue
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
