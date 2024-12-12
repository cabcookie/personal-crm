import { User } from "@/api/useUser";
import { setCurrentImgUrl } from "@/helpers/user/user";
import { cn } from "@/lib/utils";
import { defaultTo, flow, get, identity, join, map, split } from "lodash/fp";
import { FC, useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

interface CircleProfileImgProps {
  user?: User;
  className?: string;
  fallbackInitials?: string;
}

const CircleProfileImg: FC<CircleProfileImgProps> = ({
  user,
  className,
  fallbackInitials,
}) => {
  const [imageUrl, setImgUrl] = useState<string | undefined>(undefined);
  const [initials, setInitials] = useState<string | undefined>(
    fallbackInitials ?? "NA"
  );

  useEffect(() => {
    flow(
      identity<User | undefined>,
      get("userName"),
      split(" "),
      map(0),
      join(""),
      defaultTo(fallbackInitials ?? "NA"),
      setInitials
    )(user);
  }, [fallbackInitials, user]);

  useEffect(() => {
    setCurrentImgUrl(user?.profilePicture, setImgUrl);
  }, [user?.profilePicture]);

  return (
    <Avatar className={cn(className)}>
      <AvatarImage src={imageUrl} />
      <AvatarFallback>{initials}</AvatarFallback>
    </Avatar>
  );
};

export default CircleProfileImg;
