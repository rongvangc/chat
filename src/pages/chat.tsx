import { Chat } from "@/components/chat";
import { ModeToggle } from "@/components/mode-toggle";
import { SearchUser } from "@/components/search-user";
import { ChatList } from "@/components/team-members";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const ChatPage = () => {
  return (
    <div className="container mx-auto py-4 h-screen overflow-hidden">
      <div className="grid grid-cols-4 row-span-1 gap-4 h-full">
        <div className="col-span-1">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center justify-between space-x-4">
              <div className="flex items-center space-x-4">
                <Avatar>
                  <AvatarImage src="/avatars/01.png" />
                  <AvatarFallback>OM</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium leading-none">
                    Sofia Davis
                  </p>
                </div>
              </div>
            </div>
            <ModeToggle />
          </div>
          <div className="pt-4">
            <SearchUser />
          </div>
          <div className="py-4">
            <ChatList />
          </div>
        </div>
        <div className="col-span-3">
          <Chat />
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
