import { Context } from "@/contexts/ContextContext";
import { FC } from "react";
import CreateInboxItem from "./CreateInboxItem";
import Logo from "./Logo";
import ProfilePicture from "./ProfilePicture";

type HeaderProps = {
  context?: Context;
};

const Header: FC<HeaderProps> = ({ context }) => (
  <div className="border-b sticky top-0 left-0 right-0 z-[45] flex flex-col items-center justify-center bg-bgTransparent h-12 md:h-16 w-full">
    <div className="relative flex items-center justify-center w-full xl:w-[80rem]">
      <div className="absolute left-2 flex items-center">
        <CreateInboxItem />
      </div>
      <Logo context={context} />
      <div className="absolute right-2 flex items-center">
        <ProfilePicture />
      </div>
    </div>
  </div>
);

export default Header;
