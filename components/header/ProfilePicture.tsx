import useCurrentUser from "@/api/useUser";
import { signOut } from "aws-amplify/auth";
import { getUrl } from "aws-amplify/storage";
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

  const setCurrentImgUrl = async (
    key: string | undefined,
    setUrl: (url: string | undefined) => void
  ) => {
    if (!key) {
      setUrl(undefined);
      return;
    }
    const { url } = await getUrl({ path: key });
    setUrl(url.toString());
  };

  useEffect(() => {
    setCurrentImgUrl(user?.profilePicture, setImgUrl);
  }, [user?.profilePicture]);

  useEffect(() => {
    if (!open) return;
    if (isCreatingProfile) return;
    if (!user?.hasNoProfile) return;
    setIsCreatingProfile(true);
    createProfile(() => setIsCreatingProfile(false));
  }, [createProfile, isCreatingProfile, open, user]);

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Avatar className="cursor-pointer">
          <AvatarImage src={imageUrl} />
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
        <DropdownMenuItem asChild>
          <Link href="/profile">
            <UserCircle2 className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </Link>
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
