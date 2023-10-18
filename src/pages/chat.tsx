import { Chat } from "@/components/chat";
import { ModeToggle } from "@/components/mode-toggle";
import { SearchUser } from "@/components/search-user";
import { ChatList } from "@/components/team-members";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { cn, fallbackDisplayname } from "@/lib/utils";
import useAuthStore from "@/stores/auth";
import useChatStore from "@/stores/chat";
import { LogOut, XCircle } from "lucide-react";

const ChatPage = () => {
  useAuth();
  const { user, handleSignOut } = useAuthStore();
  const { showMobileDraw, setShowMobileDraw } = useChatStore();

  return (
    <div className="container mx-auto p-0 md:py-4 h-screen overflow-hidden">
      <div className="grid grid-cols-4 row-span-1 gap-4 h-full">
        <div
          className={cn(
            "col-span-4 bg-white rounded-xl h-full w-full p-4 left-0 top-0 md:col-span-1 absolute md:relative activeDraw md:visible md:translate-x-0",
            showMobileDraw ? "active" : ""
          )}
        >
          <div className="flex md:hidden justify-end mb-2">
            <Button variant="outline" onClick={() => setShowMobileDraw(false)}>
              <XCircle size={16} />
            </Button>
          </div>
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center justify-between space-x-4">
              <div className="flex items-center space-x-4">
                <Avatar>
                  <AvatarImage src={user?.photoURL ?? ""} />
                  <AvatarFallback>
                    {fallbackDisplayname(user?.displayName)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium leading-none">
                    {user?.displayName}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <ModeToggle />

              <Button onClick={handleSignOut}>
                <LogOut size={12} />
              </Button>
            </div>
          </div>
          <div className="pt-4">
            <SearchUser />
          </div>
          <div className="py-4">
            <ChatList />
          </div>
        </div>
        <div className="col-span-4 md:col-span-3">
          <Chat />
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
