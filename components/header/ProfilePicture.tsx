import { signOut } from "aws-amplify/auth";
import { LogOut, UserCircle2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import Version from "../version/version";
import useCurrentUser from "@/api/useUser";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const ProfilePicture = () => {
  const { user, createProfile } = useCurrentUser();
  const [open, setOpen] = useState(false);
  const [isCreatingProfile, setIsCreatingProfile] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (isCreatingProfile) return;
    if (!user) return;
    if (!user.hasNoProfile) return;
    setIsCreatingProfile(true);
    createProfile(() => setIsCreatingProfile(false));
  }, [createProfile, isCreatingProfile, user]);

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Avatar className="cursor-pointer">
          <AvatarImage src="/images/profile-pic.jpeg" />
          <AvatarFallback>CK</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>
          {user?.userName && (
            <p className="text-sm font-medium">{user.userName}</p>
          )}
          <p className="text-xs text-muted-foreground">{user?.loginId}</p>
          <p className="text-xs text-muted-foreground font-normal">
            <Version />
          </p>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => router.replace("/profile")}>
          <UserCircle2 className="mr-2 h-4 w-4" />
          <span>Profile</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => signOut()}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
          {/* <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut> */}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ProfilePicture;
