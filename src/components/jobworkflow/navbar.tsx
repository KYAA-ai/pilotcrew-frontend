import { History } from "./history";
import { SlashIcon } from "./icons";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import type { User } from "@/lib/utils";
import { useProfile } from "@/contexts/ProfileContext";

export const Navbar = () => {
  const { profile } = useProfile();
  const user: User = {
    id: profile?.id || "",
    name: profile?.name || "User",
  };
  return (
    <>
      <div className="bg-background absolute top-0 left-0 w-dvw py-2 px-3 justify-between flex flex-row items-center z-30">
        <div className="flex flex-row gap-3 items-center">
          <History user={user} />
          <div className="flex flex-row gap-2 items-center">
            <div className="text-zinc-500">
              <SlashIcon size={16} />
            </div>
            <div className="text-sm dark:text-zinc-300 truncate w-28 md:w-fit">
              Pilotcrew.ai chat assistant
            </div>
          </div>
        </div>

        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              className="py-1.5 px-2 h-fit font-normal"
              variant="secondary"
            >
              {user.name}
            </Button>
          </DropdownMenuTrigger>
        </DropdownMenu>
        
      </div>
    </>
  );
};
