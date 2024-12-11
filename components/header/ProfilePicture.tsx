import useCurrentUser, { User } from "@/api/useUser";
import { setCurrentImgUrl } from "@/helpers/user/user";
import { signOut } from "aws-amplify/auth";
import { defaultTo, flow, get, identity, join, map, split } from "lodash/fp";
import { LogOut, UserCircle2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
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

const ProfilePicture = () => {
  const { user, createProfile } = useCurrentUser();
  const [open, setOpen] = useState(false);
  const [isCreatingProfile, setIsCreatingProfile] = useState(false);
  const [imageUrl, setImgUrl] = useState<string | undefined>(undefined);
  const [initials, setInitials] = useState<string | undefined>("NA");

  useEffect(() => {
    if (!open) return;
    if (isCreatingProfile) return;
    if (!user?.hasNoProfile) return;
    setIsCreatingProfile(true);
    createProfile(() => setIsCreatingProfile(false));
  }, [createProfile, isCreatingProfile, open, user]);

  useEffect(() => {
    flow(
      identity<User | undefined>,
      get("userName"),
      split(" "),
      map(0),
      join(""),
      defaultTo("NA"),
      setInitials
    )(user);
  }, [user]);

  useEffect(() => {
    setCurrentImgUrl(user?.profilePicture, setImgUrl);
  }, [user?.profilePicture]);

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Avatar className="cursor-pointer">
          <AvatarImage src={imageUrl} />
          <AvatarFallback>{initials}</AvatarFallback>
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
        <DropdownMenuItem asChild>
          <Link href="/profile">
            <UserCircle2 className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => signOut()}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ProfilePicture;
