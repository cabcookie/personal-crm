import { Context } from "@/contexts/ContextContext";
import { useNavMenuContext } from "@/contexts/NavMenuContext";
import { FC } from "react";
import styles from "./Logo.module.css";

type LogoProps = {
  context?: Context;
};

const Logo: FC<LogoProps> = ({ context }) => {
  const { toggleMenu } = useNavMenuContext();

  return (
    <div className="flex items-center cursor-pointer" onClick={toggleMenu}>
      <div className={`${styles.logoIcon} w-12 h-12 md:w-16 md:h-16 block`} />
      <div className="hidden sm:flex items-center font-black uppercase mr-4">
        {context || "Impulso"}
      </div>
    </div>
  );
};

export default Logo;
